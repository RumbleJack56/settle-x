"use client";
import { useState } from "react";
import { X, Loader2, ShieldCheck } from "lucide-react";

export default function PinModal({ isOpen, onClose, onConfirm, loading, title = "Enter Secure PIN" }: { isOpen: boolean, onClose: () => void, onConfirm: (pin: string) => void, loading: boolean, title?: string }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      setError("PIN must be at least 4 digits");
      return;
    }
    setError("");
    onConfirm(pin);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        <div className="bg-[#002970] p-6 text-white flex justify-between items-center shadow-inner relative overflow-hidden">
            <div className="absolute opacity-10 -right-6 -top-6 pointer-events-none">
                <ShieldCheck size={120} />
            </div>
            <div className="relative z-10">
                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    <ShieldCheck size={20} className="text-[#00baf2]" />
                    {title}
                </h2>
                <p className="text-white/80 text-sm mt-1 font-medium">Verified by SettleX Secure Vault</p>
            </div>
            <button onClick={onClose} disabled={loading} className="relative z-10 p-1.5 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"><X size={20}/></button>
        </div>
        <div className="p-8">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100 font-medium flex items-center gap-2">⚠️ {error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center flex-col items-center gap-3">
              <label className="text-sm font-semibold text-gray-500">To authorize this transaction</label>
              <input 
                type="password" 
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="block w-3/4 border-b-2 border-gray-300 bg-gray-50/50 rounded-t-xl px-4 py-4 text-center text-4xl font-black tracking-[0.5em] text-gray-900 focus:ring-0 focus:border-[#00baf2] outline-none shadow-sm transition-all"
                maxLength={6}
                autoFocus
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || pin.length < 4}
              className="w-full bg-[#002970] hover:bg-blue-900 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 shadow-lg shadow-blue-900/20 active:scale-[0.98] mt-6"
            >
               {loading ? <Loader2 className="animate-spin" size={24} /> : "Verify & Authorize"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
