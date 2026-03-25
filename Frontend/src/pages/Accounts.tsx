import { useState } from 'react';
import { useSOC } from '../context/SOCContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Activity,
    ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Accounts = () => {
    const { sessions } = useSOC();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSessions = sessions.filter(s => {
        const accNum = s.accountNumber || '';
        const bankName = s.bank || '';
        return accNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bankName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'LOW': return 'text-cyber-primary bg-cyber-primary/10 border border-cyber-primary/20';
            case 'MEDIUM': return 'text-amber-400 bg-amber-400/10 border border-amber-400/20';
            case 'HIGH': return 'text-rose-400 bg-rose-400/10 border border-rose-400/20';
            case 'CRITICAL': return 'text-rose-500 bg-rose-500/15 border border-rose-500/30';
            default: return 'text-slate-500 bg-slate-500/10';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-[-0.04em] text-white italic">
                        SENTINEL<span className="text-cyber-primary">X</span> ACCOUNTS
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-1 ml-1">
                        <span className="text-cyber-primary">BEHAVIORAL MONITOR</span> // RISK OVERSIGHT
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyber-primary transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Target Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-cyber-primary/40 focus:outline-none focus:ring-1 focus:ring-cyber-primary/10 transition-all w-72 placeholder:text-slate-600"
                        />
                    </div>
                </div>
            </div>

            <div className="glass-card overflow-x-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Account Number</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Bank</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Risk Score</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Risk Level</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Last Event</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        <AnimatePresence mode='popLayout'>
                            {filteredSessions.map((session) => (
                                <motion.tr
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    key={session.id}
                                    className="group hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-6 py-5">
                                        <div>
                                            <p className="text-sm font-bold font-mono">{session.accountNumber}</p>
                                            <p className="text-[10px] text-slate-500 font-mono">ID: {session.id}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-medium">{session.bank}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-lg font-bold font-mono">{session.riskScore.toFixed(1)}/300</span>
                                            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(session.riskScore / 3)}%` }}
                                                    className={`h-full ${session.riskLevel === 'LOW' ? 'bg-cyber-primary' :
                                                        session.riskLevel === 'MEDIUM' ? 'bg-amber-400' :
                                                            session.riskLevel === 'HIGH' ? 'bg-rose-400' : 'bg-rose-500'
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-[0.2em] border ${getRiskColor(session.riskLevel)}`}>
                                            {session.riskLevel === 'LOW' ? 'SAFE' : session.riskLevel}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-[0.2em] border ${session.status === 'Active' ? 'bg-cyber-primary/10 text-cyber-primary border-cyber-primary/20' :
                                            session.status === 'Locked' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                            session.status === 'Monitoring' ? 'bg-amber-400/10 text-amber-500 border-amber-400/20' :
                                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                            {session.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Activity size={14} />
                                            <span className="text-xs">{session.lastEvent}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <Link
                                            to={`/accounts/${session.id}`}
                                            className="inline-flex items-center gap-2 bg-white/5 hover:bg-cyber-primary/10 text-slate-500 hover:text-cyber-primary px-4 py-2 rounded-xl border border-white/5 hover:border-cyber-primary/20 transition-all group/btn shadow-inner"
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-widest">Inspect</span>
                                            <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
            {filteredSessions.length === 0 && (
                <div className="py-20 text-center text-slate-500">
                    <Search className="mx-auto mb-4 opacity-20" size={48} />
                    <p>No matches found for "{searchTerm}"</p>
                </div>
            )}
        </div>
    );
};

export default Accounts;
