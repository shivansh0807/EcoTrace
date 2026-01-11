
import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Zap, Cloud, Activity } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const PermissionScreen: React.FC<Props> = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const permissions = [
    { title: "Screen Time Access", icon: <Activity className="text-[#10b981]" />, desc: "Used to calculate energy consumption of active apps." },
    { title: "Network Monitoring", icon: <Cloud className="text-blue-400" />, desc: "Estimates carbon cost of data transfers and server requests." },
    { title: "Cloud Integration", icon: <Zap className="text-amber-400" />, desc: "Tracks emissions from background syncs and data storage." }
  ];

  const handleGrant = () => {
    setLoading(true);
    setTimeout(() => {
      setStep(1);
      setTimeout(() => {
        onComplete();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-[#050505] z-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#121212] rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden p-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#10b981]/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-[#10b981]/20">
            <ShieldCheck className="text-[#10b981] w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Audit Access</h1>
          <p className="text-gray-500 mt-4 text-sm font-medium leading-relaxed">
            EcoTrace requires secure metrics access to generate your environmental impact profile.
          </p>
        </div>

        <div className="space-y-4 mb-10">
          {permissions.map((p, i) => (
            <div key={i} className="flex items-start gap-5 p-5 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all">
              <div className="mt-1">{p.icon}</div>
              <div>
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">{p.title}</h3>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-1">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleGrant}
          disabled={loading}
          className="w-full bg-[#10b981] text-black font-black py-5 rounded-2xl shadow-xl shadow-[#10b981]/10 hover:bg-[#34d399] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              <span className="text-xs uppercase tracking-widest">{step === 0 ? "Analyzing Device..." : "Syncing Data..."}</span>
            </span>
          ) : (
            <>Initialize Auditor <ArrowRight size={20} /></>
          )}
        </button>
        
        <p className="text-center text-[9px] text-gray-600 mt-6 uppercase tracking-[0.3em] font-black">
          Decentralized processing enabled
        </p>
      </div>
    </div>
  );
};

export default PermissionScreen;
