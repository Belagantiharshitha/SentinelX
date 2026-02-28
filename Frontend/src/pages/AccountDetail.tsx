import { useParams, Link } from 'react-router-dom';
import { useSOC } from '../context/SOCContext';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ShieldAlert,
    Smartphone,
    MapPin,
    Activity,
    ShieldCheck,
    Globe
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const AccountDetail = () => {
    const { id } = useParams();
    const { sessions } = useSOC();
    const session = sessions.find(s => s.id === id) || sessions[0];

    const mockTimeline = Array.from({ length: 20 }, (_, i) => ({
        time: `T-${20 - i}`,
        score: Math.max(0, Math.min(100, session.riskScore + (Math.random() * 20 - 10)))
    }));

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center gap-4">
                <Link
                    to="/accounts"
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyber-primary/30 hover:bg-cyber-primary/10 text-slate-400 hover:text-cyber-primary transition-all shadow-lg"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Account Investigation</h1>
                    <p className="text-slate-500">Subject: {session.accountNumber} // Bank: {session.bank}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-8"
                    >
                        <div className="flex flex-col items-center text-center">
                            {/* Risk Score Meter */}
                            <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        className="text-white/5"
                                    />
                                    <motion.circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={364.4}
                                        initial={{ strokeDashoffset: 364.4 }}
                                        animate={{ strokeDashoffset: 364.4 - (364.4 * session.riskScore) / 100 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className={
                                            session.riskScore >= 80 ? 'text-rose-500' :
                                                session.riskScore >= 50 ? 'text-cyber-primary' :
                                                    session.riskScore >= 20 ? 'text-emerald-400' : 'text-cyber-primary'
                                        }
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold font-mono">{session.riskScore}</span>
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Risk</span>
                                </div>
                            </div>

                            <h2 className="text-lg font-bold mb-1 font-mono">{session.accountNumber}</h2>
                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.2em] ${session.riskLevel === 'LOW' ? 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20' :
                                session.riskLevel === 'MEDIUM' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' :
                                    session.riskLevel === 'HIGH' ? 'bg-rose-400/10 text-rose-400 border border-rose-400/20' :
                                        'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                }`}>
                                {session.riskLevel} SENSITIVITY
                            </span>

                            <div className="w-full mt-10 space-y-4 text-left">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <ShieldCheck size={16} />
                                        <span className="text-xs font-medium uppercase tracking-wider">Status</span>
                                    </div>
                                    <span className={`text-xs font-bold ${session.status === 'Active' ? 'text-cyber-primary' : 'text-rose-500'
                                        }`}>{session.status}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <Smartphone size={16} />
                                        <span className="text-xs font-medium uppercase tracking-wider">Endpoint</span>
                                    </div>
                                    <span className="text-xs font-bold">{session.device.split(' ')[0]}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <MapPin size={16} />
                                        <span className="text-xs font-medium uppercase tracking-wider">Location</span>
                                    </div>
                                    <span className="text-xs font-bold">{session.location.split(',')[0]}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <button className="w-full py-4 rounded-2xl bg-cyber-primary/10 border border-cyber-primary/20 text-cyber-primary font-bold hover:bg-cyber-primary/20 transition-all flex items-center justify-center gap-3">
                        <ShieldAlert size={18} />
                        IMMEDIATE LOCKDOWN
                    </button>
                </div>

                <div className="lg:col-span-3 space-y-8">
                    {/* Timeline of events */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold">Timeline of Events</h2>
                            <Activity className="text-slate-500" size={20} />
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={mockTimeline}>
                                    <defs>
                                        <linearGradient id="detailGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={session.riskScore >= 50 ? '#f43f5e' : '#10b981'} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={session.riskScore >= 50 ? '#f43f5e' : '#10b981'} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="time" hide />
                                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke={session.riskScore >= 50 ? '#f43f5e' : '#10b981'}
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#detailGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Risk contribution breakdown & Attack types */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-8"
                        >
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <ShieldAlert className="text-orange-500" size={18} />
                                Risk Breakdown & Attack Markers
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { label: 'Unusual Geo-location', val: '+24', type: 'Negative' },
                                    { label: 'Credential Stuffing Prob.', val: '88%', type: 'Attack' },
                                    { label: 'Browser Fingerprint', val: 'Match', type: 'Neutral' },
                                    { label: 'Transaction Velocity', val: 'High', type: 'Negative' },
                                ].map(item => (
                                    <div key={item.label} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                                        <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${item.type === 'Attack' ? 'text-rose-500' :
                                            item.type === 'Negative' ? 'text-cyber-primary' : 'text-emerald-400'
                                            }`}>{item.val}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Incident history */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-8"
                        >
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Globe className="text-blue-500" size={18} />
                                Incident History
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { time: '12:44:01', event: 'Impossible Travel Detected', meta: 'NY -> London (10m)' },
                                    { time: '12:40:12', event: 'Multiple Login Failures', meta: '8 attempts/min' },
                                    { time: '11:15:33', event: 'Successful Login', meta: 'New IP: 185.x.x.x' },
                                ].map((log, i) => (
                                    <div key={i} className="flex flex-col border-l-2 border-white/5 pl-4 pb-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-slate-200">{log.event}</span>
                                            <span className="text-[10px] font-mono text-slate-500">{log.time}</span>
                                        </div>
                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">{log.meta}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountDetail;
