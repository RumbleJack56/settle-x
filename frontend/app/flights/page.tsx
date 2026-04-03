"use client";

import { Plane, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function FlightsPage() {
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");

  return (
    <div className="w-full bg-paytm-bg min-h-screen pb-20">
      
      {/* Blue Header Banner */}
      <div className="bg-paytm-navy pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center gap-4 text-white">
          <Plane size={36} className="text-white" fill="currentColor" />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Book Domestic Flights</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        
        {/* Search Booking Widget */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 mb-8">
          
          <div className="flex gap-6 mb-8 border-b border-gray-100 pb-4">
             <label className={`flex items-center gap-2 font-bold cursor-pointer transition-colors ${tripType === 'one-way' ? 'text-paytm-cyan' : 'text-gray-500'}`} onClick={() => setTripType("one-way")}>
               <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${tripType === 'one-way' ? 'border-paytm-cyan' : 'border-gray-300'}`}>
                 {tripType === "one-way" && <div className="w-2.5 h-2.5 bg-paytm-cyan rounded-full"></div>}
               </div>
               One Way
             </label>
             <label className={`flex items-center gap-2 font-bold cursor-pointer transition-colors ${tripType === 'round-trip' ? 'text-paytm-cyan' : 'text-gray-500'}`} onClick={() => setTripType("round-trip")}>
               <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${tripType === 'round-trip' ? 'border-paytm-cyan' : 'border-gray-300'}`}>
                 {tripType === "round-trip" && <div className="w-2.5 h-2.5 bg-paytm-cyan rounded-full"></div>}
               </div>
               Round Trip
             </label>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-12 gap-y-6 gap-x-2">
             <div className="md:col-span-3 border border-gray-200 rounded-lg p-3 hover:border-paytm-cyan cursor-text">
               <div className="text-[11px] text-gray-500 font-bold uppercase">From</div>
               <div className="text-xl font-bold text-gray-900 mt-1">Delhi</div>
               <div className="text-xs text-gray-400 mt-1 truncate">DEL, Indira Gandhi Intl Airport</div>
             </div>
             
             <div className="hidden md:flex items-center justify-center col-span-1">
                <ArrowRight className="text-paytm-cyan bg-blue-50 rounded-full p-1" size={32} />
             </div>

             <div className="md:col-span-3 border border-gray-200 rounded-lg p-3 hover:border-paytm-cyan cursor-text">
               <div className="text-[11px] text-gray-500 font-bold uppercase">To</div>
               <div className="text-xl font-bold text-gray-900 mt-1">Mumbai</div>
               <div className="text-xs text-gray-400 mt-1 truncate">BOM, Chhatrapati Shivaji Intl Airport</div>
             </div>

             <div className={`md:col-span-2 border border-gray-200 rounded-lg p-3 hover:border-paytm-cyan cursor-pointer ${tripType === 'round-trip' ? 'md:col-span-2' : 'md:col-span-3'}`}>
               <div className="text-[11px] text-gray-500 font-bold uppercase">Departure Date</div>
               <div className="text-xl font-bold text-paytm-cyan mt-1">07 Apr</div>
               <div className="text-xs text-gray-400 mt-1">Tuesday, 2026</div>
             </div>

             {tripType === "round-trip" && (
                <div className="md:col-span-2 border border-paytm-cyan bg-blue-50 rounded-lg p-3 cursor-pointer">
                  <div className="text-[11px] text-playtm-cyan font-bold uppercase">Return Date</div>
                  <div className="text-xl font-bold text-gray-900 mt-1 placeholder">Select</div>
                  <div className="text-xs text-gray-400 mt-1">Click to add</div>
                </div>
             )}

             <div className={`border border-gray-200 rounded-lg p-3 hover:border-paytm-cyan cursor-pointer ${tripType === 'round-trip' ? 'md:col-span-1' : 'md:col-span-2'}`}>
               <div className="text-[11px] text-gray-500 font-bold uppercase">Passengers</div>
               <div className="text-xl font-bold text-gray-900 mt-1 truncate text-center">1</div>
             </div>
           </div>

           <div className="mt-8 flex justify-center">
              <button className="bg-[#00baec] hover:bg-[#00a8d6] transition-colors text-white font-bold py-4 px-12 rounded-xl shadow-md text-xl active:scale-95 w-full md:w-auto">
                Search Flights
              </button>
           </div>
        </div>

        {/* Promo Offers */}
        <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Best Offers on Flights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-paytm-border hover:shadow-md cursor-pointer">
             <div>
               <div className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase w-max mb-2">FLYNEW</div>
               <h4 className="font-bold text-gray-900">Flat 12% OFF on First Booking</h4>
               <p className="text-sm text-gray-500 max-w-[200px] truncate">Use code FLYNEW. Valid till month end.</p>
             </div>
             <div className="bg-[#EBF7FF] text-paytm-cyan p-4 rounded-full">
               <Plane fill="currentColor" />
             </div>
           </div>
           <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-paytm-border hover:shadow-md cursor-pointer">
             <div>
               <div className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase w-max mb-2">HDFCCASH</div>
               <h4 className="font-bold text-gray-900">Get ₹1500 Cashback</h4>
               <p className="text-sm text-gray-500 max-w-[200px] truncate">On HDFC Bank Credit Cards.</p>
             </div>
             <div className="bg-paytm-navy text-white p-4 rounded-full">
               <Plane fill="currentColor" />
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
