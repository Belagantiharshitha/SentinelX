import { useSOC } from '../context/SOCContext';
import { motion } from 'framer-motion';
import {
    Users,
    ShieldAlert,
    ShieldCheck,
    Activity,
    AlertTriangle,
    ChevronRight,
    User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    ZAxis,
    ReferenceLine,
    Cell
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Dashboard = () => {
    const { sessions, alerts, systemStatus, dashboardData } = useSOC();


    const systemHealthDisplay = dashboardData?.system_health?.status === 'ok'
        ? '99.9%'
        : (dashboardData?.system_health ? 'DEGRADED' : 'ANALYZING...');

    const highRiskCount = sessions.filter(s => s.riskLevel === 'HIGH' || s.riskLevel === 'CRITICAL').length;

    const stats = [
        { label: 'Network Entities', value: sessions.length, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'High Risk Nodes', value: highRiskCount, icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { label: 'Active Threats', value: alerts.length, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Integrity Index', value: systemHealthDisplay, icon: ShieldCheck, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    ];

    const displayAccounts = dashboardData?.random_accounts || sessions.slice(0, 8);

    const chartData = displayAccounts.map((s: any) => {
        const date = new Date(s.updated_at || Date.now());
        const timeStr = isNaN(date.getTime()) ? 'N/A' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return { name: s.holder_name?.split(' ')[0] || 'Node', score: s.risk_score || 0, time: timeStr };
    });

    return (
        <div className="space-y-12 pb-10">
            {/* Elegant Title Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-3">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-1.5 h-6 bg-cyber-primary rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        />
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            SENTINEL<span className="text-cyber-primary">X</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[9px] ml-4">
                        <span className="text-cyber-primary">GENESIS</span> // BEHAVIORAL INTELLIGENCE
                    </p>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 group flex flex-col items-start"
                    >
                        <div className="mb-4">
                            <div className={`${stat.bg} p-3 rounded-2xl border border-white/5 group-hover:scale-105 transition-transform duration-500`}>
                                <stat.icon className={stat.color} size={24} strokeWidth={2} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                            <h3 className="text-3xl font-black text-white tabular-nums tracking-tight">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Major Activity Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 glass-card p-10"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight mb-1">Threat Trajectory</h2>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Anomaly patterns per localized node</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-cyber-primary bg-cyber-primary/10 px-3 py-1.5 rounded-full border border-cyber-primary/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyber-primary animate-pulse" />
                                LIVE FEED
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#475569"
                                    fontSize={10}
                                    tickMargin={15}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke="#475569"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '15px' }}
                                    itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: '800' }}
                                    cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 2 }}
                                    formatter={(val: number | any) => val ? Number(val).toFixed(2) : "0.00"}
                                />
                                <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Hardcore PCA Threat Map */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-1 glass-card p-10 flex flex-col items-center"
                >
                    <div className="w-full text-left mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-black">Threat Map</h2>
                            <span className="text-[8px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30 font-black tracking-widest uppercase">HD-PCA</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Behavioral Outlier Clusters</p>
                    </div>

                    <div className="h-[280px] w-full bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" />
                                <XAxis type="number" dataKey="x" name="PCA1" hide domain={['auto', 'auto']} />
                                <YAxis type="number" dataKey="y" name="PCA2" hide domain={['auto', 'auto']} />
                                <ZAxis type="number" dataKey="z" range={[50, 400]} />
                                <Tooltip 
                                    cursor={{ strokeDasharray: '3 3' }} 
                                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                                />
                                <Scatter 
                                    name="Behaviors" 
                                    data={(dashboardData?.recent_events || []).map((e: any) => ({
                                        x: e.ml_pca_x || 0,
                                        y: e.ml_pca_y || 0,
                                        z: (e.ml_fraud_score || 0) * 100 + 20,
                                        color: (e.ml_fraud_score || 0) > 0.7 ? '#f43f5e' : (e.ml_fraud_score || 0) > 0.3 ? '#f59e0b' : '#10b981',
                                        name: e.event_type
                                    }))} 
                                >
                                    { (dashboardData?.recent_events || []).map((_entry: any, index: number) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={(_entry.ml_fraud_score || 0) > 0.7 ? '#f43f5e' : (_entry.ml_fraud_score || 0) > 0.3 ? '#f59e0b' : '#10b981'} 
                                            className="drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                                        />
                                    )) }
                                </Scatter>
                                <ReferenceLine x={0} stroke="#ffffff05" />
                                <ReferenceLine y={0} stroke="#ffffff05" />
                            </ScatterChart>
                        </ResponsiveContainer>
                        
                        <div className="absolute bottom-4 right-4 flex gap-3">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-[8px] font-black text-slate-500 uppercase">Secure</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                                <span className="text-[8px] font-black text-slate-500 uppercase">Outlier</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 w-full p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                <Activity className="text-purple-400" size={14} />
                            </div>
                            <p className="text-[9px] text-slate-400 font-bold leading-tight">
                                HD-PCA collapses 11 dimensions of behavior into 2D space to visualize real-time network anomalies.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Refined Activity Feed (Timeline Style) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-black uppercase tracking-tight">Intelligence Log</h2>
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                            <Activity className="text-slate-500" size={16} />
                        </div>
                    </div>

                    <div className="space-y-1 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-px before:bg-white/[0.03] max-h-[550px] overflow-auto pr-4 scrollbar-thin">
                        {(() => {
                            const consolidatedAlerts = (alerts || []).reduce((acc: any[], alert) => {
                                const alertTime = new Date(alert.timestamp).getTime();
                                // Consolidate by type AND holder name to distinguish between users
                                const existing = acc.find(a => a.type === alert.type && a.holderName === alert.holderName);
                                if (existing) {
                                    existing.count = (existing.count || 1) + 1;
                                    const existingTime = new Date(existing.timestamp).getTime();
                                    if (alertTime > existingTime) {
                                        existing.timestamp = alert.timestamp; // Keep the latest ISO string
                                        existing.message = alert.message; // Keep the latest message
                                        existing.severity = alert.severity;
                                        existing.sortTime = alertTime;
                                        existing.mlFraudScore = alert.mlFraudScore;
                                        existing.mlExplanation = alert.mlExplanation;
                                    }
                                } else {
                                    acc.push({ ...alert, count: 1, sortTime: alertTime });
                                }
                                return acc;
                            }, []).sort((a, b) => b.sortTime - a.sortTime);

                            return consolidatedAlerts.map((alert) => (
                                <div key={alert.id} className="group relative pl-10 py-5 transition-all">
                                    <div className={cn(
                                        "timeline-dot absolute left-2 top-[26px] z-10",
                                        alert.severity === 'CRITICAL' ? 'bg-rose-500' : alert.severity === 'HIGH' ? 'bg-amber-400' : 'bg-emerald-500'
                                    )} />

                                    <div className="bg-white/[0.02] border border-white/[0.03] p-4 rounded-3xl group-hover:bg-white/[0.04] group-hover:border-white/10 transition-all flex items-start gap-4">
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-black text-white uppercase">{alert.type}</span>
                                                    {alert.count > 1 && (
                                                        <span className="text-[9px] bg-cyber-primary/10 text-cyber-primary px-2 py-0.5 rounded-full font-black border border-cyber-primary/20">
                                                            ×{alert.count}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-mono font-bold">
                                                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] font-black bg-white/5 border border-white/5 px-2 py-0.5 rounded text-slate-400 uppercase tracking-widest">
                                                    {alert.holderName || 'N/A'}
                                                </span>
                                                {alert.mlFraudScore != null && (
                                                    <div className="flex flex-col gap-1.5 mt-2">
                                                        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-violet-600/10 border border-purple-500/30 px-3 py-1 rounded-full w-fit shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                                                            <span className="text-[10px] font-black text-purple-200 uppercase tracking-[0.1em]">
                                                                SENTINELX ML: {Math.round(alert.mlFraudScore * 100)}%
                                                            </span>
                                                        </div>
                                                        {alert.mlExplanation && (
                                                            <span className="text-[9px] font-bold text-violet-400/80 uppercase tracking-tighter ml-1">
                                                                ↳ {alert.mlExplanation}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="h-1 w-1 bg-slate-700 rounded-full mt-2" />
                                                <p className="text-xs text-slate-500 truncate italic">"{alert.message}"</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ));
                        })()}
                        {(!alerts || alerts.length === 0) && (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-600 space-y-4">
                                <ShieldCheck size={50} strokeWidth={1} className="opacity-20 animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Zero Vector Threats</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Account Oversight */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-black uppercase tracking-tight">Node Integrity</h2>
                        <Users className="text-slate-500" size={16} />
                    </div>
                    <div className="space-y-3">
                        {(dashboardData?.random_accounts || []).map((acc: any) => (
                            <div key={acc.id} className="group flex items-center justify-between p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-cyber-primary/30 hover:bg-cyber-primary/[0.02] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500",
                                        acc.risk_level === 'Critical' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                                            acc.risk_level === 'High' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                                'bg-cyber-primary/10 border-cyber-primary/20 text-cyber-primary'
                                    )}>
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white group-hover:text-cyber-primary transition-colors">{acc.holder_name}</p>
                                        <p className="text-[10px] text-slate-500 font-mono font-bold tracking-tight flex items-center gap-1">
                                            <span>{acc.account_number}</span>
                                            <span>//</span>
                                            <span className="truncate max-w-[100px]" title={acc.baseline_primary_location}>{acc.baseline_primary_location?.split(',')[0]}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className={cn(
                                            "text-sm font-black tabular-nums",
                                            acc.risk_level === 'Critical' ? 'text-rose-500' : acc.risk_level === 'High' ? 'text-amber-500' : 'text-cyber-primary'
                                        )}>{acc.risk_score.toFixed(1)}</p>
                                        <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mt-0.5">Index</p>
                                    </div>
                                    <Link to={`/accounts/${acc.id}`} className="p-2.5 rounded-xl bg-white/5 text-slate-500 hover:text-white hover:bg-cyber-primary transition-all">
                                        <ChevronRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link to="/accounts" className="mt-8 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 hover:text-white hover:border-cyber-primary/30 transition-all">
                        EXPLORE ENTITY DATABASE <ChevronRight size={14} />
                    </Link>
                </motion.div>
            </div>

            {/* Optimized Defensive Posture (Grid-based, no fixed overlap) */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "glass-card p-12 transition-all duration-1000",
                    systemStatus === 'Under Attack' ? "border-rose-500/30 ring-1 ring-rose-500/20" : "border-white/5"
                )}
            >
                <div className="flex items-center justify-between mb-12">
                    <div className="space-y-0.5">
                        <h2 className="text-xl font-black tracking-tight uppercase">DEFENSIVE POSTURE</h2>
                        <p className="text-[9px] text-slate-600 font-bold tracking-[0.3em] uppercase">Genesis AI Real-time Barrier</p>
                    </div>
                    <div className={cn(
                        "px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-2xl",
                        systemStatus === 'Under Attack' ? 'bg-rose-500 text-white animate-pulse' : 'bg-cyber-primary text-white shadow-cyber-primary/20'
                    )}>
                        {systemStatus}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            <span>ML ANOMALY</span>
                            <span className="text-cyber-primary">NOMINAL</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '94%' }}
                                className="h-full bg-gradient-to-r from-cyber-primary to-cyber-secondary shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            <span>THREAT DEFENSE</span>
                            <span className={alerts.length > 5 ? 'text-rose-500' : 'text-cyan-400'}>STABLE</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '15%' }}
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            <span>INTEGRITY index</span>
                            <span className="text-emerald-400 uppercase">ENFORCED</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-cyber-primary shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-12 p-8 rounded-[2rem] bg-white/[0.015] border border-white/5 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <Activity size={120} className="text-white" />
                    </div>
                    <div className="flex items-start gap-6 relative z-10">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <ShieldCheck className="text-cyber-primary" size={24} />
                        </div>
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">GENESIS AI PREDICTION</span>
                            <p className="text-sm text-slate-500 italic max-w-3xl leading-relaxed">
                                "SentinelX v5.0 is operating under optimal parameters. All localized nodes are reporting status normal. Genesis AI continuous telemetry ingestion is active without backlog."
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};


export default Dashboard;

