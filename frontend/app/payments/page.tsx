import { Send, History, ArrowDownLeft, ArrowUpRight, Search, FileText } from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="w-full bg-paytm-bg min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Payments Hub</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Quick Send (Left column) */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-paytm-border sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-paytm-navy p-3 rounded-2xl text-white shadow-sm hover:scale-105 transition-transform cursor-pointer">
                  <Send size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Send Money</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Recipient VPA</label>
                  <input 
                    type="text" 
                    placeholder="e.g. vendor@upi" 
                    className="w-full border-b-2 border-gray-200 focus:border-paytm-cyan outline-none py-2 text-lg font-medium transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Amount</label>
                  <div className="flex items-center border-b-2 border-gray-200 focus-within:border-paytm-cyan transition-colors">
                    <span className="text-lg font-medium text-gray-400 mr-1">₹</span>
                    <input 
                      type="number" 
                      placeholder="0" 
                      className="w-full outline-none py-2 text-2xl font-bold text-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Note / Invoice Ref</label>
                  <input 
                    type="text" 
                    placeholder="Optional" 
                    className="w-full border-b-2 border-gray-200 focus:border-paytm-cyan outline-none py-2 text-sm font-medium transition-colors"
                  />
                </div>
                <button className="w-full bg-paytm-navy hover:bg-blue-900 text-white font-bold py-3 mt-4 rounded-xl shadow-md transition-colors text-lg">
                  Pay Now
                </button>
              </div>
            </div>
          </div>

          {/* Ledger (Right column) */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-paytm-border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                  <History className="text-paytm-cyan" size={24} /> Recent Transactions
                </h2>
                <div className="text-paytm-cyan p-2 bg-paytm-bg rounded-full cursor-pointer hover:bg-[#e0f4fc]">
                   <Search size={18} />
                </div>
              </div>

              <div className="space-y-6">
                <LedgerItem 
                  type="debit" 
                  name="Tech Supplies Inc." 
                  vpa="techsupplies@ybl"
                  amount="15,000.00" 
                  date="Today, 10:45 AM"
                  category="vendor_payment"
                />
                <LedgerItem 
                  type="credit" 
                  name="Client A Services" 
                  vpa="clienta@sbi"
                  amount="45,000.00" 
                  date="Yesterday, 02:15 PM"
                  category="receivable"
                />
                <LedgerItem 
                  type="debit" 
                  name="Office Rent" 
                  vpa="landlord@hdfc"
                  amount="25,000.00" 
                  date="01 Apr, 09:00 AM"
                  category="rent"
                />
                <LedgerItem 
                  type="debit" 
                  name="AWS Cloud" 
                  vpa="aws@citi"
                  amount="4,500.00" 
                  date="28 Mar, 08:30 PM"
                  category="utility"
                />
              </div>

              <button className="w-full border border-paytm-border text-paytm-navy hover:bg-paytm-bg font-semibold py-3 mt-6 rounded-xl transition-colors text-sm">
                View All Ledger Entries
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponents
function LedgerItem({ type, name, vpa, amount, date, category }: { type: 'credit' | 'debit', name: string, vpa: string, amount: string, date: string, category: string }) {
  const isCredit = type === 'credit';
  return (
    <div className="flex items-center justify-between group p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full flex-shrink-0 ${isCredit ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
          {isCredit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </div>
        <div>
          <div className="font-bold text-gray-900 group-hover:text-paytm-cyan transition-colors">{name}</div>
          <div className="text-xs text-gray-500 mt-0.5">{date} • {vpa}</div>
        </div>
      </div>
      <div className="text-right">
        <div className={`font-bold text-lg ${isCredit ? 'text-green-600' : 'text-gray-900'}`}>
          {isCredit ? '+' : '-'}₹{amount}
        </div>
        <div className="inline-flex items-center gap-1 bg-gray-100 text-[10px] uppercase tracking-wider font-semibold text-gray-600 px-2 py-0.5 rounded mt-1">
          <FileText size={10} /> {category.replace("_", " ")}
        </div>
      </div>
    </div>
  );
}
