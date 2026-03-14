import { useState } from 'react';
import { useSOC } from '../context/SOCContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Key,
    Flame,
    Globe,
    ShieldX,
    Code,
    UserPlus,
    ArrowRightLeft,
    Zap,
    User,
    ChevronDown,
} from 'lucide-react';

const Simulation = () => {
    const { triggerSimulation, sessions } = useSOC();
    const [selectedTarget, setSelectedTarget] = useState<string>(sessions[0]?.id || '');
    const [isSimulating, setIsSimulating] = useState(false);

    const handleTrigger = async (type: string) => {
        setIsSimulating(true);
        try {
            await triggerSimulation(type, selectedTarget);
        } catch (error) {
            console.error("Simulation error:", error);
        } finally {
            setIsSimulating(false);
        }
    };


    const simulationActions = [
        {
            id: 'stuffing',
            label: 'Credential Stuffing',
            icon: Key,
            color: 'rose',
            desc: 'High-frequency login attempts using massive leaked credential databases.'
        },
        {
            id: 'brute',
            label: 'Brute Force Attack',
            icon: Flame,
            color: 'orange',
            desc: 'Rapid automated sequential password guessing via distributed botnets.'
        },
        {
            id: 'takeover',
            label: 'Account Takeover',
            icon: UserPlus,
            color: 'purple',
            desc: 'Full hijacking of verified sessions via session-token reconstruction.'
        },
        {
            id: 'travel',
            label: 'Impossible Travel',
            icon: Globe,
            color: 'blue',
            desc: 'Generate login events from disparate global locations within minutes.'
        },
        {
            id: 'transaction',
            label: 'Transaction Anomaly',
            icon: Code,
            color: 'pink',
            desc: 'Execute significantly larger-than-average fund transfers to flag heuristics.'
        },
        {
            id: 'bc',
            label: 'Internal Data Corruption',
            icon: ShieldX,
            color: 'rose',
            desc: 'Simulate direct manipulation of account balances by unauthorized background workers.'
        }
    ];

    const currentTarget = sessions.find(s => s.id === selectedTarget) || sessions[0];

    return (
        <div className="space-y-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 text-white">
                <div>
                    <h1 className="text-3xl font-black italic">
                        SENTINEL<span className="text-cyber-primary">X</span> ARSENAL
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-1 ml-1">
                        <span className="text-cyber-primary">OFFENSIVE SIMULATION</span> // VULNERABILITY TESTING
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    {/* Target Selector */}
                    <div className="relative group min-w-[280px]">
                        <label className="absolute -top-2 left-3 px-2 bg-[#0f1117] text-[9px] font-black uppercase tracking-widest text-cyber-primary z-10">Target Subject</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <select
                                value={selectedTarget}
                                onChange={(e) => setSelectedTarget(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-10 py-3 text-sm font-bold appearance-none outline-none focus:border-cyber-primary/40 transition-all cursor-pointer"
                            >
                                {sessions.map(s => (
                                    <option key={s.id} value={s.id} className="bg-[#131722]">{s.holderName} ({s.accountNumber})</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div className="px-5 py-3 bg-cyber-primary/5 border border-cyber-primary/20 rounded-xl flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                        <Zap size={16} className={`text-cyber-primary ${isSimulating ? 'animate-spin' : 'animate-pulse'}`} />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyber-primary">System Ready</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Latency: 24ms</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selected Target info banner */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedTarget}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-gradient-to-r from-cyber-primary/10 to-transparent border border-white/5 flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
                            <User className="text-cyber-primary" size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-wider">{currentTarget?.holderName}</h3>
                            <div className="flex gap-4 mt-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Score: <span className="text-cyber-primary">{currentTarget?.riskScore?.toFixed(1)}/300</span></span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status: <span className="text-cyber-primary">{currentTarget?.status}</span></span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Operational Baseline</p>
                        <p className="text-[10px] font-mono text-slate-400">{currentTarget?.location} • {currentTarget?.device}</p>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full min-w-0">
                {simulationActions.map((action, i) => (
                    <motion.button
                        key={action.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        disabled={isSimulating}
                        onClick={() => handleTrigger(action.label)}
                        className={`glass-card p-6 text-left group hover:border-cyber-primary/30 transition-all active:scale-[0.98] relative overflow-hidden h-[240px] flex flex-col ${isSimulating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyber-primary/5 rounded-full blur-2xl group-hover:bg-cyber-primary/10 transition-colors" />

                        <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 w-fit mb-5 text-slate-400 group-hover:text-cyber-primary group-hover:bg-cyber-primary/10 group-hover:border-cyber-primary/40 transition-all shadow-sm`}>
                            <action.icon size={24} strokeWidth={2.5} />
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-black italic mb-1 group-hover:text-white transition-colors uppercase">{action.label}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">{action.desc}</p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover:text-cyber-primary transition-colors">
                                <Flame size={12} className="group-hover:text-rose-500 transition-colors" />
                                Launch Attack
                            </div>
                            <ArrowRightLeft size={12} className="text-slate-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Forensic Detail available in Notifications */}
        </div>
    );
};

export default Simulation;

