"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Brain, CalendarClock, Loader2, ShieldCheck, TrendingUp } from "lucide-react";
import { parseApiError } from "@/lib/api";

type IntentPayload = {
  window_days: number;
  outflow_transactions: number;
  outflow_volume_inr: number;
  top_intents: Array<{ intent: string; count: number; volume_inr: number }>;
  sticky_behavior: Array<{ entity: string; count: number }>;
  vpa_intelligence: { status: string; note: string };
};

type ForecastPayload = {
  history_days: number;
  horizon_days: number;
  forecast_generated_at: string;
  daily_forecast: Array<{ date: string; expected_net_inr: number; lower_bound_inr: number; upper_bound_inr: number }>;
  summary: { expected_net_inr: number; lower_bound_inr: number; upper_bound_inr: number; method: string };
};

type MandatePayload = {
  input: { amount_inr: number; cycle_days: number; risk_preference: string; retries: number };
  recommended_bond: {
    id: string;
    name: string;
    apy: number;
    maturity_seconds: number;
    safety_score: number;
    liquidity_score: number;
    selection_score: number;
    maturity_fit: number;
  };
  mandate_plan: {
    collection_cycle_days: number;
    recommended_collection_window: string;
    recommended_retry_windows: Array<{ retry_number: number; after_days: number; recommended_time_utc: string }>;
  };
  profitability_projection: { expected_cycle_yield_inr: number; expected_annualized_yield_percent: number };
  notes: string[];
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [intentData, setIntentData] = useState<IntentPayload | null>(null);
  const [forecastData, setForecastData] = useState<ForecastPayload | null>(null);
  const [mandateData, setMandateData] = useState<MandatePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMandate, setLoadingMandate] = useState(false);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("1000");
  const [cycleDays, setCycleDays] = useState("30");
  const [riskPreference, setRiskPreference] = useState("balanced");
  const [retries, setRetries] = useState("2");

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1";
  const token = session?.user?.api_token;

  const loadIntelligence = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setMessage("");
    try {
      const [intentRes, forecastRes] = await Promise.all([
        fetch(`${apiBase}/intelligence/spending-intent?days=60`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${apiBase}/intelligence/cashflow-forecast?horizon_days=7&history_days=30`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const intentJson = await intentRes.json();
      const forecastJson = await forecastRes.json();

      if (!intentRes.ok) {
        setMessage(parseApiError(intentJson, "Failed to load spending intent."));
        return;
      }
      if (!forecastRes.ok) {
        setMessage(parseApiError(forecastJson, "Failed to load cashflow forecast."));
        return;
      }

      setIntentData(intentJson);
      setForecastData(forecastJson);
    } catch {
      setMessage("Failed to load intelligence data.");
    } finally {
      setLoading(false);
    }
  }, [apiBase, token]);

  useEffect(() => {
    if (status !== "authenticated" || !token) return;
    loadIntelligence();
  }, [status, token, loadIntelligence]);

  const runMandateAdvisor = async () => {
    if (!token) return;
    setLoadingMandate(true);
    setMessage("");
    try {
      const res = await fetch(`${apiBase}/intelligence/mandate-advisor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount_paise: Math.floor(parseFloat(amount || "0") * 100),
          cycle_days: parseInt(cycleDays || "30", 10),
          risk_preference: riskPreference,
          retries: parseInt(retries || "2", 10),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(parseApiError(data, "Failed to run mandate advisor."));
        return;
      }
      setMandateData(data);
    } catch {
      setMessage("Failed to run mandate advisor.");
    } finally {
      setLoadingMandate(false);
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
    return <div className="py-40 text-center font-bold">Please sign in to access intelligence dashboard.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Brain className="text-[#00baf2]" size={24} />
          Consumer Intelligence Dashboard
        </h1>
        <button onClick={loadIntelligence} className="bg-[#002970] text-white px-4 py-2 rounded-xl text-sm font-semibold">
          Refresh Signals
        </button>
      </div>

      {message && (
        <div className="bg-blue-50 text-blue-700 border border-blue-100 rounded-xl px-4 py-3 text-sm font-medium">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-[#00baf2]" />
              Spending Intent Analysis
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <MiniStat label="Outflow Txns" value={intentData?.outflow_transactions ?? 0} />
              <MiniStat
                label="Outflow Volume"
                value={`₹${(intentData?.outflow_volume_inr ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
              />
              <MiniStat label="Window" value={`${intentData?.window_days ?? 0} days`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CardList
                title="Top Intents"
                items={(intentData?.top_intents || []).map((item) => ({
                  key: item.intent,
                  primary: item.intent,
                  secondary: `${item.count} txns • ₹${item.volume_inr.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
                }))}
                emptyText="No intent signals available."
              />
              <CardList
                title="Sticky Behavior"
                items={(intentData?.sticky_behavior || []).map((item) => ({
                  key: item.entity,
                  primary: item.entity,
                  secondary: `${item.count} repeated interactions`,
                }))}
                emptyText="No sticky behavior found yet."
              />
            </div>
            <p className="text-xs text-gray-500 mt-4">
              VPA Intelligence: {intentData?.vpa_intelligence?.status} - {intentData?.vpa_intelligence?.note}
            </p>
          </section>

          <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CalendarClock size={18} className="text-[#00baf2]" />
              Cashflow Forecast (7 Days)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <MiniStat
                label="Expected Net"
                value={`₹${(forecastData?.summary.expected_net_inr ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
              />
              <MiniStat
                label="Lower Bound"
                value={`₹${(forecastData?.summary.lower_bound_inr ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
              />
              <MiniStat
                label="Upper Bound"
                value={`₹${(forecastData?.summary.upper_bound_inr ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
              />
            </div>
            <div className="space-y-2">
              {(forecastData?.daily_forecast || []).map((d) => (
                <div key={d.date} className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm flex justify-between">
                  <span className="font-medium text-gray-700">{d.date}</span>
                  <span className="font-semibold text-gray-900">
                    ₹{d.expected_net_inr.toLocaleString("en-IN", { minimumFractionDigits: 2 })} (
                    ₹{d.lower_bound_inr.toLocaleString("en-IN", { minimumFractionDigits: 2 })} to ₹
                    {d.upper_bound_inr.toLocaleString("en-IN", { minimumFractionDigits: 2 })})
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-gradient-to-br from-[#002970] to-[#001740] rounded-3xl p-6 text-white shadow-sm">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#00baf2]" />
              Mandate Advisor
            </h2>
            <div className="space-y-3">
              <Input label="Amount (INR)" value={amount} onChange={setAmount} type="number" />
              <Input label="Cycle Days" value={cycleDays} onChange={setCycleDays} type="number" />
              <Input label="Retries" value={retries} onChange={setRetries} type="number" />
              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-white/70 mb-1 block">Risk Preference</label>
                <select
                  value={riskPreference}
                  onChange={(e) => setRiskPreference(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm font-semibold text-gray-900"
                >
                  <option value="conservative">Conservative</option>
                  <option value="balanced">Balanced</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
              <button
                onClick={runMandateAdvisor}
                disabled={loadingMandate}
                className="w-full bg-[#00baf2] hover:bg-[#00a3d4] text-white py-2.5 rounded-xl font-bold text-sm disabled:opacity-60"
              >
                {loadingMandate ? "Analyzing..." : "Run Mandate Advisor"}
              </button>
            </div>
          </section>

          <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">Advisor Output</h3>
            {!mandateData ? (
              <p className="text-sm text-gray-500">Run the advisor to generate mandate-cycle and bond-cycle alignment.</p>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="font-semibold text-gray-900">{mandateData.recommended_bond.name}</p>
                  <p className="text-gray-600">
                    APY {mandateData.recommended_bond.apy}% • Safety {mandateData.recommended_bond.safety_score} • Liquidity {mandateData.recommended_bond.liquidity_score}
                  </p>
                </div>
                <p className="text-gray-700">
                  Expected cycle yield:{" "}
                  <span className="font-semibold">
                    ₹{mandateData.profitability_projection.expected_cycle_yield_inr.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </p>
                <p className="text-gray-700">
                  Collection window: <span className="font-semibold">{mandateData.mandate_plan.recommended_collection_window}</span>
                </p>
                <div className="space-y-1">
                  {mandateData.mandate_plan.recommended_retry_windows.map((rw) => (
                    <p key={rw.retry_number} className="text-xs text-gray-600">
                      Retry {rw.retry_number}: {rw.recommended_time_utc}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
      <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">{label}</p>
      <p className="text-lg font-black text-gray-900">{value}</p>
    </div>
  );
}

function CardList({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: Array<{ key: string; primary: string; secondary: string }>;
  emptyText: string;
}) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
      <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">{title}</p>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyText}</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.key} className="bg-white border border-gray-100 rounded-lg px-3 py-2">
              <p className="font-semibold text-sm text-gray-900">{item.primary}</p>
              <p className="text-xs text-gray-500">{item.secondary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: "text" | "number";
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider font-semibold text-white/70 mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg px-3 py-2 text-sm font-semibold text-gray-900"
      />
    </div>
  );
}
