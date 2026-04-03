import {
  Smartphone, Tv, CarFront, Zap, CalendarCheck, Plane, Bus, Train, Globe,
  ShieldAlert, Landmark, PiggyBank, Receipt, ShoppingBag, Clapperboard, HeartHandshake
} from "lucide-react";
import Link from "next/link";

export default function AllProductsPage() {
  return (
    <div className="w-full bg-paytm-bg min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Paytm Products & Services</h1>
          <p className="text-gray-500 font-medium">Explore everything you can do with Paytm.</p>
        </div>

        {/* Section 1: Recharges & Utilities */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-paytm-border mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">Recharge & Bill Payments</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-y-10 gap-x-4">
            <ProductIcon icon={<Smartphone />} label="Mobile Recharge" href="/recharge" />
            <ProductIcon icon={<Tv />} label="DTH Recharge" href="/dth-recharge" />
            <ProductIcon icon={<CarFront />} label="FasTag Recharge" href="/fastag-recharge" />
            <ProductIcon icon={<Zap />} label="Electricity Bill" href="/electricity-bill-payment" />
            <ProductIcon icon={<CalendarCheck />} label="Loan EMI Payment" href="/loan-emi-payment" />
            <ProductIcon icon={<Receipt />} label="Credit Card Bill" href="#" />
            <ProductIcon icon={<Landmark />} label="Municipal Tax" href="#" />
            <ProductIcon icon={<ShoppingBag />} label="Gas Cylinder" href="#" />
          </div>
        </div>

        {/* Section 2: Travel */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-paytm-border mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">Travel & Ticketing</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-y-10 gap-x-4">
            <ProductIcon icon={<Plane />} label="Flights" href="/flights" />
            <ProductIcon icon={<Bus />} label="Bus Tickets" href="/bus" />
            <ProductIcon icon={<Train />} label="Trains" href="/trains" />
            <ProductIcon icon={<Globe />} label="Intl. Flights" href="/intl-flights" />
            <ProductIcon icon={<Clapperboard />} label="Movie Tickets" href="#" />
          </div>
        </div>

        {/* Section 3: Financial Services */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-paytm-border mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">Financial Services</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-y-10 gap-x-4">
            <ProductIcon icon={<PiggyBank />} label="Mutual Funds" href="/treasury" />
            <ProductIcon icon={<ShieldAlert />} label="Insurance" href="#" />
            <ProductIcon icon={<HeartHandshake />} label="Donations" href="#" />
          </div>
        </div>

      </div>
    </div>
  );
}

function ProductIcon({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <Link href={href} className="flex flex-col items-center cursor-pointer group transition-transform hover:-translate-y-1">
      <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-paytm-cyan group-hover:bg-[#EBF7FF] transition-colors mb-3">
        {icon}
      </div>
      <span className="text-[13px] font-medium text-gray-700 group-hover:text-paytm-cyan text-center leading-tight">
        {label}
      </span>
    </Link>
  );
}
