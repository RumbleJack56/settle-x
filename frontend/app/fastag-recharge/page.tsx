"use client";

import { CarFront } from "lucide-react";

export default function FasTagRechargePage() {
  return (
    <div className="w-full bg-paytm-bg min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Header Section */}
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-paytm-border inline-flex">
            <CarFront className="text-paytm-cyan w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">FasTag Recharge</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-paytm-border">
          
          <div className="mb-6 flex p-4 bg-yellow-50 rounded-xl border border-yellow-100">
            <span className="text-sm text-yellow-800 font-medium">
              Save time at toll plazas! Recharge your FASTag instantly.
            </span>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end mt-4">
            
            <div className="relative">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">FASTag Issuing Bank</label>
              <select className="w-full text-lg sm:text-lg font-bold text-gray-900 border-b-2 border-gray-200 focus:border-paytm-cyan outline-none py-2 transition-colors bg-white">
                <option value="">Select Bank / Issuer</option>
                <option value="paytm">Paytm Payments Bank</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="axis">Axis Bank</option>
              </select>
            </div>

            <div className="relative">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Vehicle Registration Number</label>
              <input 
                type="text" 
                placeholder="e.g. MH04AB1234" 
                className="w-full text-lg sm:text-xl font-bold uppercase text-gray-900 border-b-2 border-gray-200 focus:border-paytm-cyan outline-none py-2 transition-colors placeholder:font-normal placeholder:text-gray-400 placeholder:normal-case"
              />
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button className="bg-[#00baec] hover:bg-[#00a8d6] transition-colors text-white font-bold py-3.5 px-8 rounded-xl shadow-md text-lg active:scale-95 w-full md:w-auto">
              Proceed to Recharge
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
