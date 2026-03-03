import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Activity, User, LogOut, XCircle } from 'lucide-react';
import { useSOC } from '../context/SOCContext';
import { useNavigate } from 'react-router-dom';

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
        // Simple logout for now: reload app to reset login state
        window.location.href = '/';
    };

    const hasResults = filteredAccounts.length > 0 || filteredAlerts.length > 0;

    return (
        <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between sticky top-0 bg-[#050508]/80 backdrop-blur-2xl z-40 shadow-[0_1px_10px_rgba(0,0,0,0.2)]">
            <div className="flex items-center gap-6">
                <div className="relative group" ref={searchRef}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyber-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search accounts or incidents..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsSearchOpen(true);
                        }}
                        onFocus={() => setIsSearchOpen(true)}
                        className="bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 w-80 text-sm focus:border-cyber-primary/40 focus:outline-none focus:ring-1 focus:ring-cyber-primary/10 transition-all placeholder:text-slate-600"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setIsSearchOpen(false);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                        >
                            <XCircle size={16} />
                        </button>
                    )}

                    {/* Search Dropdown - show when focused so user sees it's active */}
                    {isSearchOpen && (
                        <div
                            className="absolute top-full left-0 mt-2 w-96 bg-[#131722] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2"
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            {!searchQuery.trim() ? (
                                <div className="p-4 text-sm text-slate-500 text-center">Type to search accounts or alerts...</div>
                            ) : !hasResults ? (
                                <div className="p-4 text-sm text-slate-500 text-center">No results for &quot;{searchQuery}&quot;</div>
                            ) : (
                                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                    {filteredAccounts.length > 0 && (
                                        <div className="p-2 border-b border-white/5">
                                            <div className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-500">Accounts</div>
                                            {filteredAccounts.map(acc => (
                                                <button
                                                    type="button"
                                                    key={acc.id}
                                                    onClick={() => handleSearchItemClick(`/accounts/${acc.id}`)}
                                                    className="w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-lg flex items-center justify-between transition-colors mt-1 text-slate-200"
                                                >
                                                    <div>
                                                        <div className="text-sm font-semibold">{acc.accountNumber ?? acc.id}</div>
                                                        <div className="text-xs text-slate-500">Risk: {acc.riskScore?.toFixed(1)}/300</div>
                                                    </div>
                                                    <div className={`text-[10px] px-2 py-1 rounded border ${acc.riskLevel === 'CRITICAL' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-cyber-primary/10 border-cyber-primary/20 text-cyber-primary'}`}>
                                                        {acc.riskLevel}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {filteredAlerts.length > 0 && (
                                        <div className="p-2">
                                            <div className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-500">Alerts</div>
                                            {filteredAlerts.map(alert => (
                                                <button
                                                    type="button"
                                                    key={alert.id}
                                                    onClick={() => handleSearchItemClick('/alerts')}
                                                    className="w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-lg flex flex-col transition-colors mt-1 text-slate-200"
                                                >
                                                    <div className="text-sm font-semibold text-rose-400">{alert.type}</div>
                                                    <div className="text-xs text-slate-400 line-clamp-1">{alert.message}</div>
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

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-inner">
                    <Activity className={systemStatus === 'Under Attack' ? 'text-rose-500 animate-pulse' : 'text-cyber-primary duration-1000'} size={14} />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        System: <span className={systemStatus === 'Under Attack' ? 'text-rose-500' : 'text-cyber-primary'}>{systemStatus}</span>
                    </span>
                </div>

                <div className="relative">
                    <button
                        onClick={() => navigate('/notifications')}
                        className={`relative p-2.5 rounded-xl border border-transparent hover:border-cyber-primary/20 transition-all bg-white/5 hover:bg-cyber-primary/10 group/bell`}
                    >
                        <Bell size={20} className="text-slate-500 group-hover/bell:text-cyber-primary transition-colors" />
                        {alerts.length > 0 && (
                            <span className="absolute top-1 right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber-primary border border-[#050508]"></span>
                            </span>
                        )}
                    </button>

                </div>

                <div className="flex items-center gap-3 pl-4 border-l border-white/10 relative" ref={profileRef}>
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold">Admin SOC</p>
                    </div>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="w-10 h-10 rounded-xl bg-cyber-primary/10 border border-cyber-primary/20 flex items-center justify-center hover:bg-cyber-primary/20 transition-colors cursor-pointer shadow-[0_0_15px_rgba(249,115,22,0.15)]"
                    >
                        <User size={20} className="text-cyber-primary" />
                    </button>

                    {isProfileOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-[#131722] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
                            <button
                                onClick={() => {
                                    navigate('/profile');
                                    setIsProfileOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 transition-colors font-semibold border-b border-white/5"
                            >
                                <User size={16} />
                                View Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-500 hover:bg-white/5 transition-colors font-semibold"
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
