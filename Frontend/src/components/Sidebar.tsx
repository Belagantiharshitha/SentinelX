import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    AlertCircle,
    Zap,
    FileText,
    ChevronLeft,
    ChevronRight,
    ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (val: boolean) => void;
}

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Accounts', path: '/accounts' },
    { icon: AlertCircle, label: 'Alerts', path: '/alerts' },
    { icon: Zap, label: 'Simulation', path: '/simulation' },
    { icon: FileText, label: 'Incident Reports', path: '/reports' },
];

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 80 : 260 }}
            className="bg-[#050508]/95 border-r border-white/5 flex flex-col h-screen sticky top-0 backdrop-blur-md z-20"
        >
            <div className="p-8 flex items-center gap-4 overflow-hidden border-b border-white/5 mb-4">
                <div className="bg-cyber-primary/15 border border-cyber-primary/30 p-2.5 rounded-2xl shrink-0 shadow-[0_0_20px_rgba(249,115,22,0.15)] group/logo cursor-pointer relative">
                    <div className="absolute inset-0 bg-cyber-primary/20 blur-xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-700" />
                    <ShieldAlert className="text-cyber-primary relative z-10" size={24} strokeWidth={2.5} />
                </div>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-0"
                    >
                        <span className="font-black text-xl tracking-[-0.03em] text-white selection:bg-cyber-primary/40 leading-none">
                            SENTINEL<span className="text-cyber-primary">X</span>
                        </span>
                    </motion.div>
                )}
            </div>

            <nav className="flex-1 px-4 space-y-2.5">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group overflow-hidden border border-transparent relative",
                            isActive
                                ? "bg-cyber-primary/10 text-cyber-primary border-cyber-primary/20 shadow-[0_4px_15px_rgba(249,115,22,0.05)]"
                                : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.04] hover:border-white/5"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-cyber-primary rounded-full" />}
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={cn("shrink-0 transition-transform duration-300 group-hover:scale-110", isActive && "text-cyber-primary drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]")} />
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={cn("whitespace-nowrap text-sm tracking-tight", isActive ? "font-black" : "font-semibold")}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <button
                onClick={() => setCollapsed(!collapsed)}
                className="m-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors border border-transparent hover:border-white/5"
            >
                {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
        </motion.aside>
    );
};

export default Sidebar;
