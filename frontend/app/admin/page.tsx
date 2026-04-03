"use client";
import { useEffect, useState } from "react";
import { ShieldCheck, Landmark } from "lucide-react";
import Link from "next/link";

export default function AdminPanel() {
    const [accounts, setAccounts] = useState<any[]>([]);
    
    useEffect(() => {
        const fetchAccounts = async () => {
            const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1";
            try {
               const res = await fetch(`${apiBase}/admin/event-accounts`);
               if (res.ok) setAccounts(await res.json());
            } catch (e) {
                console.error(e);
            }
        }
        fetchAccounts();
        
        const i = setInterval(fetchAccounts, 5000);
        return () => clearInterval(i);
    }, []);

    return (
        <div className="max-w-6xl mx-auto py-16 px-4">
            <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-5">
                    <div className="bg-[#002970] text-[#00baf2] p-4 rounded-2xl shadow-xl shadow-[#002970]/10">
                        <Landmark size={36} />
                    </div>
                    <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Core Admin</h1>
                    <p className="text-gray-500 font-medium">Monitoring real-time generalized Event Account balances</p>
                    </div>
                </div>
                <Link href="/payments" className="bg-gray-100 font-bold px-6 py-3 rounded-full hover:bg-gray-200 transition-colors">Test Payments</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
               {accounts.map((acc, i) => (
                   <div key={i} className={`rounded-3xl p-8 shadow-sm border-2 ${acc.type === 'EQUITY' ? 'bg-[#002970] text-white border-transparent' : 'bg-white border-gray-100'} transition-all hover:-translate-y-1 hover:shadow-lg relative overflow-hidden`}>
                       {acc.type === 'EQUITY' && <ShieldCheck className="absolute right-[-10%] top-[-10%] text-white opacity-5 pointer-events-none" size={150}/>}
                       
                       <h3 className={`font-black text-lg mb-2 relative z-10 ${acc.type === 'EQUITY' ? 'text-white' : 'text-gray-900'}`}>{acc.name}</h3>
                       
                       <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider relative z-10 ${acc.type === 'EQUITY' ? 'bg-[#00baf2] text-[#002970]' : 'bg-gray-100 text-gray-600'}`}>
                           {acc.type}
                       </span>
                       
                       <div className="mt-8 flex flex-col items-start relative z-10">
                           <span className={`text-xs font-semibold uppercase tracking-widest ${acc.type === 'EQUITY' ? 'text-[#00baf2]' : 'text-gray-400'}`}>Cumulative Balance</span>
                           <span className={`text-4xl font-black mt-1 ${acc.type === 'EQUITY' ? 'text-white' : 'text-emerald-500'}`}>
                               ₹{acc.balance_inr.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                           </span>
                       </div>
                   </div>
               ))}
               {accounts.length === 0 && <div className="col-span-3 text-center py-20 text-gray-400 font-bold">No Event Accounts detected yet. Execute an Intent first.</div>}
            </div>
        </div>
    )
}
