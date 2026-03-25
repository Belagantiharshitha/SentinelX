import React, { useState } from 'react';
import { useSOC } from '../context/SOCContext';
import {
    FileText,
    Activity,
    ChevronDown,
    Search,
    Shield,
    ClipboardList,
    AlertCircle,
    Mail,
    RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const IncidentReports = () => {
    const { alerts, remediateVerify, remediateResetPassword } = useSOC();
    const navigate = useNavigate();
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const filteredAlerts = (alerts || [])
        .filter(a => {
            const matchesFilter = filter === 'ALL' || a.severity === filter;
            const matchesSearch = !searchTerm || 
                (a.holderName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (a.type?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (a.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesFilter && matchesSearch;
        })
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const handleExport = () => {
        if (alerts.length === 0) return;

        const headers = ['Case ID', 'Date', 'Time', 'Attack Type', 'Severity', 'Holder Name', 'Account Number', 'Action Taken', 'SentinelX Analysis'];
        const csvRows = [
            headers.map(h => `"${h}"`).join(','),
            ...alerts.map(a => {
                const dateObj = new Date(a.timestamp);
                const date = dateObj.toLocaleDateString();
                const time = dateObj.toLocaleTimeString();
                const actionTaken = a.severity === 'CRITICAL' ? 'ENFORCED_BLOCK' : 'ACTIVE_MONITORING';

                return [
                    `SENTINELX-${a.id}`,
                    date,
                    time,
                    a.type,
                    a.severity,
                    a.holderName || 'Unknown',
                    a.accountNumber || 'N/A',
                    actionTaken,
                    a.message || 'Baseline anomaly detected.'
                ].map(val => {
                    const str = String(val).replace(/"/g, '""').replace(/\n/g, ' ');
                    return `"${str}"`;
                }).join(',');
            })
        ];

        // Add BOM for proper Excel UTF-8 rendering
        const BOM = '\uFEFF';
        const csvContent = BOM + csvRows.join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `sentinelx_incidents_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Incident log</h1>
                    <p className="text-slate-500">Security event archive with AI-driven root cause analysis</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyber-primary transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search entities or vectors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-cyber-primary/50 focus:ring-1 focus:ring-cyber-primary/20 w-64 transition-all"
                        />
                    </div>

                    <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
                        {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                    filter === s ? 'bg-cyber-primary text-black' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleExport}
                        disabled={alerts.length === 0}
                        className="bg-cyber-primary text-black hover:bg-cyber-secondary border border-cyber-primary/20 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ml-auto lg:ml-0 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    >
                        <FileText size={16} />
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Timestamp</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Attack Type</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Severity</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Action Taken</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">AI Summary (SentinelX Genesis)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredAlerts.map((report) => {
                                const isExpanded = expandedIds.has(report.id);
                                const rawMessage = report.message || "";
                                const sections = rawMessage.split(/(?=###|\d\.\s[A-Z\s]+:?)/g);
                                
                                // Simplified preview for the table cell
                                const rcaSection = sections.find(s => s.toUpperCase().includes("CAUSE")) || sections[0] || "";
                                const rcaPreview = rcaSection.replace(/^###\s*CAUSE\s*:?|^\d\.\s*CAUSE\s*:?/i, "").trim().split('\n')[0];

                                return (
                                    <React.Fragment key={report.id}>
                                        <tr 
                                            onClick={() => toggleExpand(report.id)}
                                            className={`hover:bg-white/[0.04] transition-all cursor-pointer group ${isExpanded ? 'bg-white/[0.03]' : ''}`}
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <ChevronDown className={`text-slate-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} size={16} />
                                                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-tighter">
                                                        {new Date(report.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${report.severity === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                                                    <span className="font-black text-xs uppercase tracking-tight">{report.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                                                    report.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-400/10 text-amber-400'
                                                }`}>
                                                    {report.severity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {report.severity === 'CRITICAL' ? 'Blocked' : 'Investigating'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <Search size={12} className="text-indigo-400 opacity-60" />
                                                    <p className="text-[11px] text-slate-400 truncate max-w-[400px]">
                                                        {rcaPreview || "View full forensic analysis..."}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                        
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan={5} className="px-8 py-0 border-none">
                                                        <motion.div 
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 border-t border-white/5">
                                                                {/* Header for expanded view */}
                                                                <div className="col-span-1 lg:col-span-3 pb-2 flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <Activity size={14} className="text-cyber-primary" />
                                                                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Forensic Investigation Report // Case ID: {report.id}</h3>
                                                                    </div>
                                                                    {report.mlFraudScore != null && (
                                                                        <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                                                                            <AlertCircle size={10} className="text-purple-400" />
                                                                            <span className="text-[9px] font-black text-purple-200">ML CONFIDENCE: {Math.round(report.mlFraudScore * 100)}%</span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Structured Report Cards */}
                                                                {(() => {
                                                                    // If after splitting, there's only one section (or none), display the raw message as a single block
                                                                    if (sections.filter(s => s.trim()).length <= 1) {
                                                                        return (
                                                                            <div className="col-span-1 lg:col-span-3 p-3 rounded-xl bg-cyber-primary/5 border border-cyber-primary/10 italic text-xs text-slate-400 leading-relaxed text-center">
                                                                                "{rawMessage}"
                                                                            </div>
                                                                        );
                                                                    }

                                                                    return sections.filter(s => s.trim()).map((section, idx) => {
                                                                        const cleanSection = section.replace(/^###\s*|^\d\.\s*/, "").trim();
                                                                        
                                                                        const knownHeaders = ["ROOT CAUSE ANALYSIS", "AUTOMATED MITIGATION", "SESSION AUDIT LOGS", "USER VERIFICATION & MFA", "COMPLIANCE & GOVERNANCE", "BEHAVIORAL ANOMALY"];
                                                                        let title = "";
                                                                        let content = "";
 
                                                                        for (const header of knownHeaders) {
                                                                            if (cleanSection.toUpperCase().startsWith(header)) {
                                                                                title = header;
                                                                                content = cleanSection.substring(header.length).replace(/^[:\s\n]+/, "").trim();
                                                                                break;
                                                                            }
                                                                        }
 
                                                                        if (!title) {
                                                                            const parts = cleanSection.split(/\n|:/);
                                                                            title = parts[0].trim();
                                                                            content = parts.slice(1).join("\n").trim() || cleanSection;
                                                                        }
                                                                        
                                                                        const isRCA = title.toUpperCase().includes("CAUSE");
                                                                        const isMIT = title.toUpperCase().includes("MITIGATION");
                                                                        const isAudit = title.toUpperCase().includes("AUDIT");
                                                                        const isMFA = title.toUpperCase().includes("MFA");
                                                                        const isComp = title.toUpperCase().includes("COMPLIANCE");
 
                                                                        const icon = isRCA ? <Search size={16} /> : isMIT ? <Shield size={16} /> : isAudit ? <Activity size={16} /> : isComp ? <AlertCircle size={16} /> : <ClipboardList size={16} />;
                                                                        const theme = isRCA ? "text-indigo-400 bg-indigo-500/5 border-indigo-500/10" : 
                                                                                    isMIT ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" : 
                                                                                    isAudit ? "text-cyan-400 bg-cyan-500/5 border-cyan-500/10" :
                                                                                    isMFA ? "text-rose-400 bg-rose-500/5 border-rose-500/10" :
                                                                                    isComp ? "text-purple-400 bg-purple-500/5 border-purple-500/10" :
                                                                                    "text-amber-400 bg-amber-500/5 border-amber-500/10";

                                                                        return (
                                                                            <div key={idx} className={`p-5 rounded-2xl border ${theme} h-full`}>
                                                                                <div className="flex items-center gap-3 mb-3">
                                                                                    <div className="p-2 rounded-lg bg-white/5">{icon}</div>
                                                                                    <h4 className="text-[11px] font-black uppercase tracking-widest">{title}</h4>
                                                                                </div>
                                                                                <p className="text-xs leading-relaxed text-slate-300 font-medium whitespace-pre-line">
                                                                                    {content}
                                                                                </p>
                                                                            </div>
                                                                        );
                                                                    });
                                                                })()}

                                                                {/* ML Explanation Footer */}
                                                                {report.mlExplanation && (
                                                                    <div className="col-span-1 lg:col-span-3 mt-2 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-center gap-3">
                                                                        <Activity size={16} className="text-purple-400" />
                                                                        <div>
                                                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Machine Learning Attribution</p>
                                                                            <p className="text-xs font-bold text-purple-200">{report.mlExplanation}</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                

                                                            </div>
                                                        </motion.div>
                                                    </td>
                                                </tr>
                                            )}
                                        </AnimatePresence>
                                    </React.Fragment>
                                );
                            })}
                            {filteredAlerts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                        Zero active threats detected.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default IncidentReports;
