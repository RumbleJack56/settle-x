import Link from "next/link";
import {
  Smartphone,
  Tv,
  CarFront,
  Zap,
  CalendarCheck,
  LayoutGrid,
  Plane,
  Bus,
  Train,
  Globe,
  ArrowRight,
  Receipt,
  PiggyBank
} from "lucide-react";

export default function Home() {
  return (
    <div className="w-full bg-paytm-bg min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Top Section - Recharges & Bill Payments AND Right Banner */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Main Services Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-paytm-border lg:w-[65%] flex-shrink-0">
            <h2 className="text-xl flex items-center gap-2 font-bold text-gray-900 mb-8 tracking-tight">
              Recharges & Bill Payments
            </h2>
            
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-y-8 gap-x-4">
              <ServiceIcon icon={<Smartphone className="text-paytm-cyan w-8 h-8" strokeWidth={1.5} />} label="Mobile Recharge" />
              <ServiceIcon icon={<Tv className="text-paytm-cyan w-8 h-8" strokeWidth={1.5} />} label="DTH Recharge" />
              <ServiceIcon icon={<CarFront className="text-paytm-cyan w-8 h-8" strokeWidth={1.5} />} label="FasTag Recharge" />
              <ServiceIcon icon={<Zap className="text-paytm-cyan w-8 h-8" strokeWidth={1.5} />} label="Electricity Bill" />
              <ServiceIcon icon={<CalendarCheck className="text-paytm-cyan w-8 h-8" strokeWidth={1.5} />} label="Loan EMI Payment" />
              <ServiceIcon icon={<LayoutGrid className="text-paytm-cyan w-8 h-8" strokeWidth={1.5} />} label="View All Products" />
            </div>
          </div>

          {/* Right UPI Statement Banner (Mocking image with card) */}
          <div className="bg-gradient-to-br from-[#c3edff] to-[#eaf7ff] rounded-3xl p-8 relative overflow-hidden lg:w-[35%] flex-shrink-0 shadow-sm border border-paytm-border flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-paytm-navy mb-2 leading-tight">Get UPI Statement<br/>in Excel/ PDF</h3>
            <p className="text-paytm-navy font-medium mb-6 mt-1 opacity-80">Track all your<br/>expenses.<br/>Only on Paytm.</p>
            <div className="bg-black text-white text-xs font-semibold rounded-full px-4 py-2 w-max cursor-pointer hover:bg-gray-800 transition-colors">
              Download Paytm App ⬇
            </div>
            
            {/* Mock phone in background */}
            <div className="absolute -bottom-10 -right-4 w-40 bg-white rounded-[2rem] border-[6px] border-paytm-navy shadow-xl h-64 p-3 rotate-[-5deg]">
              <div className="w-full h-full border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center pt-4 opacity-50">
                <div className="w-16 h-4 bg-gray-200 rounded-full mb-4"></div>
                <div className="w-full h-12 bg-white rounded-lg mb-2 shadow-sm border border-gray-100"></div>
                <div className="w-full h-12 bg-white rounded-lg shadow-sm border border-gray-100"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Small Promo Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-paytm-border cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-[#EBF7FF] p-3 rounded-xl text-paytm-navy">
                <TagIcon />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 leading-tight">Do Mobile Recharge <span className="font-medium text-gray-600">and Win ₹100</span></h4>
                <p className="text-sm text-gray-500">cashback. Promo: TAKEITALL</p>
              </div>
            </div>
            <button className="text-paytm-navy font-semibold text-sm border border-paytm-navy hover:bg-paytm-navy hover:text-white transition-colors rounded-full px-4 py-1.5 flex items-center whitespace-nowrap">
              Recharge Now <ArrowRight size={14} className="ml-1" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-paytm-border cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-[#EBF7FF] p-3 rounded-xl text-paytm-navy">
                <WifiRouterIcon />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 leading-tight">Broadband Recharge</h4>
                <p className="text-sm text-gray-500">Bill due? Pay now & get rewarded</p>
              </div>
            </div>
            <button className="text-paytm-navy font-semibold text-sm border border-paytm-navy hover:bg-paytm-navy hover:text-white transition-colors rounded-full px-4 py-1.5 flex items-center whitespace-nowrap">
              Pay Now <ArrowRight size={14} className="ml-1" />
            </button>
          </div>
        </div>

        {/* Financial Intel Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Banner 1 */}
           <div className="bg-[#FFF4E6] rounded-2xl p-6 relative overflow-hidden h-36 flex flex-col justify-center">
             <h4 className="text-lg font-bold text-paytm-navy mb-1">Swipe left<br/>to keep it hush</h4>
             <p className="text-[10px] text-gray-600 mb-3 w-1/2 leading-tight flex-1">Hide your past payments with a left swipe</p>
             <div className="bg-paytm-navy w-max text-white text-[10px] font-semibold px-4 py-1.5 rounded-full z-10 transition-transform cursor-pointer hover:scale-105">
                Download App Now →
             </div>
           </div>
           
           {/* Banner 2 */}
           <div className="bg-[#E5F1FF] rounded-2xl p-6 relative overflow-hidden h-36 flex flex-col justify-center border border-[#d6ebff]">
             <h4 className="text-lg font-bold text-paytm-navy mb-1 leading-tight">Expense tracking<br/>made smarter!</h4>
             <p className="text-[10px] text-gray-600 mb-3 w-1/2 leading-tight flex-1">Now, download your statement in Excel/PDF format</p>
             <div className="bg-paytm-navy w-max text-white text-[10px] font-semibold px-4 py-1.5 rounded-full z-10 transition-transform cursor-pointer hover:scale-105">
                Download App Now →
             </div>
           </div>

           {/* Banner 3 */}
           <div className="bg-[#EAF7FF] rounded-2xl p-6 relative overflow-hidden h-36 flex flex-col justify-center border border-[#d2f0ff]">
             <h4 className="text-lg font-bold text-paytm-navy mb-1 leading-tight">We do the math,<br/>you do the spending.</h4>
             <p className="text-[10px] text-gray-600 mb-3 w-3/5 leading-tight flex-1">Check total balance of all your linked bank accounts</p>
             <div className="bg-paytm-navy w-max text-white text-[10px] font-semibold px-4 py-1.5 rounded-full z-10 transition-transform cursor-pointer hover:scale-105">
                Download App Now →
             </div>
           </div>
        </div>

        {/* Travel / Flights Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-paytm-border">
          <div className="flex justify-between items-center mb-6">
            <div className="flex bg-white gap-8 border-b border-gray-100 pb-2">
              <button className="flex flex-col items-center text-paytm-cyan font-bold pb-2 border-b-2 border-paytm-cyan px-2">
                 <div className="bg-[#EBF7FF] p-2.5 rounded-full mb-1">
                   <Plane size={24} className="text-paytm-cyan" fill="currentColor" />
                 </div>
                 Flights
              </button>
              <button className="flex flex-col items-center text-gray-500 font-medium pb-2 px-2 hover:text-paytm-navy transition-colors">
                 <div className="bg-gray-50 p-2.5 rounded-full mb-1">
                   <Bus size={24} className="text-gray-400" />
                 </div>
                 Bus
              </button>
              <button className="flex flex-col items-center text-gray-500 font-medium pb-2 px-2 hover:text-paytm-navy transition-colors">
                 <div className="bg-gray-50 p-2.5 rounded-full mb-1">
                   <Train size={24} className="text-gray-400" />
                 </div>
                 Trains
              </button>
              <button className="flex flex-col items-center text-gray-500 font-medium pb-2 px-2 hover:text-paytm-navy transition-colors items-center justify-center">
                 <div className="bg-gray-50 p-2.5 rounded-full mb-1">
                   <Globe size={24} className="text-gray-400" />
                 </div>
                 Intl. Flights
              </button>
            </div>
            
            {/* Fake travel logo */}
            <div className="hidden sm:flex text-2xl font-bold tracking-tight">
               <span className="text-paytm-navy">paytm</span><span className="text-black">travel</span>
            </div>
          </div>

          <div className="border border-paytm-border rounded-xl p-5 shadow-sm bg-white pt-6">
             {/* Radio buttons */}
             <div className="flex gap-6 mb-6">
               <label className="flex items-center gap-2 font-medium text-gray-800 cursor-pointer">
                 <div className="w-5 h-5 rounded-full border-2 border-paytm-cyan flex items-center justify-center">
                   <div className="w-2.5 h-2.5 bg-paytm-cyan rounded-full"></div>
                 </div>
                 One Way
               </label>
               <label className="flex items-center gap-2 font-medium text-gray-600 cursor-pointer">
                 <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                 Round Trip
               </label>
             </div>

             {/* Booking Form Layout */}
             <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4 items-end">
               
               <div className="md:col-span-4 relative border-r border-gray-200 pr-6 flex">
                 <div className="flex-1">
                   <div className="text-[11px] text-gray-400 uppercase font-semibold mb-1 tracking-wider">From</div>
                   <div className="text-xl font-bold text-gray-900 border-b border-transparent focus-within:border-paytm-cyan w-full cursor-text">
                     Delhi (DEL)
                   </div>
                 </div>
                 
                 {/* Swap Icon */}
                 <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-white rounded-full p-1 border border-gray-200 z-10 shadow-sm cursor-pointer hover:rotate-180 transition-transform">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" stroke="#00B9F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                 </div>
               </div>

               <div className="md:col-span-3 border-r border-gray-200 pr-6 pl-4">
                 <div className="text-[11px] text-gray-400 uppercase font-semibold mb-1 tracking-wider">To</div>
                 <div className="text-xl font-bold text-gray-900 border-b border-transparent focus-within:border-paytm-cyan w-full cursor-text">
                   Mumbai (BOM)
                 </div>
               </div>

               <div className="md:col-span-2 border-r border-gray-200 pr-6 pl-4">
                 <div className="text-[11px] text-gray-400 uppercase font-semibold mb-1 tracking-wider">Depart</div>
                 <div className="text-lg font-bold text-gray-900 cursor-pointer hover:text-paytm-cyan transition-colors">
                   Tue, 07 Apr 26
                 </div>
               </div>

               <div className="md:col-span-3 pl-4 flex items-end">
                 <div className="flex-1">
                   <div className="text-[11px] text-gray-400 uppercase font-semibold mb-1 tracking-wider">Passenger & Class</div>
                   <div className="text-lg font-bold text-gray-900 truncate">
                     1 Traveller, Econo...
                   </div>
                 </div>
                 <button className="bg-[#00baec] hover:bg-[#00a8d6] transition-colors text-white font-bold py-3.5 px-6 rounded-xl ml-4 whitespace-nowrap shadow-md text-lg">
                    Search Flights
                 </button>
               </div>
               
             </div>
             
          </div>
        </div>

      </div>
    </div>
  );
}

// Subcomponents
function ServiceIcon({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center cursor-pointer group">
      <div className="mb-3 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <span className="text-[13px] font-semibold text-gray-800 text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

// Icons
function TagIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path d="M12 2L4 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-8-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
       <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
       <circle cx="12" cy="16" r="1" fill="currentColor"/>
    </svg>
  );
}

function WifiRouterIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="14" width="18" height="6" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 14v-2c0-2.76 2.24-5 5-5s5 2.24 5 5v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 7V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="20" cy="17" r="1.5" fill="currentColor"/>
    </svg>
  );
}
