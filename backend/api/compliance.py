import json
import re
from collections import defaultdict
from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.deps import get_current_user
from core.http import api_error
from core.transaction_types import TransactionTypes
from database.session import get_db
from models.compliance import GstClassificationOverride, GstClassificationStatus, TransactionGstProfile
from models.ledger import LedgerEntry, Transaction, TransactionStatus
from models.user import User
from schemas.compliance import GstOverrideRequest

router = APIRouter()

GSTIN_REGEX = re.compile(r"^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$")
DEFAULT_TAX_RATE = 0.18

NON_GST_TYPES = {
    TransactionTypes.P2P,
    TransactionTypes.BOND_PURCHASE,
    TransactionTypes.BOND_TRANSFER,
    TransactionTypes.BOND_REDEMPTION,
    TransactionTypes.BOND_MATURITY_SETTLEMENT,
}


def parse_period(period: str) -> tuple[datetime, datetime]:
    try:
        start = datetime.strptime(period, "%Y-%m")
    except ValueError:
        api_error(400, "INVALID_PERIOD", "Period must be in YYYY-MM format.")
    if start.month == 12:
        end = datetime(start.year + 1, 1, 1)
    else:
        end = datetime(start.year, start.month + 1, 1)
    return start, end


def extract_amount_paise(db: Session, transaction_id: str) -> int:
    entry = db.query(LedgerEntry).filter(LedgerEntry.transaction_id == transaction_id).first()
    if not entry:
        return 0
    return abs(int(entry.amount))


def infer_gstin(metadata: dict | None) -> str | None:
    if not metadata:
        return None
    for key in ("gstin", "counterparty_gstin"):
        value = metadata.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip().upper()
    return None


def compute_tax_split(
    taxable_value_paise: int,
    gstin: str | None,
    user_gstin: str | None,
    tax_rate: float = DEFAULT_TAX_RATE,
) -> tuple[int, int, int]:
    total_tax = int(round(taxable_value_paise * tax_rate))
    if total_tax <= 0:
        return 0, 0, 0

    if gstin and user_gstin and len(gstin) >= 2 and len(user_gstin) >= 2 and gstin[:2] == user_gstin[:2]:
        half = total_tax // 2
        return half, total_tax - half, 0
    return 0, 0, total_tax


def classify_transaction(
    db: Session,
    txn: Transaction,
    user: User,
    period: str,
) -> TransactionGstProfile:
    metadata = {}
    if txn.transaction_metadata:
        try:
            metadata = json.loads(txn.transaction_metadata)
        except Exception:
            metadata = {}

    amount_paise = extract_amount_paise(db, txn.id)
    txn_type = txn.transaction_type or TransactionTypes.GENERIC
    gst_applicable = txn_type not in NON_GST_TYPES and amount_paise > 0
    gstin = infer_gstin(metadata)
    taxable_value_paise = amount_paise if gst_applicable else 0
    status = GstClassificationStatus.NOT_APPLICABLE
    confidence = 0.9 if gst_applicable else 0.98

    if gst_applicable:
        if not gstin:
            status = GstClassificationStatus.MISSING_GSTIN
            confidence = 0.65
        elif not GSTIN_REGEX.match(gstin):
            status = GstClassificationStatus.INVALID_GSTIN
            confidence = 0.55
        else:
            status = GstClassificationStatus.VALID
            confidence = 0.88

    cgst, sgst, igst = compute_tax_split(taxable_value_paise, gstin, user.gstin)

    profile = TransactionGstProfile(
        transaction_id=txn.id,
        user_id=user.id,
        period_month=period,
        transaction_type=txn_type,
        amount_paise=amount_paise,
        gst_applicable=gst_applicable,
        gstin=gstin,
        taxable_value_paise=taxable_value_paise,
        cgst_paise=cgst,
        sgst_paise=sgst,
        igst_paise=igst,
        confidence=confidence,
        status=status,
        source="AUTO",
    )
    db.add(profile)
    return profile


def ensure_profiles(db: Session, user: User, period: str) -> list[TransactionGstProfile]:
    start, end = parse_period(period)
    txns = db.query(Transaction).filter(
        Transaction.user_id == user.id,
        Transaction.status == TransactionStatus.COMPLETED,
        Transaction.posted_date >= start,
        Transaction.posted_date < end,
    ).all()

    profiles: list[TransactionGstProfile] = []
    for txn in txns:
        existing = db.query(TransactionGstProfile).filter(TransactionGstProfile.transaction_id == txn.id).first()
        if existing:
            profiles.append(existing)
            continue
        profiles.append(classify_transaction(db, txn, user, period))
    db.commit()
    return profiles


