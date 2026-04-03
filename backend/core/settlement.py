import json
from dataclasses import dataclass
from typing import Callable

from sqlalchemy.orm import Session

from models.ledger import LedgerEntry, Transaction, TransactionStatus


@dataclass
class SettlementEntry:
    account_id: str
    direction: str
    amount: int


@dataclass
class SettlementResult:
    transaction: Transaction
    idempotent_replay: bool


def execute_settlement_transaction(
    db: Session,
    *,
    user_id: str,
    description: str,
    transaction_type: str,
    entries: list[SettlementEntry],
    idempotency_key: str | None = None,
    ai_category: str | None = None,
    metadata: dict | None = None,
    on_before_complete: Callable[[Transaction], None] | None = None,
) -> SettlementResult:
    if idempotency_key:
        existing_txn = db.query(Transaction).filter(Transaction.idempotency_key == idempotency_key).first()
        if existing_txn:
            if existing_txn.status == TransactionStatus.FAILED:
                db.query(LedgerEntry).filter(LedgerEntry.transaction_id == existing_txn.id).delete()
                db.delete(existing_txn)
                db.commit()
            else:
                return SettlementResult(transaction=existing_txn, idempotent_replay=True)

    try:
        txn = Transaction(
            user_id=user_id,
            idempotency_key=idempotency_key,
            description=description,
            transaction_type=transaction_type,
            transaction_metadata=json.dumps(metadata) if metadata else None,
            ai_category=ai_category,
            status=TransactionStatus.PENDING,
        )
        db.add(txn)
        db.flush()

        for entry in entries:
            db.add(
                LedgerEntry(
                    transaction_id=txn.id,
                    account_id=entry.account_id,
                    direction=entry.direction,
                    amount=entry.amount,
                )
            )

        if on_before_complete:
            on_before_complete(txn)

        txn.status = TransactionStatus.COMPLETED
        db.commit()
        db.refresh(txn)
        return SettlementResult(transaction=txn, idempotent_replay=False)
    except Exception:
        db.rollback()
        failed_txn = Transaction(
            user_id=user_id,
            idempotency_key=idempotency_key,
            description=description,
            transaction_type=transaction_type,
            transaction_metadata=json.dumps(metadata) if metadata else None,
            ai_category=ai_category,
            status=TransactionStatus.FAILED,
        )
        db.add(failed_txn)
        db.commit()
        raise

