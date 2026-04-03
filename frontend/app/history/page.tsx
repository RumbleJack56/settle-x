"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { History, ArrowDownLeft, ArrowUpRight, Loader2, Landmark } from "lucide-react";
import Link from "next/link";
import { formatTransactionType, type TransactionRecord } from "@/lib/transactionTypes";

export default function HistoryPage() {
    const { data: session, status } = useSession();
    const [txs, setTxs] = useState<TransactionRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState("ALL");

    const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1";

    useEffect(() => {
        if (status !== "authenticated") return;
        fetch(`${apiBase}/payments/transactions`, {
            headers: { "Authorization": `Bearer ${session?.user?.api_token}` }
        })
        .then(r => r.json())
        .then(data => { setTxs(data.transactions); setLoading(false); })
        .catch(e => { console.error(e); setLoading(false); });
    }, [status, session]);

    if (status === "loading" || loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-[#00baf2]" size={40}/></div>;

    const availableTypes = Array.from(new Set(txs.map(tx => tx.transaction_type || "GENERIC")));
    const visibleTxs = typeFilter === "ALL"
      ? txs
      : txs.filter(tx => (tx.transaction_type || "GENERIC") === typeFilter);

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                   <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                       <div className="bg-[#002970] text-white p-2.5 rounded-xl"><History size={26} /></div> 
                       Ledger History
                   </h1>
                   <p className="text-gray-500 font-medium mt-2">Immutable double-entry log of all your unified settlements</p>
                </div>
                <Link href="/payments" className="bg-[#f0fbff] text-[#00baf2] hover:bg-[#dff5ff] transition-colors font-bold px-6 py-3 rounded-full flex items-center gap-2">
                    <Landmark size={18}/> Wallet
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Filter by Transaction Type</label>
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full sm:w-80 border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-[#00baf2] outline-none"
                >
                    <option value="ALL">All Types</option>
                    {availableTypes.map((type) => (
                        <option key={type} value={type}>
                            {formatTransactionType(type)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {visibleTxs.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 font-bold border-gray-100">No transaction records found inside the ledger.</div>
                ) : (
                    <div>
                        {visibleTxs.map((tx, i) => {
                            // In Double Entry (ASSET wallet), DEBIT = Money Increased/Received. CREDIT = Money Decreased/Sent.
                            const isReceived = tx.direction === "DEBIT";
                            return (
                                <div key={tx.id} className={`flex items-center justify-between p-6 ${i !== visibleTxs.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
                                    <div className="flex items-center gap-5">
                                        <div className={`p-3 rounded-2xl shadow-sm ${isReceived ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                            {isReceived ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg mb-0.5">{tx.description}</p>
                                            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                <span>{new Date(tx.date).toLocaleString()}</span>
                                                <span>•</span>
                                                <span className={`px-2 py-0.5 rounded ${tx.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>{tx.status}</span>
                                                <span>•</span>
                                                <span className="px-2 py-0.5 rounded bg-blue-50 text-[#007aa3]">
                                                    {formatTransactionType(tx.transaction_type || "GENERIC")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-black text-2xl ${isReceived ? 'text-emerald-500' : 'text-gray-900'}`}>
                                            {isReceived ? '+' : '-'}₹{tx.amount_inr.toLocaleString('en-IN', {minimumFractionDigits:2})}
                                        </p>
                                        <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">{tx.direction} LEDGER ENTRY</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
