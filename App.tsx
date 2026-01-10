
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Leaf, Settings, Calendar, TrendingUp, LayoutDashboard, 
  Zap, Cpu, Smartphone, Wifi, Search, Send, Trophy, History, 
  ChevronRight, BarChart3, Globe, Star
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { 
  ActiveTab, DailySummary, AIInsight, DeviceProfile, AppUsage 
} from './types';
import { 
  NETWORK_FACTORS, DEVICE_FACTORS, CATEGORY_DATA_INTENSITY, MOCK_APPS, MOCK_REWARDS, GOAL_TARGET, CHART_COLORS 
} from './constants';
import { getEcoInsights, askCarbonQuestion } from './services/geminiService';
import PermissionScreen from './components/PermissionScreen';

const App: React.FC = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dash');
  const [profile, setProfile] = useState<DeviceProfile>({ type: 'laptop', network: 'wifi-fiber' });
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [sessionCO2, setSessionCO2] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const calculateEmissions = useCallback((minutes: number, category: string) => {
    const dev = DEVICE_FACTORS[profile.type as keyof typeof DEVICE_FACTORS];
    const net = NETWORK_FACTORS[profile.network as keyof typeof NETWORK_FACTORS];
    const data = CATEGORY_DATA_INTENSITY[category as keyof typeof CATEGORY_DATA_INTENSITY] || 5;
    return Number((minutes * dev + (minutes * data) * net).toFixed(2));
  }, [profile]);

  const generateData = useCallback(() => {
    const usage: AppUsage[] = MOCK_APPS.map(app => {
      const mins = Math.floor(Math.random() * 90) + 5;
      return { 
        id: app.id, name: app.name, category: app.category as any, 
        durationMinutes: mins, carbonEmissionsGrams: calculateEmissions(mins, app.category) 
      };
    });
    const total = Number(usage.reduce((acc, curr) => acc + curr.carbonEmissionsGrams, 0).toFixed(1));
    const s: DailySummary = { 
      date: new Date().toLocaleDateString(), 
      totalEmissionsGrams: total, 
      usageBreakdown: usage.sort((a,b)=>b.carbonEmissionsGrams-a.carbonEmissionsGrams), 
      profile 
    };
    setSummary(s);
    return s;
  }, [profile, calculateEmissions]);

  useEffect(() => {
    if (hasPermission) {
      const data = generateData();
      setIsLoadingInsights(true);
      getEcoInsights(data).then(res => { setInsights(res); setIsLoadingInsights(false); });
      const interval = setInterval(() => setSessionCO2(p => p + 0.001), 3000);
      return () => clearInterval(interval);
    }
  }, [hasPermission, generateData]);

  const handleNav = (tab: ActiveTab) => setActiveTab(tab);

  if (!hasPermission) {
    return <PermissionScreen onComplete={() => setHasPermission(true)} />;
  }

  if (!summary) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] font-sans selection:bg-[#10b981] selection:text-black pb-32">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#10b981] rounded-xl flex items-center justify-center shadow-lg shadow-[#10b981]/20">
            <Leaf className="text-black" size={22} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none uppercase">EcoTrace</h1>
            <span className="text-[10px] font-black text-[#10b981] uppercase tracking-[0.2em]">Auditor v3.0</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-[#10b981]/10 px-4 py-2 rounded-full border border-[#10b981]/20 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[10px] font-black text-[#10b981] uppercase tracking-widest">Pulse: {sessionCO2.toFixed(3)}g</span>
          </div>
          <button onClick={() => setActiveTab('settings')} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto pt-24 px-6">
        {/* DASHBOARD TAB */}
        {activeTab === 'dash' && (
          <div className="space-y-10 animate-in fade-in duration-700">
            <section className="bg-[#121212] rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#10b981]/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-opacity" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                  <p className="text-[10px] font-black text-[#10b981] uppercase tracking-[0.4em] mb-4">Current Footprint</p>
                  <div className="flex items-baseline gap-3 mb-8">
                    <span className="text-8xl font-black text-white tracking-tighter">{(summary.totalEmissionsGrams + sessionCO2).toFixed(1)}</span>
                    <span className="text-2xl font-bold text-gray-600">g CO2e</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Hardware</p>
                      <div className="flex items-center gap-2 text-sm font-bold capitalize"><Smartphone size={16} className="text-[#10b981]" /> {profile.type}</div>
                    </div>
                    <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Network</p>
                      <div className="flex items-center gap-2 text-sm font-bold uppercase"><Wifi size={16} className="text-blue-400" /> {profile.network.split('-')[1]}</div>
                    </div>
                  </div>
                </div>
                <div className="w-64 h-64 shrink-0 relative flex items-center justify-center">
                   <div className="absolute text-center">
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Score</p>
                     <p className="text-5xl font-black text-[#10b981]">A+</p>
                   </div>
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={summary.usageBreakdown.slice(0,5).map(a=>({name:a.name, value:a.carbonEmissionsGrams}))} innerRadius={80} outerRadius={110} paddingAngle={10} dataKey="value" stroke="none">
                         {CHART_COLORS.map((c, i) => <Cell key={i} fill={c} fillOpacity={0.8} />)}
                       </Pie>
                       <Tooltip contentStyle={{backgroundColor:'#121212', borderRadius:'16px', border:'1px solid rgba(255,255,255,0.1)'}} />
                     </PieChart>
                   </ResponsiveContainer>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-[#121212] rounded-[2rem] p-8 border border-white/5">
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <Zap size={16} className="text-amber-400" /> AI Insights
                </h3>
                <div className="space-y-6">
                  {isLoadingInsights ? <div className="h-40 bg-white/5 animate-pulse rounded-2xl" /> : insights.map((insight, i) => (
                    <div key={i} className="group cursor-default">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                        <h4 className="text-xs font-black text-white">{insight.title}</h4>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed mb-3">{insight.description}</p>
                      <div className="bg-[#10b981]/5 p-4 rounded-xl border border-[#10b981]/10 text-[10px] text-[#10b981] font-black uppercase tracking-widest leading-relaxed">
                        Tip: {insight.actionableTip}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-[#121212] rounded-[2rem] p-8 border border-white/5 overflow-hidden">
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                   <Cpu size={16} className="text-[#10b981]" /> App Matrix
                </h3>
                <div className="space-y-4">
                  {summary.usageBreakdown.slice(0, 5).map(app => (
                    <div key={app.id} className="bg-white/5 p-5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all border border-transparent hover:border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-[#10b981]">{MOCK_APPS.find(m=>m.id===app.id)?.icon}</div>
                        <div>
                          <p className="text-xs font-black text-white">{app.name}</p>
                          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{app.durationMinutes}m duration</p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-[#10b981]">{app.carbonEmissionsGrams}g</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section className="bg-[#121212] rounded-[2rem] p-8 border border-white/5">
              <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                <Search size={16} className="text-[#10b981]" /> Carbon Auditor Interface
              </h3>
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e)=>setSearchQuery(e.target.value)} 
                  onKeyDown={(e)=>e.key==='Enter' && !isSearching && askCarbonQuestion(searchQuery).then(setAiAnswer)} 
                  placeholder="Ask the auditor about your impact..." 
                  className="w-full bg-black border border-white/10 rounded-2xl py-5 px-6 text-sm focus:border-[#10b981] outline-none transition-all placeholder:text-gray-700" 
                />
                <button 
                  onClick={async ()=>{ if(!searchQuery.trim()) return; setIsSearching(true); setAiAnswer(await askCarbonQuestion(searchQuery)); setIsSearching(false); }} 
                  disabled={isSearching} 
                  className="absolute right-3 top-3 bottom-3 px-6 bg-[#10b981] text-black rounded-xl hover:bg-[#34d399] transition-all disabled:opacity-50"
                >
                  {isSearching ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Send size={18} />}
                </button>
              </div>
              {aiAnswer && (
                <div className="mt-6 p-6 bg-white/5 rounded-2xl border border-white/5 animate-in fade-in slide-in-from-bottom-2">
                  <p className="text-xs text-gray-300 leading-relaxed font-medium">{aiAnswer}</p>
                  <button onClick={()=>setAiAnswer(null)} className="mt-4 text-[9px] font-black uppercase tracking-widest text-[#10b981] hover:text-[#34d399]">Clear Log</button>
                </div>
              )}
            </section>
          </div>
        )}

        {/* LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
            <h2 className="text-3xl font-black tracking-tight">Audit Logs</h2>
            <div className="grid gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#121212] p-8 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-8">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center font-black text-[#10b981]">0{6-i}</div>
                    <div>
                      <h4 className="font-black text-white mb-1">Dec {12-i}, 2024</h4>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">ID: #ET-{Math.floor(Math.random()*9999)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xl font-black text-white">{400 + Math.floor(Math.random()*100)}g</p>
                      <p className="text-[9px] text-[#10b981] font-black uppercase tracking-widest">Verified Log</p>
                    </div>
                    <ChevronRight className="text-gray-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div className="space-y-10 animate-in slide-in-from-left-10 duration-500">
             <h2 className="text-3xl font-black tracking-tight">Performance Analytics</h2>
             <div className="bg-[#121212] p-10 rounded-[2.5rem] border border-white/5">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-10 flex items-center gap-2">
                  <BarChart3 size={16} className="text-[#10b981]" /> Weekly Emissions (g)
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[412, 489, 390, 512, 445, 430, 380].map((v, i)=>({date: 'Oct '+(18+i), v}))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize:10, fill:'#555'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize:10, fill:'#555'}} />
                      <Bar dataKey="v" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-500/10 p-8 rounded-[2rem] border border-blue-500/20 text-blue-400">
                   <Globe className="mb-4" />
                   <h4 className="text-2xl font-black">12.4kg</h4>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Offset</p>
                </div>
                <div className="bg-[#10b981]/10 p-8 rounded-[2rem] border border-[#10b981]/20 text-[#10b981]">
                   <Zap className="mb-4" />
                   <h4 className="text-2xl font-black">18.2 kWh</h4>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Energy saved</p>
                </div>
                <div className="bg-purple-500/10 p-8 rounded-[2rem] border border-purple-500/20 text-purple-400">
                   <Star className="mb-4" />
                   <h4 className="text-2xl font-black">Lv. 14</h4>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Impact tier</p>
                </div>
             </div>
          </div>
        )}

        {/* REWARDS TAB */}
        {activeTab === 'rewards' && (
          <div className="space-y-10 animate-in zoom-in-95 duration-500">
            <h2 className="text-3xl font-black tracking-tight">Eco Rewards</h2>
            <div className="bg-gradient-to-br from-[#10b981] to-[#065f46] p-10 rounded-[2.5rem] shadow-2xl shadow-[#10b981]/10 relative overflow-hidden group">
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
               <div className="relative z-10">
                 <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                    <Trophy className="text-[#10b981]" size={32} />
                 </div>
                 <h3 className="text-4xl font-black text-white mb-2 tracking-tighter">Impact Level 12</h3>
                 <p className="text-emerald-100/60 text-xs font-bold uppercase tracking-widest mb-10">You are in the top 5% of digital conservationists.</p>
                 <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-white w-3/4 shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                 </div>
                 <div className="flex justify-between mt-3 text-[10px] font-black uppercase tracking-widest text-emerald-100/40">
                    <span>2,450 XP</span>
                    <span>3,000 XP to Level 13</span>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {MOCK_REWARDS.map(reward => (
                 <div key={reward.id} className={`p-8 rounded-[2rem] border transition-all ${reward.unlocked ? 'bg-[#121212] border-white/10' : 'bg-black/50 border-white/5 opacity-40 grayscale'}`}>
                    <div className="flex items-center justify-between mb-6">
                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${reward.unlocked ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-gray-800 text-gray-500'}`}>
                         <Star size={24} />
                       </div>
                       {!reward.unlocked && <span className="text-[9px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">{reward.pointsRequired} pts</span>}
                    </div>
                    <h4 className="font-black text-white mb-2">{reward.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{reward.description}</p>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-12 animate-in zoom-in-95 duration-500">
             <h2 className="text-3xl font-black tracking-tight">Configuration</h2>
             <div className="bg-[#121212] p-10 rounded-[2.5rem] border border-white/5 space-y-10">
                <section className="space-y-6">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Device Profiling</p>
                  <div className="grid gap-4">
                    <label className="block">
                      <p className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Hardware Type</p>
                      <select value={profile.type} onChange={(e)=>setProfile(p=>({...p, type: e.target.value as any}))} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:border-[#10b981] outline-none transition-all">
                        <option value="smartphone">Smartphone</option>
                        <option value="tablet">Tablet</option>
                        <option value="laptop">Laptop</option>
                        <option value="desktop-pc">Desktop PC</option>
                        <option value="gaming-rig">Gaming Rig</option>
                      </select>
                    </label>
                    <label className="block">
                      <p className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Network Interface</p>
                      <select value={profile.network} onChange={(e)=>setProfile(p=>({...p, network: e.target.value as any}))} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:border-[#10b981] outline-none transition-all">
                        <option value="4g-lte">4G LTE Cellular</option>
                        <option value="5g">5G High-Speed</option>
                        <option value="wifi-fiber">Fiber Broadband</option>
                        <option value="wifi-dsl">DSL Broadband</option>
                      </select>
                    </label>
                  </div>
                </section>
                <button onClick={()=>{generateData(); setActiveTab('dash')}} className="w-full py-5 bg-[#10b981] text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-[#34d399] transition-all shadow-lg shadow-[#10b981]/20">Save & Recalibrate Auditor</button>
             </div>
          </div>
        )}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#121212]/80 backdrop-blur-2xl border border-white/5 rounded-full px-12 py-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-14 z-50">
        <button onClick={()=>handleNav('dash')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dash' ? 'text-[#10b981] scale-110' : 'text-gray-500 hover:text-white'}`}>
          <LayoutDashboard size={24} />
          <span className="text-[8px] font-black uppercase tracking-widest">Dash</span>
        </button>
        <button onClick={()=>handleNav('logs')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'logs' ? 'text-[#10b981] scale-110' : 'text-gray-500 hover:text-white'}`}>
          <History size={24} />
          <span className="text-[8px] font-black uppercase tracking-widest">Logs</span>
        </button>
        <div onClick={()=>{generateData(); setActiveTab('dash');}} className="w-16 h-16 bg-[#10b981] rounded-full flex items-center justify-center -mt-16 border-8 border-[#050505] shadow-2xl hover:scale-110 transition-transform cursor-pointer group">
          <Leaf size={28} className="text-black group-hover:rotate-12 transition-transform" />
        </div>
        <button onClick={()=>handleNav('stats')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'stats' ? 'text-[#10b981] scale-110' : 'text-gray-500 hover:text-white'}`}>
          <TrendingUp size={24} />
          <span className="text-[8px] font-black uppercase tracking-widest">Stats</span>
        </button>
        <button onClick={()=>handleNav('rewards')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'rewards' ? 'text-[#10b981] scale-110' : 'text-gray-500 hover:text-white'}`}>
          <Trophy size={24} />
          <span className="text-[8px] font-black uppercase tracking-widest">Win</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
