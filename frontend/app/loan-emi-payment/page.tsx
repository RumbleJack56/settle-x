"use client";

import { CalendarCheck, Search } from "lucide-react";

export default function LoanEMIPage() {
  return (
    <div className="w-full bg-paytm-bg min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Header Section */}
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-paytm-border inline-flex">
            <CalendarCheck className="text-paytm-cyan w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pay Loan EMI</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-paytm-border">

          <div className="mb-8 relative">
             <div className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400">
               <Search size={20} />
             </div>
             <input 
               type="text" 
               placeholder="Search Lender (e.g., Bajaj Finserv, Muthoot, HDFC)" 
               className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-paytm-cyan outline-none text-gray-900 font-medium bg-gray-50 focus:bg-white transition-colors"
             />
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            
            <div className="relative">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Lender Name</label>
              <select className="w-full text-lg font-bold text-gray-900 border-b-2 border-gray-200 focus:border-paytm-cyan outline-none py-2 transition-colors bg-white">
                <option value="">Select Lender Name</option>
                <option value="bajaj">Bajaj Finance</option>
                <option value="muthoot">Muthoot Finance</option>
                <option value="hdfc">HDFC Bank Loans</option>
                <option value="axis">Axis Bank Loans</option>
              </select>
            </div>

            <div className="relative">
               <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Loan Account Number</label>
               <input 
                 type="text" 
                 placeholder="Enter Loan A/c Number" 
                 className="w-full text-lg sm:text-xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-paytm-cyan outline-none py-2 transition-colors placeholder:font-normal placeholder:text-gray-400"
               />
            </div>

          </div>

          <div className="mt-10 flex justify-end">
             <button className="bg-[#00baec] hover:bg-[#00a8d6] transition-colors text-white font-bold py-3.5 px-8 rounded-xl shadow-md text-lg active:scale-95 w-full md:w-auto">
              Get Payable Amount
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
