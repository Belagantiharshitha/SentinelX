import { useSOC } from '../context/SOCContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, ShieldAlert, Clock, CheckCircle2 } from 'lucide-react';

const Notifications = () => {
    const { alerts, resolveAlert } = useSOC();

    return (
        <div className="space-y-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Bell className="text-cyber-primary" />
                        Intelligence Feed
                    </h1>
                    <p className="text-slate-500 mt-1">Real-time activity and system triggers awaiting review</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">Alert Volume:</span>
                        <span className="text-xs font-bold text-cyber-primary bg-cyber-primary/10 px-2 py-0.5 rounded-md">{alerts.length}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-full md:max-w-4xl">
                <AnimatePresence mode="popLayout">
                    {alerts.map((alert, i) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            transition={{ delay: i * 0.05 }}
                            key={alert.id}
                            className="glass-card relative p-5 border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-all flex items-start gap-5 group"
                        >
                            <div className="p-3 rounded-2xl bg-cyber-primary/10 text-cyber-primary group-hover:bg-cyber-primary/20 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.1)] border border-white/5">
                                <ShieldAlert size={22} className={alert.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'} />
                            </div>

                            <div className="flex-1 min-w-0 pr-10">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-base font-bold text-slate-200">{alert.type}</h3>
                                    <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-black uppercase tracking-[0.2em] ${alert.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' : 'bg-amber-400/20 text-amber-400 border border-amber-400/20'}`}>
                                        {alert.severity}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed mb-3">{alert.message}</p>

                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-black/40 w-fit px-3 py-1.5 rounded-lg border border-white/5 mb-1">
                                    <Clock size={12} className="text-cyber-primary/70" />
                                    {new Date(alert.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                                </div>
                            </div>

                            {/* Close icon button */}
                            <button
                                onClick={() => resolveAlert(alert.id)}
                                className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 transition-all text-slate-400 shadow-sm"
                                title="Close Notification"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {alerts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-card py-24 flex flex-col items-center justify-center text-slate-500 border-dashed border-2 border-white/5 bg-gradient-to-b from-transparent to-white/[0.01]"
                    >
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                            <CheckCircle2 size={36} className="text-emerald-500/60" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-300 mb-2">You're all caught up!</h3>
                        <p className="text-sm">No new notifications or alerts at this time.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
