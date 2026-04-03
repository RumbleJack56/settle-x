import { Wallet, TrendingUp, IndianRupee, ArrowUpRight, ArrowDownRight, Gem } from "lucide-react";

export default function TreasuryPage() {
  return (
    <div className="w-full bg-paytm-bg min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Treasury & Bond Wallet</h1>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-paytm-navy rounded-3xl p-6 shadow-sm border border-paytm-border text-white relative overflow-hidden">
            <h3 className="text-sm font-medium opacity-80 mb-1">Available Cash Balance</h3>
            <div className="text-3xl font-bold mb-4 flex items-center">
              <IndianRupee size={28} className="mr-1 mt-0.5" /> 1,25,000
            </div>
            <div className="flex gap-3 relative z-10">
              <button className="bg-paytm-cyan hover:bg-[#00a8d6] transition-colors text-white font-semibold text-sm px-5 py-2 rounded-full border border-transparent">
                Add Money
              </button>
              <button className="bg-white/10 hover:bg-white/20 transition-colors text-white font-semibold text-sm px-5 py-2 rounded-full border border-white/20">
                Withdraw
              </button>
            </div>
            <Wallet className="absolute -bottom-4 -right-2 w-24 h-24 opacity-10" />
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-paytm-border flex flex-col justify-center">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Bond NAV</h3>
                <div className="text-2xl font-bold text-gray-900 flex items-center">
                  <IndianRupee size={22} className="mr-1" /> 4,87,500
                </div>
              </div>
              <div className="bg-[#EBF7FF] p-3 rounded-2xl text-paytm-cyan">
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium text-green-600 bg-green-50 w-max px-2.5 py-1 rounded-lg">
              <ArrowUpRight size={16} className="mr-1" /> +1.2% this month
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-paytm-border flex flex-col justify-center">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Accrued Yield Today</h3>
                <div className="text-2xl font-bold text-gray-900 flex items-center">
                  <IndianRupee size={22} className="mr-1" /> 312.50
                </div>
              </div>
              <div className="bg-[#FFF4E6] p-3 rounded-2xl text-orange-500">
                <Gem size={24} />
              </div>
            </div>
            <p className="mt-4 text-xs font-medium text-gray-500">Total Accrued: ₹4,821.00</p>
          </div>
        </div>

        {/* Holdings Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-paytm-border mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Active Bond Holdings</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-sm font-semibold text-gray-500 w-1/3">Bond Details</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500 text-right">Units</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500 text-right">Current NAV</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500 text-right">Total Value</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500 text-right pr-4">Yield</th>
                </tr>
              </thead>
              <tbody className="text-sm align-middle">
                {/* Mock Row 1 */}
                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4">
                    <div className="font-bold text-gray-900">7.26% GS 2032</div>
                    <div className="text-xs text-gray-500 mt-1">ISIN: IN0020210073 • Govt. Bond</div>
                  </td>
                  <td className="py-4 text-right font-medium text-gray-700">12.5</td>
                  <td className="py-4 text-right font-medium text-gray-700">₹1,045.20</td>
                  <td className="py-4 text-right font-bold text-gray-900">₹13,065.00</td>
                  <td className="py-4 text-right font-medium text-green-600 pr-4">7.26%</td>
                </tr>
                {/* Mock Row 2 */}
                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4">
                    <div className="font-bold text-gray-900">7.10% GOI 2029</div>
                    <div className="text-xs text-gray-500 mt-1">ISIN: IN0020220031 • Govt. Bond</div>
                  </td>
                  <td className="py-4 text-right font-medium text-gray-700">45.0</td>
                  <td className="py-4 text-right font-medium text-gray-700">₹998.40</td>
                  <td className="py-4 text-right font-bold text-gray-900">₹44,928.00</td>
                  <td className="py-4 text-right font-medium text-green-600 pr-4">7.10%</td>
                </tr>
                {/* Mock Row 3 */}
                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4">
                    <div className="font-bold text-gray-900">HDFC Bank Tier II</div>
                    <div className="text-xs text-gray-500 mt-1">ISIN: INE040A08331 • Corporate AAA</div>
                  </td>
                  <td className="py-4 text-right font-medium text-gray-700">100.0</td>
                  <td className="py-4 text-right font-medium text-gray-700">₹1,021.00</td>
                  <td className="py-4 text-right font-bold text-gray-900">₹1,02,100.00</td>
                  <td className="py-4 text-right font-medium text-green-600 pr-4">7.85%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
