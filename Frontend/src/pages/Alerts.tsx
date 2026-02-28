import { useSOC } from '../context/SOCContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    Trash2,
    Filter,
    ShieldAlert,
    Clock,
    ExternalLink
} from 'lucide-react';

const Alerts = () => {
    const { alerts, resolveAlert } = useSOC();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-[-0.04em] text-white italic">
                        SENTINEL<span className="text-cyber-primary">X</span> THREATS
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-1 ml-1">
                        <span className="text-cyber-primary">REAL-TIME FEED</span> // SYSTEM TRIGGERS
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">Total Alerts:</span>
                        <span className="text-xs font-bold text-white">{alerts.length}</span>
                    </div>
                    <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-cyber-primary/30 hover:bg-cyber-primary/10 hover:text-cyber-primary px-4 py-2 rounded-xl text-xs font-bold transition-all">
                        <Filter size={14} />
                        Live Filter
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode='popLayout'>
                    {alerts.map((alert) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={alert.id}
                            className={`glass-card p-6 border-l-4 flex items-start gap-6 group ${alert.severity === 'CRITICAL' ? 'border-l-rose-500' :
                                alert.severity === 'HIGH' ? 'border-l-cyber-primary' : 'border-l-emerald-500'
                                }`}
                        >
                            <div className={`p-3 rounded-2xl ${alert.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500' :
                                alert.severity === 'HIGH' ? 'bg-cyber-primary/10 text-cyber-primary' : 'bg-emerald-500/10 text-emerald-500'
                                } shadow-lg border border-white/5`}>
                                <ShieldAlert size={24} />
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold">{alert.type}</h3>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${alert.severity === 'CRITICAL' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' :
                                        alert.severity === 'HIGH' ? 'bg-cyber-primary/15 text-cyber-primary border border-cyber-primary/20' : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20'
                                        }`}>
                                        {alert.severity}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">{alert.message}</p>
                                <div className="flex items-center gap-4 pt-2">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        <Clock size={12} />
                                        {new Date(alert.timestamp).toLocaleString()}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        <ExternalLink size={12} />
                                        View Details
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => resolveAlert(alert.id)}
                                    className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-cyber-primary/30 hover:bg-cyber-primary/10 hover:text-cyber-primary transition-all shadow-lg"
                                    title="Mark as Resolved"
                                >
                                    <CheckCircle2 size={18} />
                                </button>
                                <button
                                    className="p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-rose-500/10 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                                    title="Archive"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {alerts.length === 0 && (
                    <div className="glass-card py-32 flex flex-col items-center justify-center text-slate-500 border-dashed border-2 border-cyber-primary/10 bg-cyber-primary/[0.01]">
                        <div className="w-20 h-20 rounded-full bg-cyber-primary/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                            <CheckCircle2 size={40} className="text-cyber-primary/60" />
                        </div>
                        <h3 className="text-2xl font-black text-white italic tracking-tight mb-2">CLEAR SKIES</h3>
                        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">No active threats detected in the system.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Alerts;
