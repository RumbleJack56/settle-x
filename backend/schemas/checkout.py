from pydantic import BaseModel
from typing import Optional, Dict, Any

class IntentCreate(BaseModel):
    amount_paise: int
    description: str
    target_type: str
    transaction_metadata: Optional[Dict[str, Any]] = None

class IntentExecute(BaseModel):
    token: str
    pin: str
