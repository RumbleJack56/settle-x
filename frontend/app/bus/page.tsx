"use client";

import { Bus, ArrowRight } from "lucide-react";

export default function BusPage() {
  return (
    <div className="w-full bg-paytm-bg min-h-screen pb-20">
      
      {/* Red Header Banner for Bus */}
      <div className="bg-[#D32F2F] pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center gap-4 text-white">
          <Bus size={36} className="text-white" />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Book Bus Tickets</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        
        {/* Search Booking Widget */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 mb-8">
          
           <div className="grid grid-cols-1 md:grid-cols-12 gap-y-6 gap-x-2">
             <div className="md:col-span-4 border border-gray-200 rounded-lg p-3 hover:border-red-500 cursor-text focus-within:border-red-500">
               <div className="text-[11px] text-gray-500 font-bold uppercase">Source</div>
               <input type="text" className="text-xl font-bold text-gray-900 mt-1 outline-none w-full" placeholder="Enter departure city" defaultValue="Bangalore" />
             </div>
             
             <div className="hidden md:flex items-center justify-center col-span-1">
                <ArrowRight className="text-red-500 bg-red-50 rounded-full p-1" size={32} />
             </div>

             <div className="md:col-span-4 border border-gray-200 rounded-lg p-3 hover:border-red-500 cursor-text focus-within:border-red-500">
               <div className="text-[11px] text-gray-500 font-bold uppercase">Destination</div>
               <input type="text" className="text-xl font-bold text-gray-900 mt-1 outline-none w-full" placeholder="Enter destination city" defaultValue="Hyderabad" />
             </div>

             <div className="md:col-span-3 border border-gray-200 rounded-lg p-3 hover:border-red-500 cursor-pointer text-center">
               <div className="text-[11px] text-gray-500 font-bold uppercase">Date of Journey</div>
               <div className="text-xl font-bold text-red-500 mt-1">Today</div>
               <div className="text-xs text-gray-400 mt-1">07 Apr, 2026</div>
             </div>
           </div>

           <div className="mt-8 flex justify-center">
              <button className="bg-[#D32F2F] hover:bg-[#B71C1C] transition-colors text-white font-bold py-4 px-12 rounded-xl shadow-md text-xl active:scale-95 w-full md:w-auto">
                Search Buses
              </button>
           </div>
        </div>

        {/* Promo Offers */}
        <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Trending Bus Offers</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
           <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-paytm-border">
             <div>
               <div className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase w-max mb-2">RIDE200</div>
               <h4 className="font-bold text-gray-900">Get ₹200 Cashback on Bus</h4>
               <p className="text-sm text-gray-500 mt-1">On minimum booking of ₹500.</p>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
