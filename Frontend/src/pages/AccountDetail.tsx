import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSOC } from '../context/SOCContext';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ShieldAlert,
    Smartphone,
    MapPin,
    Activity,
    ShieldCheck,
    Globe,
    Mail,
    RotateCcw
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

const API_BASE_URL = "http://localhost:8000/api";

const AccountDetail = () => {
    const { id } = useParams();
    const { sessions, lockdownAccount, remediateVerify, remediateResetPassword } = useSOC();
    const fallbackSession = sessions.find(s => s.id === id) || sessions[0];

    const [accountData, setAccountData] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchDetails = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/accounts/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setAccountData(data.account);
                    setEvents(data.recent_events || []);
                    setIncidents(data.incident_history || []);
                }
            } catch (err) {
                console.error("Failed to fetch account details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const session = accountData ? {
        id: accountData.id,
        accountNumber: accountData.account_number,
        bank: 'SentinelX Internal',
        riskScore: accountData.risk_score,
        riskLevel: accountData.risk_level.toUpperCase() === 'SAFE' ? 'LOW' : accountData.risk_level.toUpperCase(),
        status: (() => {
            const s = (accountData.account_status || 'active').toLowerCase();
            if (s === 'active') return 'Active';
            if (s === 'monitoring') return 'Monitoring';
            if (s === 'verification required') return 'Verification Required';
            return 'Locked';
        })(),
        device: accountData.baseline_primary_device || 'Unknown',
        location: accountData.baseline_primary_location || 'Unknown'
    } : fallbackSession;

    // Use actual events for timeline if available, otherwise mock
    const timelineData = events.length > 0
        ? [...events].reverse().map(e => ({
            time: new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            score: e.risk_contribution || 0
        }))
        : Array.from({ length: 20 }, (_, i) => ({
            time: `T-${20 - i}`,
            score: Math.max(0, Math.min(300, (session?.riskScore || 0) + (Math.random() * 20 - 10)))
        }));

    if (loading) {
        return <div className="text-center py-20 text-cyber-primary animate-pulse">Loading forensics data...</div>;
    }

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
                                        animate={{ strokeDashoffset: 364.4 - (364.4 * session.riskScore) / 300 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className={
                                            session.riskScore >= 240 ? 'text-rose-500' :
                                                session.riskScore >= 180 ? 'text-amber-500' :
                                                    session.riskScore >= 90 ? 'text-emerald-400' : 'text-cyber-primary'
                                        }
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold font-mono">{session.riskScore?.toFixed(1)}</span>
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Risk / 300</span>
                                </div>
                            </div>

                            <h2 className="text-lg font-bold mb-1 font-mono">{session.accountNumber}</h2>
                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.2em] ${session.riskLevel === 'LOW' ? 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20' :
                                session.riskLevel === 'MEDIUM' ? 'bg-amber-400/10 text-amber-500 border border-amber-400/20' :
                                    session.riskLevel === 'HIGH' ? 'bg-rose-400/10 text-rose-400 border border-rose-400/20' :
                                        'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                                }`}>
                                {session.riskLevel} SENSITIVITY
                            </span>

                            <div className="w-full mt-10 space-y-4 text-left">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <ShieldCheck size={16} />
                                        <span className="text-xs font-medium uppercase tracking-wider">Status</span>
                                    </div>
                                    <span className={`text-xs font-bold ${
                                        session.status === 'Active' ? 'text-cyber-primary' : 
                                        session.status === 'Locked' ? 'text-rose-500' :
                                        session.status === 'Monitoring' ? 'text-amber-500' : 'text-blue-400'
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
                                    <span className="text-xs font-bold truncate max-w-[120px]" title={session.location}>{session.location}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <button
                        onClick={() => id && lockdownAccount(id)}
                        disabled={session.status === 'Locked'}
                        className="w-full py-4 rounded-2xl bg-cyber-primary/10 border border-cyber-primary/20 text-cyber-primary font-bold hover:bg-cyber-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ShieldAlert size={18} />
                        {session.status === 'Locked' ? 'ACCOUNT SECURED' : 'IMMEDIATE LOCKDOWN'}
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => id && remediateVerify(id)}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all flex flex-col items-center gap-2 group"
                        >
                            <Mail size={18} className="group-hover:text-cyber-primary transition-colors" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-center">Verify Identity</span>
                        </button>
                        <button
                            onClick={() => id && remediateResetPassword(id)}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all flex flex-col items-center gap-2 group"
                        >
                            <RotateCcw size={18} className="group-hover:text-amber-500 transition-colors" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-center">Reset Password</span>
                        </button>
                    </div>
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
                                <AreaChart data={timelineData}>
                                    <defs>
                                        <linearGradient id="detailGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={session.riskScore >= 180 ? '#f43f5e' : '#10b981'} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={session.riskScore >= 180 ? '#f43f5e' : '#10b981'} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="time" hide={events.length === 0} stroke="#475569" fontSize={10} tickMargin={10} />
                                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(val: number | any) => val ? Number(val).toFixed(1) : "0.0"}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke={session.riskScore >= 180 ? '#f43f5e' : '#10b981'}
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
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {events.length > 0 ? events.map((event, i) => (
                                    <div key={i} className="flex flex-col border-l-2 border-white/5 pl-4 pb-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-slate-200 uppercase tracking-widest">{event.event_type.replace('_', ' ')}</span>
                                            <span className="text-[10px] font-mono text-slate-500">
                                                {new Date(event.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest block truncate" title={event.location}>
                                            Location: {event.location} | IP: {event.ip_address}
                                        </span>
                                    </div>
                                )) : (
                                    incidents.length > 0 ? incidents.map((inc, i) => (
                                        <div key={i} className="flex flex-col border-l-2 border-rose-500/50 pl-4 pb-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-bold text-rose-400">{inc.attack_type}</span>
                                                <span className="text-[10px] font-mono text-slate-500">
                                                    {new Date(inc.created_at).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Severity: {inc.severity}</span>
                                        </div>
                                    )) : (
                                        <div className="text-xs text-slate-500 pb-2">No recorded incidents or events found in forensic DB.</div>
                                    )
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountDetail;
