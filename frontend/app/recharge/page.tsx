"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Smartphone, Play } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MobileRechargePage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [type, setType] = useState<"prepaid" | "postpaid">("prepaid");
  const [mobileNumber, setMobileNumber] = useState("");
  const [operator, setOperator] = useState("");
  const [amount, setAmount] = useState("");
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
                  description: `${type.charAt(0).toUpperCase() + type.slice(1)} Mobile Recharge: ${operator} (${mobileNumber})`,
                  target_type: "MOBILE_RECHARGE",
                  transaction_metadata: { operator, mobileNumber, type }
              })
          });
          
          if (res.ok) {
              const data = await res.json();
              router.push(`/checkout/${data.token}`);
          } else {
              alert("Failed to initialize secure checkout intent.");
          }
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="w-full bg-paytm-bg min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Header Section */}
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-paytm-border inline-flex">
            <Smartphone className="text-paytm-cyan w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mobile Recharge</h1>
        </div>

        {/* Main Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-paytm-border">
          
          {/* Radio Options */}
          <div className="flex gap-8 mb-8 pb-4 border-b border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-900">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${type === 'prepaid' ? 'border-paytm-cyan' : 'border-gray-300'}`}>
                {type === "prepaid" && <div className="w-2.5 h-2.5 bg-paytm-cyan rounded-full animate-in zoom-in"></div>}
              </div>
              <input type="radio" className="hidden" checked={type === "prepaid"} onChange={() => setType("prepaid")} />
              Prepaid
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-600">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${type === 'postpaid' ? 'border-paytm-cyan' : 'border-gray-300'}`}>
                {type === "postpaid" && <div className="w-2.5 h-2.5 bg-paytm-cyan rounded-full animate-in zoom-in"></div>}
              </div>
              <input type="radio" className="hidden" checked={type === "postpaid"} onChange={() => setType("postpaid")} />
              Postpaid
            </label>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-8">
            <div className="relative">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Mobile Number</label>
              <input 
                type="tel" 
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter Mobile Number" 
                className="w-full text-lg sm:text-xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-paytm-cyan outline-none py-2 transition-colors placeholder:font-normal placeholder:text-gray-400"
                maxLength={10}
                required
              />
            </div>

            <div className="relative">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Operator / Circle</label>
              <select 
                 value={operator}
                 onChange={(e) => setOperator(e.target.value)}
                 className="w-full text-lg sm:text-xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-paytm-cyan outline-none py-2 transition-colors bg-white"
                 required
               >
                <option value="">Select Operator</option>
                <option value="Airtel">Airtel</option>
                <option value="Jio">Jio</option>
                <option value="Vi">Vi (Vodafone Idea)</option>
                <option value="BSNL">BSNL</option>
              </select>
            </div>

            <div className="relative">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Amount</label>
              <div className="flex items-center border-b-2 border-gray-200 focus-within:border-paytm-cyan transition-colors">
                <span className="text-xl font-bold text-gray-400 mr-2">₹</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00" 
                  step="0.01"
                  min="1"
                  className="w-full text-lg sm:text-xl font-bold text-gray-900 outline-none py-2 placeholder:font-normal placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button 
                type="submit" 
                disabled={loading || !mobileNumber || !operator || !amount}
                className="bg-[#00baec] hover:bg-[#00a8d6] transition-colors text-white font-bold py-3.5 px-8 rounded-xl shadow-md text-lg active:scale-95 w-full md:w-auto flex items-center justify-center gap-2 disabled:opacity-50"
             >
              {loading ? "Securing API..." : "Proceed to Checkout"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
