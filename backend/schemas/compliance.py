from pydantic import BaseModel, constr


class GstOverrideRequest(BaseModel):
    transaction_id: str
    reason: constr(min_length=3, max_length=200)  # type: ignore
    gst_applicable: bool | None = None
    gstin: str | None = None
    taxable_value_paise: int | None = None
    tax_rate_percent: float | None = None

