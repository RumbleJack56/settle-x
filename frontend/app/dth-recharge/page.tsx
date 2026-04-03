"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Tv, Play } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DthRecharge() {
    const { data: session } = useSession();
    const router = useRouter();
    const [dthNumber, setDthNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [provider, setProvider] = useState("Tata Sky");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1";
            const res = await fetch(`${apiBase}/checkout/intent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.user?.api_token}`
                },
                body: JSON.stringify({
                    amount_paise: Math.floor(parseFloat(amount) * 100),
                    description: `DTH Recharge: ${provider} (${dthNumber})`,
                    target_type: "DTH_RECHARGE",
                    transaction_metadata: { provider, dthNumber }
                })
            });
            
            if (res.ok) {
                const data = await res.json();
                router.push(`/checkout/${data.token}`);
            } else {
                alert("Failed to initialize checkout intent.");
                setLoading(false);
            }
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-12 px-4">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                    <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
                        <Tv size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">DTH Recharge</h1>
                        <p className="text-gray-500 font-medium text-sm">Instantly recharge your set-top box directly from Ledger.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Operator</label>
                        <select 
                            value={provider} 
                            onChange={e => setProvider(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-[#00baf2] outline-none font-medium"
                        >
                            <option>Tata Sky</option>
                            <option>Airtel Digital TV</option>
                            <option>Dish TV</option>
                            <option>Sun Direct</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subscriber ID</label>
                        <input 
                            type="text" 
                            value={dthNumber} 
                            onChange={e => setDthNumber(e.target.value)}
                            placeholder="10-digit Customer ID"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-[#00baf2] outline-none font-medium"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 font-bold text-gray-500">₹</span>
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={e => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full border border-gray-300 rounded-xl pl-9 pr-4 py-3.5 focus:ring-2 focus:ring-[#00baf2] outline-none font-bold text-lg"
                                required
                            />
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading || !amount}
                        className="w-full bg-[#002970] text-white font-bold py-4 rounded-xl hover:bg-blue-900 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-900/10 active:scale-[0.99] disabled:opacity-50"
                    >
                        {loading ? "Initializing Secure Checkout..." : "Proceed to Checkout"} <Play size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}
