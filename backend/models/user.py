from sqlalchemy import Column, Integer, String, DateTime
from database.session import Base
from datetime import datetime
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    mobile_number = Column(String, unique=True, index=True, nullable=False)
    business_name = Column(String, nullable=True)
    gstin = Column(String, nullable=True)

class OtpSession(Base):
    __tablename__ = "otp_sessions"

    id = Column(Integer, primary_key=True, index=True)
    mobile_number = Column(String, index=True, nullable=False)
    otp_code = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
