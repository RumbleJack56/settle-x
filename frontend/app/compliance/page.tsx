"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { AlertTriangle, Loader2, ShieldCheck } from "lucide-react";
import { parseApiError } from "@/lib/api";

type GstSummary = {
  period: string;
  total_transactions: number;
  gst_applicable_transactions: number;
  exceptions_count: number;
  taxable_value_inr: number;
  cgst_inr: number;
  sgst_inr: number;
  igst_inr: number;
  total_tax_inr: number;
  category_totals: Array<{ transaction_type: string; amount_inr: number }>;
};

type GstException = {
  transaction_id: string;
  description: string;
  transaction_type: string;
  amount_inr: number;
  status: string;
  gstin: string | null;
  confidence: number;
  updated_at: string;
};

function getCurrentPeriod() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

export default function CompliancePage() {
  const { data: session, status } = useSession();
  const [period, setPeriod] = useState(getCurrentPeriod());
  const [summary, setSummary] = useState<GstSummary | null>(null);
  const [exceptions, setExceptions] = useState<GstException[]>([]);
  const [loading, setLoading] = useState(true);
  const [overrideReason, setOverrideReason] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1";
  const apiToken = session?.user?.api_token;

  const gstCoverage = useMemo(() => {
    if (!summary || summary.total_transactions === 0) return 0;
    return Math.round((summary.gst_applicable_transactions / summary.total_transactions) * 100);
  }, [summary]);

  const loadCompliance = useCallback(async () => {
    if (!apiToken) return;
    setLoading(true);
    setMessage("");
    try {
      const [summaryRes, exceptionsRes] = await Promise.all([
        fetch(`${apiBase}/compliance/gst-summary?period=${period}`, {
          headers: { Authorization: `Bearer ${apiToken}` },
        }),
        fetch(`${apiBase}/compliance/exceptions?period=${period}`, {
          headers: { Authorization: `Bearer ${apiToken}` },
        }),
      ]);

      const summaryPayload = await summaryRes.json();
      const exceptionsPayload = await exceptionsRes.json();

      if (!summaryRes.ok) {
        setMessage(parseApiError(summaryPayload, "Failed to load GST summary."));
        setLoading(false);
        return;
      }
      if (!exceptionsRes.ok) {
        setMessage(parseApiError(exceptionsPayload, "Failed to load GST exceptions."));
        setLoading(false);
        return;
      }

      setSummary(summaryPayload);
      setExceptions(exceptionsPayload.exceptions || []);
    } catch {
      setMessage("Failed to load compliance data.");
    } finally {
      setLoading(false);
    }
  }, [apiBase, apiToken, period]);

  useEffect(() => {
    if (status !== "authenticated" || !apiToken) return;
    loadCompliance();
  }, [status, apiToken, loadCompliance]);

  const resolveException = async (transactionId: string) => {
    if (!apiToken) return;
    const reason = (overrideReason[transactionId] || "").trim();
    if (reason.length < 3) {
      setMessage("Please enter a short override reason (min 3 chars).");
      return;
    }

    try {
      const res = await fetch(`${apiBase}/compliance/override-classification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          transaction_id: transactionId,
          reason,
          gst_applicable: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(parseApiError(data, "Failed to apply override."));
        return;
      }
      setMessage("Override applied successfully.");
      await loadCompliance();
    } catch {
      setMessage("Failed to apply override.");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#00baf2]" size={40} />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <div className="py-40 text-center font-bold">Please sign in to view GST compliance.</div>;
  }

  return (
    <div className="w-full bg-paytm-bg min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">GST Compliance Intelligence</h1>
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 font-semibold text-sm"
          />
        </div>

        {message && (
          <div className="bg-blue-50 text-blue-700 border border-blue-100 px-4 py-3 rounded-xl font-medium text-sm">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-paytm-border">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly GST Summary ({period})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MetricCard label="Total Transactions" value={summary?.total_transactions ?? 0} />
                <MetricCard label="GST Applicable" value={summary?.gst_applicable_transactions ?? 0} />
                <MetricCard label="Taxable Value" value={`₹${(summary?.taxable_value_inr ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} />
                <MetricCard label="Total Tax" value={`₹${(summary?.total_tax_inr ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <MetricCard label="CGST" value={`₹${(summary?.cgst_inr ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} compact />
                <MetricCard label="SGST" value={`₹${(summary?.sgst_inr ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} compact />
                <MetricCard label="IGST" value={`₹${(summary?.igst_inr ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} compact />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-paytm-border">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Exceptions Queue</h3>
              {exceptions.length === 0 ? (
                <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-4 font-semibold">
                  No GST exceptions for this period.
                </div>
              ) : (
                <div className="space-y-4">
                  {exceptions.map((ex) => (
                    <div key={ex.transaction_id} className="border border-yellow-100 rounded-xl p-4 bg-yellow-50/40">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-gray-900">{ex.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {ex.transaction_type} • ₹{ex.amount_inr.toLocaleString("en-IN", { minimumFractionDigits: 2 })} • {ex.status}
                          </p>
                        </div>
                        <div className="text-xs font-semibold px-2 py-1 rounded bg-red-100 text-red-700">
                          {Math.round(ex.confidence * 100)}% confidence
                        </div>
                      </div>
                      <div className="mt-3 flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Override reason"
                          value={overrideReason[ex.transaction_id] || ""}
                          onChange={(e) =>
                            setOverrideReason((prev) => ({ ...prev, [ex.transaction_id]: e.target.value }))
                          }
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                        <button
                          onClick={() => resolveException(ex.transaction_id)}
                          className="bg-[#002970] hover:bg-blue-900 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                        >
                          Mark Non-GST
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#002970] rounded-3xl p-6 shadow-sm border border-paytm-navy text-white">
              <h3 className="text-sm font-medium opacity-80 mb-5 text-center uppercase tracking-wider">Compliance Score</h3>
              <div className="w-32 h-32 mx-auto rounded-full border-[10px] border-white/20 flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold">{Math.max(0, 100 - ((summary?.exceptions_count ?? 0) * 10))}</div>
                  <div className="text-[10px] text-gray-300">Out of 100</div>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-sm">
                <div className="flex justify-between pb-2 mb-2 border-b border-white/10">
                  <span>GST Coverage</span>
                  <span className="text-paytm-cyan font-bold">{gstCoverage}%</span>
                </div>
                <div className="flex justify-between pb-2 mb-2 border-b border-white/10">
                  <span>Exceptions</span>
                  <span className="text-yellow-300 font-bold">{summary?.exceptions_count ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className={(summary?.exceptions_count ?? 0) === 0 ? "text-green-300 font-bold" : "text-red-300 font-bold"}>
                    {(summary?.exceptions_count ?? 0) === 0 ? "READY" : "REVIEW"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-paytm-cyan to-[#00a8d6] rounded-3xl p-6 shadow-sm text-white">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck size={24} />
                <h3 className="font-bold">Filing Health</h3>
              </div>
              <p className="text-sm opacity-95">
                Resolve exceptions and review category totals before generating your filing export.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-paytm-border">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle size={18} className="text-yellow-500" />
                Category Totals
              </h3>
              <div className="space-y-2">
                {(summary?.category_totals || []).map((cat) => (
                  <div key={cat.transaction_type} className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">{cat.transaction_type}</span>
                    <span className="font-semibold text-gray-900">
                      ₹{cat.amount_inr.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, compact = false }: { label: string; value: string | number; compact?: boolean }) {
  return (
    <div className={`rounded-xl border border-gray-100 bg-gray-50 ${compact ? "p-3" : "p-4"}`}>
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{label}</p>
      <p className={`${compact ? "text-lg" : "text-xl"} font-black text-gray-900`}>{value}</p>
    </div>
  );
}
