import { UploadCloud, FileText, CheckCircle, AlertTriangle, Info, ShieldCheck } from "lucide-react";

export default function CompliancePage() {
  return (
    <div className="w-full bg-paytm-bg min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Compliance & Automated OCR</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-paytm-border border-dashed">
              <div className="flex flex-col items-center justify-center py-10">
                <div className="bg-paytm-bg p-4 rounded-full text-paytm-cyan mb-4">
                  <UploadCloud size={48} strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Invoice or Tax Document</h2>
                <p className="text-gray-500 mb-6 text-center max-w-md">
                  Our GLM-powered OCR engine will automatically extract details, check GSTIN validity, and create a ledger entry.
                </p>
                <button className="bg-paytm-navy hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors">
                  Browse Files
                </button>
                <div className="text-xs text-gray-400 mt-4">Supported formats: PDF, JPG, PNG (Max 5MB)</div>
              </div>
            </div>

            {/* Audit Log */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-paytm-border">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-paytm-cyan" /> OCR Audit Log
              </h3>
              
              <div className="space-y-4">
                <AuditItem 
                  status="success" 
                  title="Invoice INV-2023-001 Extracted" 
                  desc="Auto-ledger entry created for ₹15,000. Verified GSTIN." 
                  time="10 mins ago" 
                />
                <AuditItem 
                  status="warning" 
                  title="Non-compliant HSN Code Found" 
                  desc="Invoice #4992 contains a missing or invalid HSN sequence. Manual review suggested." 
                  time="2 hours ago" 
                />
                <AuditItem 
                  status="info" 
                  title="Monthly GST Summary Generated" 
                  desc="AI generated the preliminary GSTR-1 data." 
                  time="Yesterday" 
                />
              </div>
            </div>
          </div>

          {/* Compliance Score Panel */}
          <div className="space-y-6">
            <div className="bg-[#002970] rounded-3xl p-6 shadow-sm border border-paytm-navy text-white">
              <h3 className="text-sm font-medium opacity-80 mb-6 text-center uppercase tracking-wider">Overall Compliance Score</h3>
              
              <div className="flex justify-center mb-6 relative">
                 {/* Fake circular chart */}
                 <div className="w-32 h-32 rounded-full border-[10px] border-white/20 flex items-center justify-center relative">
                   <div className="absolute inset-0 border-[10px] border-paytm-cyan rounded-full border-t-transparent border-l-transparent rotate-45"></div>
                   <div className="flex flex-col items-center">
                     <span className="text-4xl font-bold">84</span>
                     <span className="text-[10px] text-gray-300">Out of 100</span>
                   </div>
                 </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                 <div className="flex items-center justify-between font-medium text-sm border-b border-white/10 pb-2 mb-2">
                   <span>GSTIN Coverage</span>
                   <span className="text-paytm-cyan">92%</span>
                 </div>
                 <div className="flex items-center justify-between font-medium text-sm border-b border-white/10 pb-2 mb-2">
                   <span>Invoice Match</span>
                   <span className="text-yellow-400">78%</span>
                 </div>
                 <div className="flex items-center justify-between font-medium text-sm">
                   <span>Fraud Risk</span>
                   <span className="text-green-400">LOW</span>
                 </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-paytm-cyan to-[#00a8d6] rounded-3xl p-6 shadow-sm text-white flex flex-col items-center text-center">
               <ShieldCheck size={40} className="mb-3 opacity-90" />
               <h3 className="font-bold mb-2">Quarterly Filing Ready</h3>
               <p className="text-sm opacity-90 mb-4">Your extracted data shows no major discrepancies. You are ready to file.</p>
               <button className="bg-paytm-navy hover:bg-gray-900 w-full font-bold py-2 rounded-xl transition-colors text-sm">
                 Download Report
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Subcomponents
function AuditItem({ status, title, desc, time }: { status: 'success' | 'warning' | 'info', title: string, desc: string, time: string }) {
  return (
    <div className="flex gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
      <div className="mt-1 flex-shrink-0">
        {status === 'success' && <CheckCircle className="text-green-500" size={20} />}
        {status === 'warning' && <AlertTriangle className="text-yellow-500" size={20} />}
        {status === 'info' && <Info className="text-blue-500" size={20} />}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
        <p className="text-xs text-gray-500 mt-1 mb-2">{desc}</p>
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{time}</span>
      </div>
    </div>
  );
}
