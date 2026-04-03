import json
from collections import defaultdict
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.deps import get_current_user
from api.payments import get_wallet
from core.http import api_error
from core.transaction_types import TransactionTypes
from database.session import get_db
from models.bonds import Bond, BondRiskProfile
from models.ledger import EntryDirection, LedgerEntry, Transaction, TransactionStatus
from models.user import User
from schemas.intelligence import MandateAdvisorRequest

router = APIRouter()


def _wallet_tx_rows(db: Session, user_id: str, days: int):
    wallet = get_wallet(db, user_id)
    since = datetime.utcnow() - timedelta(days=days)
    return (
        db.query(LedgerEntry, Transaction)
        .join(Transaction, LedgerEntry.transaction_id == Transaction.id)
        .filter(
            LedgerEntry.account_id == wallet.id,
            Transaction.status == TransactionStatus.COMPLETED,
            Transaction.posted_date >= since,
        )
        .order_by(Transaction.posted_date.desc())
        .all()
    )


def _metadata(raw: str | None) -> dict:
    if not raw:
        return {}
    try:
        return json.loads(raw)
    except Exception:
        return {}


@router.get("/spending-intent")
def spending_intent_analysis(
    days: int = 60,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if days <= 0:
        days = 60
    rows = _wallet_tx_rows(db, current_user.id, days)

    intent_counts: dict[str, int] = defaultdict(int)
    intent_volume: dict[str, int] = defaultdict(int)
    sticky_counterparty_counts: dict[str, int] = defaultdict(int)
    outflow_total = 0
    outflow_count = 0

    for entry, txn in rows:
        if entry.direction != EntryDirection.CREDIT:
            continue
        outflow_count += 1
        amount = abs(int(entry.amount))
        outflow_total += amount
        intent = txn.transaction_type or TransactionTypes.GENERIC
        intent_counts[intent] += 1
        intent_volume[intent] += amount

        md = _metadata(txn.transaction_metadata)
        cp = md.get("recipient_mobile") or md.get("target_type") or md.get("counterparty_vpa")
        if isinstance(cp, str) and cp.strip():
            sticky_counterparty_counts[cp.strip()] += 1

    ranked_intents = sorted(
        intent_counts.keys(),
        key=lambda key: (intent_counts[key], intent_volume[key]),
        reverse=True,
    )

    top_intents = [
        {
            "intent": intent,
            "count": intent_counts[intent],
            "volume_inr": intent_volume[intent] / 100,
        }
        for intent in ranked_intents[:7]
    ]
    sticky_entities = [
        {"entity": entity, "count": count}
        for entity, count in sorted(sticky_counterparty_counts.items(), key=lambda item: item[1], reverse=True)
        if count >= 3
    ][:7]

    return {
        "window_days": days,
        "outflow_transactions": outflow_count,
        "outflow_volume_inr": outflow_total / 100,
        "top_intents": top_intents,
        "sticky_behavior": sticky_entities,
        "vpa_intelligence": {
            "status": "API_NOT_CONNECTED",
            "note": "VPA enrichment API can be plugged into this endpoint when available.",
        },
    }


@router.get("/cashflow-forecast")
def cashflow_forecast(
    horizon_days: int = 7,
    history_days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if horizon_days <= 0:
        horizon_days = 7
    if history_days < 7:
        history_days = 7

    rows = _wallet_tx_rows(db, current_user.id, history_days)
    if not rows:
        return {
            "history_days": history_days,
            "horizon_days": horizon_days,
            "forecast_generated_at": datetime.utcnow().isoformat(),
            "daily_forecast": [],
            "summary": {
                "expected_net_inr": 0,
                "lower_bound_inr": 0,
                "upper_bound_inr": 0,
                "method": "rolling-average-v1",
            },
        }

    daily_net: dict[str, int] = defaultdict(int)
    for entry, txn in rows:
        key = txn.posted_date.strftime("%Y-%m-%d")
        amount = abs(int(entry.amount))
        if entry.direction == EntryDirection.DEBIT:
            daily_net[key] += amount
        else:
            daily_net[key] -= amount

    ordered_days = sorted(daily_net.keys())
    net_values = [daily_net[day] for day in ordered_days]
    avg = sum(net_values) / len(net_values)
    variance = sum((v - avg) ** 2 for v in net_values) / len(net_values)
    std = variance ** 0.5

    now = datetime.utcnow().date()
    daily_forecast = []
    expected_total = 0
    lower_total = 0
    upper_total = 0

    for i in range(1, horizon_days + 1):
        date = now + timedelta(days=i)
        expected = int(round(avg))
        lower = int(round(avg - std))
        upper = int(round(avg + std))
        expected_total += expected
        lower_total += lower
        upper_total += upper
        daily_forecast.append(
            {
                "date": date.isoformat(),
                "expected_net_inr": expected / 100,
                "lower_bound_inr": lower / 100,
                "upper_bound_inr": upper / 100,
            }
        )

    return {
        "history_days": history_days,
        "horizon_days": horizon_days,
        "forecast_generated_at": datetime.utcnow().isoformat(),
        "daily_forecast": daily_forecast,
        "summary": {
            "expected_net_inr": expected_total / 100,
            "lower_bound_inr": lower_total / 100,
            "upper_bound_inr": upper_total / 100,
            "method": "rolling-average-v1",
        },
    }


@router.post("/mandate-advisor")
def mandate_advisor(
    payload: MandateAdvisorRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.amount_paise <= 0:
        api_error(400, "INVALID_AMOUNT", "amount_paise must be greater than zero.")
    if payload.cycle_days <= 0:
        api_error(400, "INVALID_CYCLE", "cycle_days must be greater than zero.")
    if payload.retries < 0 or payload.retries > 5:
        api_error(400, "INVALID_RETRY_COUNT", "retries must be between 0 and 5.")

    active_bonds = db.query(Bond).filter(Bond.is_active == True).all()
    if not active_bonds:
        api_error(404, "NO_ACTIVE_BONDS", "No active bonds available for mandate advice.")

    risk_pref = payload.risk_preference.lower()
    risk_weights = {
        "conservative": (0.7, 0.2, 0.1),
        "balanced": (0.5, 0.3, 0.2),
        "aggressive": (0.3, 0.2, 0.5),
    }
    safety_w, liquidity_w, yield_w = risk_weights.get(risk_pref, risk_weights["balanced"])

    cycle_seconds = payload.cycle_days * 24 * 3600
    best = None

    for bond in active_bonds:
        rp = db.query(BondRiskProfile).filter(BondRiskProfile.bond_id == bond.id).first()
        safety = rp.safety_score if rp else 75
        liquidity = rp.liquidity_score if rp else 65
        maturity_fit = 1.0 - min(1.0, abs(bond.maturity_seconds - cycle_seconds) / max(cycle_seconds, 1))
        score = (safety * safety_w) + (liquidity * liquidity_w) + (bond.apy_rate * 10 * yield_w) + (maturity_fit * 15)

        if best is None or score > best["score"]:
            best = {
                "bond": bond,
                "risk_profile": rp,
                "score": round(score, 4),
                "maturity_fit": round(maturity_fit, 4),
            }

    if best is None:
        api_error(500, "MANDATE_ADVISOR_FAILED", "Unable to evaluate mandate advisor candidates.")

    bond = best["bond"]
    projected_cycle_yield = payload.amount_paise * (bond.apy_rate / 100.0) * (payload.cycle_days / 365.0)
    retry_windows = []
    for idx in range(payload.retries):
        retry_windows.append(
            {
                "retry_number": idx + 1,
                "after_days": idx + 1,
                "recommended_time_utc": f"T+{idx + 1} day(s) at 04:00 UTC",
            }
        )

    return {
        "input": {
            "amount_inr": payload.amount_paise / 100,
            "cycle_days": payload.cycle_days,
            "risk_preference": risk_pref,
            "retries": payload.retries,
        },
        "recommended_bond": {
            "id": bond.id,
            "name": bond.name,
            "apy": bond.apy_rate,
            "maturity_seconds": bond.maturity_seconds,
            "safety_score": best["risk_profile"].safety_score if best["risk_profile"] else 75,
            "liquidity_score": best["risk_profile"].liquidity_score if best["risk_profile"] else 65,
            "selection_score": best["score"],
            "maturity_fit": best["maturity_fit"],
        },
        "mandate_plan": {
            "collection_cycle_days": payload.cycle_days,
            "recommended_collection_window": "09:00-12:00 local time",
            "recommended_retry_windows": retry_windows,
        },
        "profitability_projection": {
            "expected_cycle_yield_inr": round(projected_cycle_yield / 100, 2),
            "expected_annualized_yield_percent": bond.apy_rate,
        },
        "notes": [
            "Mandate amount aligned with cycle and risk preference.",
            "Bond selected using safety/liquidity/yield weighted scoring.",
        ],
    }

