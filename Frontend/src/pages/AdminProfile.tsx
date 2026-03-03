import { motion } from 'framer-motion';
import { User, Shield, Mail, Calendar, Activity, ChevronRight, LayoutDashboard, Bell, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminProfile = () => {
    const adminData = {
        name: "Admin SOC",
        role: "CISO / Lead Security Engineer",
        email: "admin@sentinelx.io",
        clearance: "Level 5 - Genesis Alpha",
        joined: "January 2024",
        stats: [
            { label: 'Active Watches', value: '12', icon: Activity, color: 'text-cyber-primary' },
            { label: 'System Uptime', value: '99.9%', icon: ShieldCheck, color: 'text-emerald-400' },
            { label: 'Pending Notifications', value: '2', icon: Bell, color: 'text-amber-400' }
        ]
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Link to="/" className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyber-primary/30 text-slate-400 transition-all">
                    <LayoutDashboard size={20} />
                </Link>
                <h1 className="text-3xl font-black tracking-tight italic uppercase">
                    OPERATOR <span className="text-cyber-primary">IDENTITY</span>
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="md:col-span-1 glass-card p-8 flex flex-col items-center text-center"
                >
                    <div className="w-32 h-32 rounded-3xl bg-cyber-primary/10 border border-cyber-primary/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                        <User size={64} className="text-cyber-primary" />
                    </div>
                    <h2 className="text-2xl font-black text-white">{adminData.name}</h2>
                    <p className="text-xs font-black text-cyber-primary uppercase tracking-[0.2em] mt-1">{adminData.role}</p>

                    <div className="w-full mt-10 space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Clearance</span>
                            <span className="text-[10px] font-black text-white uppercase">{adminData.clearance}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID Hash</span>
                            <span className="text-[10px] font-mono text-slate-500">0x8A...F24</span>
                        </div>
                    </div>
                </motion.div>

                {/* Account Details & Stats */}
                <div className="md:col-span-2 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8"
                    >
                        <h3 className="text-lg font-bold mb-8 border-l-2 border-cyber-primary pl-4">Security Credentials</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Mail size={12} className="text-cyber-primary" /> Email Endpoint
                                </label>
                                <p className="text-sm font-bold text-slate-200">{adminData.email}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Shield size={12} className="text-cyber-primary" /> Authority Level
                                </label>
                                <p className="text-sm font-bold text-slate-200">System Administrator</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar size={12} className="text-cyber-primary" /> Deployment Date
                                </label>
                                <p className="text-sm font-bold text-slate-200">{adminData.joined}</p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {adminData.stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className="glass-card p-6 border border-white/5"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <stat.icon size={20} className={stat.color} />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase">Live</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                <h4 className="text-2xl font-black text-white">{stat.value}</h4>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-8 bg-gradient-to-br from-cyber-primary/5 to-transparent border-cyber-primary/10"
                    >
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 italic uppercase tracking-tight">
                            <Activity size={20} className="text-cyber-primary" /> Recent System Operations
                        </h3>
                        <div className="space-y-4">
                            {[
                                { op: "Baseline Reset", time: "12:45:01", status: "Complete" },
                                { op: "Manual IP Whitelist", time: "11:20:15", status: "Verified" },
                                { op: "Emergency Lockdown Test", time: "09:12:44", status: "Secured" }
                            ].map((op, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-cyber-primary/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyber-primary" />
                                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{op.op}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{op.time}</span>
                                        <ChevronRight size={14} className="text-slate-700 group-hover:text-cyber-primary transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
