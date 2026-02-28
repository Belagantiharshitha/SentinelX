import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Lock, User as UserIcon, Cpu, Zap, Activity, Terminal, ShieldCheck } from 'lucide-react';

interface LoginProps {
    onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
    const [username, setUsername] = useState('admin_soc');
    const [password, setPassword] = useState('••••••••');
    const [loading, setLoading] = useState(false);
    const [loginMessage, setLoginMessage] = useState('INITIALIZING SECURE PROTOCOLS...');

    const particles = useMemo(() => {
        return [...Array(40)].map((_, i) => ({
            id: i,
            size: Math.random() * 3 + 1,
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: Math.random() * 8 + 8,
            delay: Math.random() * 5
        }));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Technical log simulation
        const messages = [
            "DECRYPTING RSA-4096 TOKENS...",
            "ESTABLISHING NEURAL HANDSHAKE...",
            "BYPASSING FIREWALL KERNEL...",
            "ACCESS RADIUS GRANTED. SYNCING..."
        ];

        messages.forEach((msg, i) => {
            setTimeout(() => setLoginMessage(msg), i * 500);
        });

        setTimeout(() => {
            onLogin();
            setLoading(false);
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-[#020205] flex items-center justify-center p-4 relative overflow-hidden font-sans">

            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-cyber-primary/10 backdrop-blur-md flex flex-col items-center justify-center border-[20px] border-cyber-primary/20 pointer-events-none"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="bg-black/50 p-8 rounded-full border border-cyber-primary shadow-[0_0_50px_rgba(139,92,246,0.5)] mb-8"
                        >
                            <ShieldCheck size={80} className="text-cyber-primary" />
                        </motion.div>
                        <h2 className="text-3xl font-black italic tracking-widest text-white mb-4">SYSTEM BREACH: SUCCESS</h2>
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex gap-2">
                                {window.crypto.getRandomValues(new Uint8Array(5)).join(' ').split(' ').map((n, i) => (
                                    <span key={i} className="text-cyber-secondary font-mono text-xl animate-pulse">{n}</span>
                                ))}
                            </div>
                            <p className="text-cyber-primary font-black uppercase tracking-[0.4em] text-sm mt-4">{loginMessage}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Neural Background */}
            <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.4, 0.3] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: `url('/sentinelx_login_bg_1772256014432.png')` }}
            />

            <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#020205_100%)]" />

            {/* Matrix Particles */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0, 0.4, 0],
                            y: [0, -150],
                            x: [0, (Math.random() - 0.5) * 80]
                        }}
                        transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
                        className="absolute bg-cyber-primary rounded-full blur-[2px]"
                        style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass-card p-12 w-full max-w-xl relative z-10 border-white/5"
            >
                <div className="flex flex-col items-center mb-12">
                    <motion.div
                        whileHover={{ rotate: 180 }}
                        className="bg-black/40 p-6 rounded-[2.5rem] border border-cyber-primary/30 relative z-10 shadow-[0_0_40px_rgba(139,92,246,0.15)] mb-8"
                    >
                        <ShieldAlert size={56} className="text-cyber-primary" strokeWidth={1.5} />
                    </motion.div>

                    <h1 className="text-5xl font-black tracking-[-0.06em] text-white mb-2 italic">
                        SENTINEL<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary to-cyber-secondary">X</span>
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2 ml-1">
                            <Terminal size={12} className="text-cyber-primary" />
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">SECURE_TERMINAL_ID</label>
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full glass-input border-cyber-primary/10"
                            placeholder="OPERATOR"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2 ml-1">
                            <Lock size={12} className="text-cyber-secondary" />
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">ENCRYPTION_PHRASE</label>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full glass-input border-cyber-secondary/10"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={loading} className="w-full btn-primary py-5">
                            <div className="flex items-center justify-center gap-3">
                                <Zap size={18} fill="currentColor" />
                                <span>AUTHENTICATE SYSTEM</span>
                            </div>
                        </button>
                    </div>
                </form>

                <div className="mt-12 flex justify-between items-center opacity-40">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-cyber-primary rounded-full animate-pulse shadow-[0_0_8px_#8b5cf6]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Hub Link: Secured</span>
                    </div>
                    <div className="flex gap-4">
                        <Cpu size={14} className="text-slate-500" />
                        <Activity size={14} className="text-slate-500" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
