import enum
import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Enum, Float, ForeignKey, Integer, String

from database.session import Base


class GstClassificationStatus(str, enum.Enum):
    VALID = "VALID"
    MISSING_GSTIN = "MISSING_GSTIN"
    INVALID_GSTIN = "INVALID_GSTIN"
    NOT_APPLICABLE = "NOT_APPLICABLE"
    OVERRIDDEN = "OVERRIDDEN"


class TransactionGstProfile(Base):
    __tablename__ = "transaction_gst_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    transaction_id = Column(String(36), ForeignKey("transactions.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    period_month = Column(String(7), index=True, nullable=False)  # YYYY-MM
    transaction_type = Column(String, index=True, nullable=False)
    amount_paise = Column(Integer, nullable=False, default=0)
    gst_applicable = Column(Boolean, nullable=False, default=False)
    gstin = Column(String, nullable=True)
    taxable_value_paise = Column(Integer, nullable=False, default=0)
    cgst_paise = Column(Integer, nullable=False, default=0)
    sgst_paise = Column(Integer, nullable=False, default=0)
    igst_paise = Column(Integer, nullable=False, default=0)
    confidence = Column(Float, nullable=False, default=0.5)
    status = Column(Enum(GstClassificationStatus), nullable=False, default=GstClassificationStatus.NOT_APPLICABLE)
    source = Column(String, nullable=False, default="AUTO")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class GstClassificationOverride(Base):
    __tablename__ = "gst_classification_overrides"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id = Column(String(36), ForeignKey("transaction_gst_profiles.id", ondelete="CASCADE"), index=True, nullable=False)
    transaction_id = Column(String(36), ForeignKey("transactions.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    reason = Column(String, nullable=False)
    before_snapshot = Column(String, nullable=False)
    after_snapshot = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

