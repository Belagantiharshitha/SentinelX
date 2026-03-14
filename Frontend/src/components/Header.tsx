import { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, LogOut, XCircle } from 'lucide-react';
import { useSOC } from '../context/SOCContext';
import { useNavigate } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Header = () => {
    const { systemStatus, alerts, sessions } = useSOC();
    const navigate = useNavigate();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close popups when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter results for search (case-insensitive, handle undefined)
    const q = searchQuery.trim().toLowerCase();
    const filteredAccounts = q
        ? sessions.filter(session =>
            String(session.accountNumber ?? '').toLowerCase().includes(q) ||
            String(session.id ?? '').toLowerCase().includes(q)
        ).slice(0, 5)
        : [];
    const filteredAlerts = q
        ? alerts.filter(alert =>
            String(alert.type ?? '').toLowerCase().includes(q) ||
            String(alert.message ?? '').toLowerCase().includes(q)
        ).slice(0, 5)
        : [];

    const handleSearchItemClick = (path: string) => {
        navigate(path);
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    const handleLogout = () => {
        window.location.href = '/';
    };

    const hasResults = filteredAccounts.length > 0 || filteredAlerts.length > 0;

    return (
        <header className="h-20 border-b border-white/5 px-10 flex items-center justify-between sticky top-0 bg-obsidian/60 backdrop-blur-3xl z-40">
            <div className="flex items-center gap-8">
                <div className="relative group" ref={searchRef}>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyber-primary transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Scan nodes or vectors..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsSearchOpen(true);
                        }}
                        onFocus={() => setIsSearchOpen(true)}
                        className="bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-12 py-3 w-96 text-xs font-medium focus:border-cyber-primary/40 focus:outline-none focus:ring-4 focus:ring-cyber-primary/5 transition-all placeholder:text-slate-600"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setIsSearchOpen(false);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                        >
                            <XCircle size={16} />
                        </button>
                    )}

                    {isSearchOpen && (
                        <div
                            className="absolute top-full left-0 mt-4 w-[450px] bg-obsidian-light border border-white/10 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden z-[100] p-2"
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            {!searchQuery.trim() ? (
                                <div className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 text-center">Awaiting Input Query...</div>
                            ) : !hasResults ? (
                                <div className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 text-center">Zero Results for &quot;{searchQuery}&quot;</div>
                            ) : (
                                <div className="max-h-96 overflow-y-auto custom-scrollbar p-2 space-y-4">
                                    {filteredAccounts.length > 0 && (
                                        <div>
                                            <div className="px-4 py-2 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Registry Nodes</div>
                                            {filteredAccounts.map(acc => (
                                                <button
                                                    type="button"
                                                    key={acc.id}
                                                    onClick={() => handleSearchItemClick(`/accounts/${acc.id}`)}
                                                    className="w-full text-left px-5 py-4 hover:bg-white/[0.03] rounded-3xl flex items-center justify-between transition-all border border-transparent hover:border-white/5"
                                                >
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-200">{acc.accountNumber ?? acc.id}</div>
                                                        <div className="text-[10px] text-slate-500 font-medium">Risk Index: {acc.riskScore?.toFixed(1)}</div>
                                                    </div>
                                                    <div className={cn(
                                                        "text-[9px] px-2 py-0.5 rounded-full border font-black tracking-widest uppercase",
                                                        acc.riskLevel === 'CRITICAL' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-cyber-primary/10 border-cyber-primary/20 text-cyber-primary'
                                                    )}>
                                                        {acc.riskLevel}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {filteredAlerts.length > 0 && (
                                        <div>
                                            <div className="px-4 py-2 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Active Vectors</div>
                                            {filteredAlerts.map(alert => (
                                                <button
                                                    type="button"
                                                    key={alert.id}
                                                    onClick={() => handleSearchItemClick('/alerts')}
                                                    className="w-full text-left px-5 py-4 hover:bg-white/[0.03] rounded-3xl flex flex-col transition-all border border-transparent hover:border-white/5"
                                                >
                                                    <div className="text-xs font-bold text-rose-400 uppercase tracking-tight">{alert.type}</div>
                                                    <div className="text-[10px] text-slate-500 italic mt-1">&quot;{alert.message}&quot;</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/5">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        systemStatus === 'Under Attack' ? 'bg-rose-500 animate-ping' : 'bg-cyber-primary'
                    )} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        STATUS: <span className={systemStatus === 'Under Attack' ? 'text-rose-500' : 'text-cyber-primary'}>{systemStatus}</span>
                    </span>
                </div>

                <div className="flex items-center gap-6 border-l border-white/5 pl-8">
                    <button
                        onClick={() => navigate('/notifications')}
                        className="relative p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyber-primary/30 transition-all group"
                    >
                        <Bell size={18} className="text-slate-500 group-hover:text-cyber-primary transition-colors" />
                        {alerts.length > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-40"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-obsidian text-[8px] font-black items-center justify-center text-white">
                                    {alerts.length}
                                </span>
                            </span>
                        )}
                    </button>

                    <div className="flex items-center gap-4 relative" ref={profileRef}>
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black uppercase tracking-[0.15em] text-white">Admin SOC</p>
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">Enforcement Div</p>
                        </div>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="w-12 h-12 rounded-2xl bg-cyber-primary/10 border border-cyber-primary/10 flex items-center justify-center hover:bg-cyber-primary hover:border-cyber-primary transition-all group overflow-hidden"
                        >
                            <User size={20} className="text-cyber-primary group-hover:text-white transition-colors" />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute top-full right-0 mt-4 w-60 bg-obsidian-light border border-white/10 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden z-[100] p-2">
                                <button
                                    onClick={() => {
                                        navigate('/profile');
                                        setIsProfileOpen(false);
                                    }}
                                    className="w-full flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:bg-white/[0.03] transition-all rounded-[1.5rem] border border-transparent hover:border-white/5"
                                >
                                    <User size={14} />
                                    Profile Registry
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 hover:bg-rose-500/10 transition-all rounded-[1.5rem] mt-1 border border-transparent hover:border-rose-500/20"
                                >
                                    <LogOut size={14} />
                                    Deactivate Node
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
