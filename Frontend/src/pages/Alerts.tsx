import { useState } from 'react';
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
import { Link } from 'react-router-dom';

const Alerts = () => {
    const { alerts, resolveAlert } = useSOC();
    const [filter, setFilter] = useState<'ALL' | 'RECENT' | 'CRITICAL' | 'HIGH' | 'LOW'>('ALL');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredAlerts = alerts.filter(a => {
        if (filter === 'ALL') return true;
        if (filter === 'RECENT') {
            // Filter alerts from the last 24 hours
            return new Date(a.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000;
        }
        // Map backend risks to filter levels if needed, but they should match
        return a.severity === filter;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic">
                        SENTINEL<span className="text-cyber-primary">X</span> THREATS
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-1 ml-1">
                        <span className="text-cyber-primary">REAL-TIME FEED</span> // SYSTEM TRIGGERS
                    </p>
                </div>

                <div className="flex items-center gap-3 relative">
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">Total Alerts:</span>
                        <span className="text-xs font-bold text-white">{alerts.length}</span>
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 border hover:border-cyber-primary/30 hover:bg-cyber-primary/10 hover:text-cyber-primary px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter !== 'ALL' ? 'bg-cyber-primary/20 border-cyber-primary/50 text-cyber-primary' : 'bg-white/5 border-white/10 text-slate-300'
                            }`}
                    >
                        <Filter size={14} />
                        {filter === 'ALL' ? 'Live Filter' : filter}
                    </button>

                    {isFilterOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-[#131722] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[50]">
                            <button onClick={() => { setFilter('ALL'); setIsFilterOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors">All Alerts</button>
                            <button onClick={() => { setFilter('RECENT'); setIsFilterOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors text-blue-400">Recent Attacks</button>
                            <button onClick={() => { setFilter('CRITICAL'); setIsFilterOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors text-rose-500">Critical Only</button>
                            <button onClick={() => { setFilter('HIGH'); setIsFilterOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors text-amber-500">High Only</button>
                            <button onClick={() => { setFilter('LOW'); setIsFilterOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors text-emerald-500">Low/Safe Only</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode='popLayout'>
                    {filteredAlerts.map((alert) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={alert.id}
                            className={`glass-card p-4 border-l-4 flex items-start gap-4 group ${alert.severity === 'CRITICAL' ? 'border-l-rose-500' :
                                alert.severity === 'HIGH' ? 'border-l-amber-400' : 'border-l-emerald-500'
                                }`}
                        >
                            <div className={`p-2 rounded-xl ${alert.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500' :
                                alert.severity === 'HIGH' ? 'bg-amber-400/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-500'
                                } shadow-lg border border-white/5`}>
                                <ShieldAlert size={20} />
                            </div>

                            <div className="flex-1 space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold">{alert.type}</h3>
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${alert.severity === 'CRITICAL' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' :
                                        alert.severity === 'HIGH' ? 'bg-amber-400/15 text-amber-400 border border-amber-400/20' : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20'
                                        }`}>
                                        {alert.severity}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[9px] font-black bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-400 tracking-wider">
                                        TARGET: <span className="text-white">{alert.holderName || 'Unknown'}</span>
                                    </span>
                                    <span className="text-[9px] font-mono text-slate-600">[{alert.accountNumber || 'SYSTEM'}]</span>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{alert.message}</p>
                                <div className="flex items-center gap-3 pt-1">
                                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                        <Clock size={10} />
                                        {new Date(alert.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                                    </div>
                                    <Link to='/reports' className="flex items-center gap-1.5 text-[9px] font-bold text-cyber-primary hover:text-cyber-secondary uppercase tracking-widest transition-colors">
                                        <ExternalLink size={10} />
                                        View Case
                                    </Link>
                                </div>
                            </div>

                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => resolveAlert(alert.id)}
                                    className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-cyber-primary/30 hover:bg-cyber-primary/10 hover:text-cyber-primary transition-all shadow-lg"
                                    title="Mark as Resolved"
                                >
                                    <CheckCircle2 size={16} />
                                </button>
                                <button
                                    onClick={() => resolveAlert(alert.id)}
                                    className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-rose-500/10 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                                    title="Dismiss"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredAlerts.length === 0 && (
                    <div className="glass-card py-32 flex flex-col items-center justify-center text-slate-500 border-dashed border-2 border-cyber-primary/10 bg-cyber-primary/[0.01]">
                        <div className="w-20 h-20 rounded-full bg-cyber-primary/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                            <CheckCircle2 size={40} className="text-cyber-primary/60" />
                        </div>
                        <h3 className="text-2xl font-black text-white italic tracking-tight mb-2">CLEAR SKIES</h3>
                        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
                            {filter === 'ALL' ? 'No active threats detected in the system.' : `No ${filter} threats detected.`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Alerts;
