import { useSOC } from '../context/SOCContext';
import { motion } from 'framer-motion';
import {
    Users,
    ShieldAlert,
    ShieldCheck,
    Activity,
    AlertTriangle
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const Dashboard = () => {
    const { sessions, alerts, systemStatus } = useSOC();

    const highRiskCount = sessions.filter(s => s.riskLevel === 'HIGH' || s.riskLevel === 'CRITICAL').length;
    const avgRisk = sessions.length > 0
        ? Math.round(sessions.reduce((acc, s) => acc + s.riskScore, 0) / sessions.length)
        : 0;

    const pieData = [
        { name: 'Low', value: sessions.filter(s => s.riskLevel === 'LOW').length, color: '#34d399' },
        { name: 'Medium', value: sessions.filter(s => s.riskLevel === 'MEDIUM').length, color: '#10b981' },
        { name: 'High', value: sessions.filter(s => s.riskLevel === 'HIGH').length, color: '#059669' },
        { name: 'Critical', value: sessions.filter(s => s.riskLevel === 'CRITICAL').length, color: '#dc2626' },
    ];

    const stats = [
        { label: 'Total Accounts', value: sessions.length, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Accounts at Risk', value: highRiskCount, icon: ShieldAlert, color: 'text-cyber-primary', bg: 'bg-cyber-primary/10' },
        { label: 'Open Incidents', value: alerts.length, icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { label: 'System Health', value: '98.2%', icon: ShieldCheck, color: 'text-cyber-primary', bg: 'bg-cyber-primary/10' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-6 w-1 bg-cyber-primary rounded-full" />
                        <h1 className="text-4xl font-black tracking-[-0.04em] text-white italic">
                            SENTINEL<span className="text-cyber-primary">X</span> DASHBOARD
                        </h1>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] ml-4">
                        <span className="text-cyber-primary">GENESIS AI</span> // INTELLIGENT THREAT DETECTION
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-cyber-primary/5 border border-cyber-primary/20 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                        <div className="relative">
                            <span className="absolute inset-0 bg-cyber-primary rounded-full animate-ping opacity-75" />
                            <span className="relative block w-2.5 h-2.5 bg-cyber-primary rounded-full shadow-[0_0_10px_#10b981]" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyber-primary">Global Link Active</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className={`${stat.bg} p-3 rounded-2xl border border-white/5 shadow-inner`}>
                                <stat.icon className={stat.color} size={28} />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Status</span>
                                <span className="text-[9px] font-black text-cyber-primary uppercase tracking-[0.3em] animate-pulse">Running</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                            <h3 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h3>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(v => <div key={v} className={`w-3 h-1 rounded-full ${v < 5 ? 'bg-cyber-primary/20' : 'bg-cyber-primary/40'}`} />)}
                            </div>
                            <span className="text-[9px] font-bold text-slate-700">LVL {i + 1}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Risk Distribution Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 glass-card p-8"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold">Threat Distribution</h2>
                        <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs outline-none">
                            <option>Last 24 Hours</option>
                            <option>Last 7 Days</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sessions.slice(0, 10).map((s, i) => ({ name: `T-${i}`, score: s.riskScore }))}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" hide />
                                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Risk Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-8 flex flex-col items-center justify-center"
                >
                    <h2 className="text-xl font-bold mb-8 self-start">Severity Split</h2>
                    <div className="h-[250px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {pieData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={_entry.color} stroke="none" />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold">{avgRisk}</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Avg Risk</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                        {pieData.map(item => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-xs text-slate-400">{item.name} ({item.value})</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity Feed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Activity Feed</h2>
                        <Activity className="text-slate-500" size={20} />
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                        {alerts.slice(0, 10).map((alert) => (
                            <div key={alert.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                <div className={`p-2 rounded-lg ${alert.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-500' :
                                    alert.severity === 'HIGH' ? 'bg-green-500/20 text-green-500' :
                                        'bg-emerald-500/20 text-emerald-500'
                                    }`}>
                                    <AlertTriangle size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-bold truncate">{alert.type}</span>
                                        <span className="text-[10px] text-slate-500 font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 line-clamp-1">{alert.message}</p>
                                </div>
                            </div>
                        ))}
                        {alerts.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-500 opacity-50">
                                <ShieldCheck size={48} className="mb-4" />
                                <p>No active threats detected</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Global Security Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`glass-card p-8 transition-all duration-1000 ${systemStatus === 'Under Attack' ? 'shadow-[0_0_50px_rgba(239,68,68,0.1)] border-rose-500/20' : 'border-white/5'
                        }`}
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold">Defensive Posture</h2>
                        <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${systemStatus === 'Under Attack' ? 'bg-rose-500 text-white' : 'bg-cyber-primary text-white'
                            }`}>
                            {systemStatus}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                <span className="text-slate-500">ML Anomaly Detection</span>
                                <span className="text-cyber-primary">Optimal</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '94%' }}
                                    className="h-full bg-cyber-primary"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                <span className="text-slate-500">Firewall Latency</span>
                                <span className="text-blue-500">12ms</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '15%' }}
                                    className="h-full bg-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                <span className="text-slate-500">Database Integrity</span>
                                <span className="text-cyber-primary">100% Secure</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    className="h-full bg-gradient-to-r from-cyber-primary to-cyber-secondary shadow-[0_0_15px_rgba(249,115,22,0.6)]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 p-6 rounded-3xl bg-cyber-primary/5 border border-cyber-primary/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity size={80} className="text-cyber-primary" />
                        </div>
                        <div className="flex items-center gap-4 mb-4 relative z-10">
                            <div className="bg-cyber-primary/20 p-2.5 rounded-xl border border-cyber-primary/20 shadow-lg">
                                <Activity className="text-cyber-primary" size={20} strokeWidth={3} />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Genesis AI Prediction</span>
                        </div>
                        <p className="text-xs text-slate-400 italic leading-relaxed relative z-10 pl-2 border-l-2 border-cyber-primary/30">
                            "SentinelX has identified anomalous traffic clusters from **LD-402**. Our ML models predict a 12% probability of a coordinated brute-force event. **Recommendation:** Escalate monitoring for high-value clusters."
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
