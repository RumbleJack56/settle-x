import Link from "next/link";
import { ChevronDown, Download, UserRound } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-paytm-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-1 text-2xl font-bold">
              <span className="text-paytm-navy tracking-tight">paytm</span>
              <span className="text-paytm-cyan text-sm align-top mt-1">UPI</span>
            </Link>
          </div>

          {/* Navigation Links - Hidden on Mobile */}
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            <NavItem text="Recharge & Bills" />
            <NavItem text="Ticket Booking" />
            <NavItem text="Payments & Services" />
            <NavItem text="Paytm for Business" />
            <NavItem text="Company" />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:flex items-center text-sm font-medium hover:bg-gray-50 px-3 py-2 rounded-full transition-colors border border-transparent hover:border-gray-200">
              <Download size={16} className="mr-2" />
              Download App
            </button>
            <button className="bg-paytm-navy hover:bg-blue-900 text-white px-5 py-2.5 rounded-full flex items-center transition-colors shadow-sm">
              <span className="font-semibold text-sm mr-2">Sign In</span>
              <div className="bg-white/20 p-1 rounded-full">
                <UserRound size={16} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavItem({ text }: { text: string }) {
  return (
    <div className="flex items-center cursor-pointer group py-2">
      <span className="text-[15px] font-medium text-gray-800 group-hover:text-black">{text}</span>
      <ChevronDown size={14} className="ml-1 text-gray-500 group-hover:text-black transition-transform group-hover:rotate-180" />
    </div>
  );
}
