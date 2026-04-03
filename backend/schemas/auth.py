from pydantic import BaseModel, constr

class OtpRequest(BaseModel):
    # Validates basic Indian mobile number formats
    mobile_number: constr(min_length=10, max_length=15) # type: ignore

class OtpVerify(BaseModel):
    mobile_number: constr(min_length=10, max_length=15) # type: ignore
    otp_code: constr(min_length=6, max_length=6) # type: ignore
    name: str | None = None

class Token(BaseModel):
    access_token: str
    token_type: str
    
class UserInfo(BaseModel):
    id: str
    mobile_number: str
    business_name: str | None = None
    gstin: str | None = None

class TokenWithUser(BaseModel):
    access_token: str
    token_type: str
    user: UserInfo
