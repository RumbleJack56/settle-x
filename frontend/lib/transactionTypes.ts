export type TransactionRecord = {
  id: string;
  description: string;
  transaction_type?: string;
  direction: "DEBIT" | "CREDIT";
  amount_inr: number;
  status: string;
  date: string;
  metadata?: Record<string, unknown>;
};

const TYPE_LABELS: Record<string, string> = {
  P2P_TRANSFER: "P2P Transfer",
  MOBILE_RECHARGE: "Mobile Recharge",
  DTH_RECHARGE: "DTH Recharge",
  FASTAG_RECHARGE: "FASTag Recharge",
  ELECTRICITY_BILL_PAYMENT: "Electricity Bill",
  UTILITY_PAYMENT: "Utility Payment",
  BOND_PURCHASE: "Bond Purchase",
  BOND_TRANSFER: "Bond Transfer",
  BOND_REDEMPTION: "Bond Redemption",
  BOND_MATURITY_SETTLEMENT: "Maturity Settlement",
  GENERIC: "Generic",
};

const METADATA_LABELS: Record<string, string> = {
  operator: "Operator",
  mobileNumber: "Mobile Number",
  type: "Plan Type",
  provider: "Provider",
  dthNumber: "Subscriber ID",
  bank: "Issuing Bank",
  vehicleNumber: "Vehicle Number",
  state: "State",
  board: "Electricity Board",
  consumerNumber: "Consumer Number",
  recipient_mobile: "Recipient Mobile",
  amount_paise: "Amount (Paise)",
  target_type: "Target Type",
};

const METADATA_ORDER: Record<string, string[]> = {
  MOBILE_RECHARGE: ["operator", "mobileNumber", "type"],
  DTH_RECHARGE: ["provider", "dthNumber"],
  FASTAG_RECHARGE: ["bank", "vehicleNumber"],
  ELECTRICITY_BILL_PAYMENT: ["state", "board", "consumerNumber"],
  P2P_TRANSFER: ["recipient_mobile", "amount_paise"],
};

export function formatTransactionType(type?: string): string {
  if (!type) return "Generic";
  return TYPE_LABELS[type] || type.replace(/_/g, " ");
}

export function getMetadataRows(
  targetType: string | undefined,
  metadata: Record<string, unknown> | undefined
): Array<{ key: string; label: string; value: string }> {
  if (!metadata) return [];
  const keys = Object.keys(metadata);
  if (keys.length === 0) return [];

  const orderedKeys = METADATA_ORDER[targetType || ""] || keys;
  const remaining = keys.filter((k) => !orderedKeys.includes(k));
  const finalKeys = [...orderedKeys.filter((k) => keys.includes(k)), ...remaining];

  return finalKeys.map((key) => ({
    key,
    label: METADATA_LABELS[key] || key.replace(/([A-Z])/g, " $1").trim(),
    value: String(metadata[key]),
  }));
}

