"use client";

import { useState } from "react";
import { Tv } from "lucide-react";

export default function DTHRechargePage() {
  const [operator, setOperator] = useState<string | null>(null);

  const operators = ['Tata Play', 'Airtel Digital TV', 'Sun Direct', 'Dish TV', 'D2H'];

  return (
    <div className="w-full bg-paytm-bg min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Header Section */}
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-paytm-border inline-flex">
            <Tv className="text-paytm-cyan w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">DTH Recharge</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-paytm-border">
          
          {/* Operator Grid */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Select your Operator</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
               {operators.map((op) => (
                 <div 
                   key={op} 
                   onClick={() => setOperator(op)}
                   className={`border rounded-xl p-4 text-center cursor-pointer transition-all duration-200 group ${
                     operator === op 
                       ? 'border-paytm-cyan bg-[#e0f4fc] shadow-sm transform scale-[1.02]' 
                       : 'border-gray-200 hover:border-paytm-cyan hover:bg-[#EBF7FF]'
                   }`}
                 >
                    <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center transition-colors ${operator === op ? 'bg-white shadow-sm' : 'bg-gray-50 group-hover:bg-white'}`}>
                      <Tv className={`${operator === op ? 'text-paytm-cyan' : 'text-gray-400 group-hover:text-paytm-cyan'} w-6 h-6 transition-colors`} />
                    </div>
                    <span className={`text-sm font-bold transition-colors ${operator === op ? 'text-paytm-navy' : 'text-gray-700'}`}>{op}</span>
                 </div>
               ))}
            </div>
          </div>

          {operator && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="border-t border-gray-100 pt-8 mt-2" />

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                
                <div className="relative">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">{operator} Subscriber ID</label>
                  <input 
                    type="text" 
                    placeholder={`Enter ${operator} ID`}
                    className="w-full text-lg sm:text-xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-paytm-cyan outline-none py-2 transition-colors placeholder:font-normal placeholder:text-gray-400"
                  />
                </div>

                <div className="relative">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Amount</label>
                  <div className="flex items-center border-b-2 border-gray-200 focus-within:border-paytm-cyan transition-colors">
                    <span className="text-xl font-bold text-gray-400 mr-2">₹</span>
                    <input 
                      type="number" 
                      placeholder="0" 
                      className="w-full text-lg sm:text-xl font-bold text-gray-900 outline-none py-2 placeholder:font-normal placeholder:text-gray-400"
                    />
                  </div>
                </div>

              </div>

              <div className="mt-8 flex justify-end">
                <button className="bg-[#00baec] hover:bg-[#00a8d6] transition-colors text-white font-bold py-3.5 px-8 rounded-xl shadow-md text-lg active:scale-95 w-full md:w-auto">
                  Proceed to Pay
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
