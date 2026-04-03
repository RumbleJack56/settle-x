"use client";

import { Train, Search } from "lucide-react";
import { useState } from "react";

export default function TrainsPage() {
  const [tab, setTab] = useState<"book" | "pnr">("book");

  return (
    <div className="w-full bg-paytm-bg min-h-screen pb-20">
      
      {/* Orange Header Banner for Trains */}
      <div className="bg-[#E65100] pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center gap-4 text-white">
          <Train size={36} className="text-white" />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Train Tickets & PNR</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        
        {/* Search Booking Widget */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 mb-8">
          
           <div className="flex gap-6 mb-8 border-b border-gray-100 pb-4">
             <label className={`flex items-center gap-2 font-bold cursor-pointer transition-colors ${tab === 'book' ? 'text-[#E65100]' : 'text-gray-500'}`} onClick={() => setTab("book")}>
               <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${tab === 'book' ? 'border-[#E65100]' : 'border-gray-300'}`}>
                 {tab === "book" && <div className="w-2.5 h-2.5 bg-[#E65100] rounded-full"></div>}
               </div>
               Book Tickets
             </label>
             <label className={`flex items-center gap-2 font-bold cursor-pointer transition-colors ${tab === 'pnr' ? 'text-[#E65100]' : 'text-gray-500'}`} onClick={() => setTab("pnr")}>
               <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${tab === 'pnr' ? 'border-[#E65100]' : 'border-gray-300'}`}>
                 {tab === "pnr" && <div className="w-2.5 h-2.5 bg-[#E65100] rounded-full"></div>}
               </div>
               Check PNR Status
             </label>
           </div>

           {tab === "book" ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6">
               <div className="border-b-2 border-gray-200 pb-2 focus-within:border-[#E65100]">
                 <div className="text-[11px] text-gray-500 font-bold uppercase mb-1">Source Station</div>
                 <input type="text" className="text-xl font-bold text-gray-900 outline-none w-full" placeholder="From Station" defaultValue="NDLS - New Delhi" />
               </div>
               
               <div className="border-b-2 border-gray-200 pb-2 focus-within:border-[#E65100]">
                 <div className="text-[11px] text-gray-500 font-bold uppercase mb-1">Destination Station</div>
                 <input type="text" className="text-xl font-bold text-gray-900 outline-none w-full" placeholder="To Station" defaultValue="BCT - Mumbai Central" />
               </div>

               <div className="border-b-2 border-gray-200 pb-2 focus-within:border-[#E65100]">
                 <div className="text-[11px] text-gray-500 font-bold uppercase mb-1">Departure Date</div>
                 <input type="date" className="text-xl font-bold text-gray-900 outline-none w-full" />
               </div>
               
               <div className="pt-4 flex items-end">
                  <button className="bg-[#E65100] hover:bg-[#EF6C00] transition-colors text-white font-bold py-4 px-12 rounded-xl shadow-md text-xl active:scale-95 w-full">
                    Search Trains
                  </button>
               </div>
             </div>
           ) : (
             <div className="flex flex-col items-center py-4">
                <div className="w-full max-w-lg mb-6">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Enter the 10-digit PNR</label>
                  <input 
                    type="text" 
                    placeholder="Enter PNR Number" 
                    className="w-full text-2xl font-bold text-center tracking-[0.2em] border-2 border-gray-200 rounded-xl focus:border-[#E65100] outline-none py-4 transition-colors placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-400"
                    maxLength={10}
                  />
                </div>
                <button className="bg-[#E65100] hover:bg-[#EF6C00] transition-colors text-white font-bold py-3.5 px-12 rounded-xl shadow-md text-lg active:scale-95">
                  Check Status
                </button>
             </div>
           )}

        </div>
      </div>
    </div>
  );
}
