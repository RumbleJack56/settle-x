import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Enum, Boolean
from database.session import Base

class AccountType(str, enum.Enum):
    ASSET = "ASSET"
    LIABILITY = "LIABILITY"
    EQUITY = "EQUITY"
    REVENUE = "REVENUE"
    EXPENSE = "EXPENSE"

class LedgerAccount(Base):
    __tablename__ = "ledger_accounts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    name = Column(String, nullable=False)
    account_type = Column(Enum(AccountType), nullable=False)
    currency = Column(String, default="INR", nullable=False)
    is_system = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class TransactionStatus(str, enum.Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    REVERSED = "REVERSED"

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    idempotency_key = Column(String, unique=True, index=True, nullable=True)
    reference_number = Column(String, index=True, nullable=True) # e.g. External UTR
    description = Column(String, nullable=False)
    ai_category = Column(String, nullable=True)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING)
    posted_date = Column(DateTime, default=datetime.utcnow)


class EntryDirection(str, enum.Enum):
    DEBIT = "DEBIT"
    CREDIT = "CREDIT"

class LedgerEntry(Base):
    __tablename__ = "ledger_entries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    transaction_id = Column(String(36), ForeignKey("transactions.id", ondelete="CASCADE"), index=True, nullable=False)
    account_id = Column(String(36), ForeignKey("ledger_accounts.id"), index=True, nullable=False)
    direction = Column(Enum(EntryDirection), nullable=False)
    amount = Column(Integer, nullable=False) # Always major mathematical integers denoting pure Paise/Cents

class IntentStatus(str, enum.Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class PaymentIntent(Base):
    __tablename__ = "payment_intents"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    token = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    amount_paise = Column(Integer, nullable=False)
    description = Column(String, nullable=False)
    target_type = Column(String, nullable=False) # e.g. DTH, MOBILE_RECHARGE, FASTAG
    transaction_metadata = Column(String, nullable=True) # JSON strings
    status = Column(Enum(IntentStatus), default=IntentStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
