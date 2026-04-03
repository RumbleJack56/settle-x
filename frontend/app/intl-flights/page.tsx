"use client";

import { Globe, ArrowRight } from "lucide-react";

export default function IntlFlightsPage() {
  return (
    <div className="w-full bg-paytm-bg min-h-screen pb-20">
      
      {/* Dark Purple Header Banner for Intl Flights */}
      <div className="bg-[#4A148C] pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center gap-4 text-white">
          <Globe size={36} className="text-white" />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">International Flights</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        
        {/* Search Booking Widget */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 mb-8">
          
           <div className="grid grid-cols-1 md:grid-cols-12 gap-y-6 gap-x-2">
             <div className="md:col-span-3 border border-gray-200 rounded-lg p-3 hover:border-[#6A1B9A] cursor-text">
               <div className="text-[11px] text-gray-500 font-bold uppercase">From</div>
               <div className="text-xl font-bold text-gray-900 mt-1">Delhi</div>
               <div className="text-xs text-gray-400 mt-1 truncate">DEL, Indira Gandhi Intl</div>
             </div>
             
             <div className="hidden md:flex items-center justify-center col-span-1">
                <ArrowRight className="text-[#6A1B9A] bg-purple-50 rounded-full p-1" size={32} />
             </div>

             <div className="md:col-span-3 border border-gray-200 rounded-lg p-3 hover:border-[#6A1B9A] cursor-text">
               <div className="text-[11px] text-gray-500 font-bold uppercase">To</div>
               <div className="text-xl font-bold text-gray-900 mt-1">Dubai</div>
               <div className="text-xs text-gray-400 mt-1 truncate">DXB, Dubai Intl Airport</div>
             </div>

             <div className="md:col-span-2 border border-gray-200 rounded-lg p-3 hover:border-[#6A1B9A] cursor-pointer">
               <div className="text-[11px] text-gray-500 font-bold uppercase">Departure</div>
               <div className="text-xl font-bold text-[#6A1B9A] mt-1">14 May</div>
               <div className="text-xs text-gray-400 mt-1">Thursday</div>
             </div>

             <div className="md:col-span-3 border border-gray-200 rounded-lg p-3 hover:border-[#6A1B9A] cursor-pointer">
               <div className="text-[11px] text-gray-500 font-bold uppercase">Passengers & Class</div>
               <div className="text-xl font-bold text-gray-900 mt-1">1, Economy</div>
             </div>
           </div>

           <div className="mt-8 flex justify-center">
              <button className="bg-[#6A1B9A] hover:bg-[#4A148C] transition-colors text-white font-bold py-4 px-12 rounded-xl shadow-md text-xl active:scale-95 w-full md:w-auto">
                Search International Flights
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
