import { Store, UserPlus, Search, Phone, Mail, MoreVertical } from "lucide-react";

export default function MerchantsPage() {
  return (
    <div className="w-full bg-paytm-bg min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Merchants & Vendors</h1>
          <button className="bg-paytm-navy hover:bg-blue-900 text-white font-semibold py-2 px-5 rounded-full shadow-sm flex items-center transition-colors">
            <UserPlus size={18} className="mr-2" /> Add New Merchant
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-paytm-border flex items-center mb-8">
          <div className="pl-4 pr-2 text-gray-400">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search by name, GSTIN, or phone..." 
            className="w-full py-2 outline-none font-medium text-gray-800"
          />
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MerchantCard 
            name="Alpha Tech Solutions" 
            category="IT Services" 
            gstin="27AADCD236L2Z7" 
            phone="+91 98765 43210" 
            email="billing@alphatech.in" 
            status="Verified" 
          />
          <MerchantCard 
            name="Office World Stationery" 
            category="Supplies" 
            gstin="22AAAAA0000A1Z5" 
            phone="+91 87654 32109" 
            email="contact@officeworld.com" 
            status="Pending KYC" 
          />
          <MerchantCard 
            name="Cloud Server Hosting AWS" 
            category="Cloud Infrastructure" 
            gstin="07BBAAA0000B1Z6" 
            phone="1800 123 4567" 
            email="invoice@aws-india.in" 
            status="Verified" 
          />
          <MerchantCard 
            name="Quick Freight Logistics" 
            category="Shipping" 
            gstin="29CCCAA0000C1Z7" 
            phone="+91 76543 21098" 
            email="accounts@quickfreight.com" 
            status="Verified" 
          />
          <MerchantCard 
            name="Local Maintenance Co." 
            category="Repairs" 
            gstin="Not Provided" 
            phone="+91 65432 10987" 
            email="support@localmaint.in" 
            status="Unverified" 
          />
        </div>

      </div>
    </div>
  );
}

// Subcomponents
function MerchantCard({ name, category, gstin, phone, email, status }: { name: string, category: string, gstin: string, phone: string, email: string, status: string }) {
  const isVerified = status === 'Verified';
  
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-paytm-border hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-paytm-bg p-3 rounded-full text-paytm-cyan">
            <Store size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-paytm-cyan transition-colors">{name}</h3>
            <p className="text-xs font-semibold text-gray-400 mt-0.5">{category}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-900 cursor-pointer">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="space-y-2 mt-6">
        <DetailRow label="GSTIN" value={gstin} />
        <DetailRow label="Phone" value={phone} icon={<Phone size={12} className="inline mr-1" />} />
        <DetailRow label="Email" value={email} icon={<Mail size={12} className="inline mr-1" />} />
      </div>

      <div className="mt-6 flex justify-between items-center border-t border-gray-100 pt-4">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
          {status}
        </span>
        <button className="text-xs font-bold text-paytm-navy border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors">
          View Ledger
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900 font-semibold text-right truncate pl-4">
        {icon}{value}
      </span>
    </div>
  );
}
