"use client";

import { Zap } from "lucide-react";

export default function ElectricityBillPage() {
  return (
    <div className="w-full bg-paytm-bg min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Header Section */}
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-paytm-border inline-flex">
            <Zap className="text-paytm-cyan w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pay Electricity Bill</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-paytm-border">

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            
            <div className="relative">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">State</label>
              <select className="w-full text-lg font-bold text-gray-900 border-b-2 border-gray-200 focus:border-paytm-cyan outline-none py-2 transition-colors bg-white">
                <option value="">Select State</option>
                <option value="mh">Maharashtra</option>
                <option value="delhi">New Delhi</option>
                <option value="karnataka">Karnataka</option>
                <option value="up">Uttar Pradesh</option>
              </select>
            </div>

            <div className="relative">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Electricity Board</label>
              <select className="w-full text-lg font-bold text-gray-900 border-b-2 border-gray-200 focus:border-paytm-cyan outline-none py-2 transition-colors bg-white">
                <option value="">Select Board</option>
                <option value="mahavitaran">Mahavitaran-MSEDCL</option>
                <option value="adani">Adani Electricity</option>
                <option value="tata">Tata Power</option>
                <option value="best">BEST</option>
              </select>
            </div>

            <div className="relative md:col-span-2 mt-4">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Consumer Number / K Number</label>
              <input 
                type="text" 
                placeholder="View sample bill to find your number" 
                className="w-full text-lg sm:text-xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-paytm-cyan outline-none py-2 transition-colors placeholder:font-normal placeholder:text-gray-400"
              />
            </div>

          </div>

          <div className="mt-10 flex justify-end">
             <button className="bg-[#00baec] hover:bg-[#00a8d6] transition-colors text-white font-bold py-3.5 px-8 rounded-xl shadow-md text-lg active:scale-95 w-full md:w-auto">
              Proceed
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