@router.get("/gst-summary")
def get_gst_summary(
    period: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profiles = ensure_profiles(db, current_user, period)

    tx_type_totals: dict[str, int] = defaultdict(int)
    taxable_total = 0
    cgst_total = 0
    sgst_total = 0
    igst_total = 0
    gst_count = 0
    exception_count = 0

    for p in profiles:
        tx_type_totals[p.transaction_type] += p.amount_paise
        taxable_total += p.taxable_value_paise
        cgst_total += p.cgst_paise
        sgst_total += p.sgst_paise
        igst_total += p.igst_paise
        if p.gst_applicable:
            gst_count += 1
        if p.status in (GstClassificationStatus.MISSING_GSTIN, GstClassificationStatus.INVALID_GSTIN):
            exception_count += 1

    return {
        "period": period,
        "total_transactions": len(profiles),
        "gst_applicable_transactions": gst_count,
        "exceptions_count": exception_count,
        "taxable_value_inr": taxable_total / 100,
        "cgst_inr": cgst_total / 100,
        "sgst_inr": sgst_total / 100,
        "igst_inr": igst_total / 100,
        "total_tax_inr": (cgst_total + sgst_total + igst_total) / 100,
        "category_totals": [
            {"transaction_type": tx_type, "amount_inr": amount / 100}
            for tx_type, amount in sorted(tx_type_totals.items())
        ],
    }


@router.get("/exceptions")
def get_gst_exceptions(
    period: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ensure_profiles(db, current_user, period)
    exceptions = db.query(TransactionGstProfile).filter(
        TransactionGstProfile.user_id == current_user.id,
        TransactionGstProfile.period_month == period,
        TransactionGstProfile.status.in_([GstClassificationStatus.MISSING_GSTIN, GstClassificationStatus.INVALID_GSTIN]),
    ).order_by(TransactionGstProfile.updated_at.desc()).all()

    result = []
    for ex in exceptions:
        txn = db.query(Transaction).filter(Transaction.id == ex.transaction_id).first()
        result.append(
            {
                "transaction_id": ex.transaction_id,
                "description": txn.description if txn else "Unknown Transaction",
                "transaction_type": ex.transaction_type,
                "amount_inr": ex.amount_paise / 100,
                "status": ex.status.value,
                "gstin": ex.gstin,
                "confidence": ex.confidence,
                "updated_at": ex.updated_at.isoformat(),
            }
        )
    return {"period": period, "exceptions": result}


@router.post("/override-classification")
def override_classification(
    payload: GstOverrideRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = db.query(TransactionGstProfile).filter(
        TransactionGstProfile.transaction_id == payload.transaction_id,
        TransactionGstProfile.user_id == current_user.id,
    ).first()
    if not profile:
        api_error(404, "CLASSIFICATION_NOT_FOUND", "Classification profile not found for transaction.")

    before = {
        "gst_applicable": profile.gst_applicable,
        "gstin": profile.gstin,
        "taxable_value_paise": profile.taxable_value_paise,
        "cgst_paise": profile.cgst_paise,
        "sgst_paise": profile.sgst_paise,
        "igst_paise": profile.igst_paise,
        "status": profile.status.value,
        "confidence": profile.confidence,
    }

    if payload.gst_applicable is not None:
        profile.gst_applicable = payload.gst_applicable
    if payload.gstin is not None:
        profile.gstin = payload.gstin.strip().upper() if payload.gstin else None
    if payload.taxable_value_paise is not None:
        if payload.taxable_value_paise < 0:
            api_error(400, "INVALID_TAXABLE_VALUE", "taxable_value_paise must be non-negative.")
        profile.taxable_value_paise = payload.taxable_value_paise
    elif payload.gst_applicable is not None and not payload.gst_applicable:
        profile.taxable_value_paise = 0

    if not profile.gst_applicable:
        profile.status = GstClassificationStatus.NOT_APPLICABLE
        profile.cgst_paise = 0
        profile.sgst_paise = 0
        profile.igst_paise = 0
    else:
        if not profile.gstin:
            profile.status = GstClassificationStatus.MISSING_GSTIN
        elif not GSTIN_REGEX.match(profile.gstin):
            profile.status = GstClassificationStatus.INVALID_GSTIN
        else:
            profile.status = GstClassificationStatus.OVERRIDDEN

        tax_rate = payload.tax_rate_percent / 100 if payload.tax_rate_percent is not None else DEFAULT_TAX_RATE
        if tax_rate < 0:
            api_error(400, "INVALID_TAX_RATE", "tax_rate_percent must be non-negative.")
        cgst, sgst, igst = compute_tax_split(profile.taxable_value_paise, profile.gstin, current_user.gstin, tax_rate)
        profile.cgst_paise = cgst
        profile.sgst_paise = sgst
        profile.igst_paise = igst

    profile.source = "MANUAL_OVERRIDE"
    profile.confidence = 1.0

    after = {
        "gst_applicable": profile.gst_applicable,
        "gstin": profile.gstin,
        "taxable_value_paise": profile.taxable_value_paise,
        "cgst_paise": profile.cgst_paise,
        "sgst_paise": profile.sgst_paise,
        "igst_paise": profile.igst_paise,
        "status": profile.status.value,
        "confidence": profile.confidence,
    }

    db.add(
        GstClassificationOverride(
            profile_id=profile.id,
            transaction_id=profile.transaction_id,
            user_id=current_user.id,
            reason=payload.reason,
            before_snapshot=json.dumps(before),
            after_snapshot=json.dumps(after),
        )
    )
    db.add(profile)
    db.commit()

    return {
        "message": "Classification override applied.",
        "transaction_id": profile.transaction_id,
        "status": profile.status.value,
    }

