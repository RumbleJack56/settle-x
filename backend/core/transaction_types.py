from typing import Any

from core.http import api_error


class TransactionTypes:
    GENERIC = "GENERIC"
    P2P = "P2P_TRANSFER"
    BOND_PURCHASE = "BOND_PURCHASE"
    BOND_TRANSFER = "BOND_TRANSFER"
    BOND_REDEMPTION = "BOND_REDEMPTION"
    BOND_MATURITY_SETTLEMENT = "BOND_MATURITY_SETTLEMENT"
    MOBILE_RECHARGE = "MOBILE_RECHARGE"
    DTH_RECHARGE = "DTH_RECHARGE"
    FASTAG_RECHARGE = "FASTAG_RECHARGE"
    ELECTRICITY_BILL = "ELECTRICITY_BILL_PAYMENT"
    UTILITY_PAYMENT = "UTILITY_PAYMENT"


TARGET_TYPE_RULES: dict[str, set[str]] = {
    TransactionTypes.MOBILE_RECHARGE: {"operator", "mobileNumber", "type"},
    TransactionTypes.DTH_RECHARGE: {"provider", "dthNumber"},
    TransactionTypes.FASTAG_RECHARGE: {"bank", "vehicleNumber"},
    TransactionTypes.ELECTRICITY_BILL: {"state", "board", "consumerNumber"},
}


def resolve_intent_transaction_type(target_type: str) -> str:
    normalized = (target_type or "").strip().upper()
    if not normalized:
        api_error(400, "INVALID_TARGET_TYPE", "target_type is required.")
    if normalized in TARGET_TYPE_RULES:
        return normalized
    # Allow unknown types but classify under UTILITY_PAYMENT.
    return TransactionTypes.UTILITY_PAYMENT


def validate_intent_metadata(target_type: str, metadata: dict[str, Any] | None):
    normalized = (target_type or "").strip().upper()
    required = TARGET_TYPE_RULES.get(normalized)
    if not required:
        return
    if not isinstance(metadata, dict):
        api_error(400, "INVALID_METADATA", f"transaction_metadata is required for {normalized}.")
    missing = [field for field in sorted(required) if field not in metadata or metadata[field] in (None, "")]
    if missing:
        api_error(400, "MISSING_METADATA_FIELDS", "Missing required transaction metadata fields.", missing_fields=missing)

