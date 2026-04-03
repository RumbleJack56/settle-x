from pydantic import BaseModel, constr

class PinSetup(BaseModel):
    pin: constr(min_length=4, max_length=6) # type: ignore

class TransferRequest(BaseModel):
    recipient_mobile: constr(min_length=10, max_length=15) # type: ignore
    amount_paise: int
    pin: str
    idempotency_key: str
