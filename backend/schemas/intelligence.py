from pydantic import BaseModel


class MandateAdvisorRequest(BaseModel):
    amount_paise: int
    cycle_days: int = 30
    risk_preference: str = "balanced"  # conservative | balanced | aggressive
    retries: int = 2

