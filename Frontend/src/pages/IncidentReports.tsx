import { useSOC } from '../context/SOCContext';
import {
    FileText,
    Activity
} from 'lucide-react';

const IncidentReports = () => {
    const { alerts } = useSOC();

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Incident Log</h1>
                    <p className="text-slate-500">Security event archive with AI-driven root cause analysis</p>
                </div>

                <button
                    onClick={handleExport}
                    disabled={alerts.length === 0}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FileText size={18} />
                    Export Case Data
                </button>
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
                            {alerts.map((report) => (
                                <tr key={report.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <span className="font-mono text-xs text-slate-400">
                                            {new Date(report.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${report.severity === 'CRITICAL' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' :
                                                report.severity === 'HIGH' ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'bg-cyber-primary shadow-[0_0_8px_#10b981]'
                                                }`} />
                                            <span className="font-bold text-sm tracking-tight">{report.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-[0.2em] w-fit ${report.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                                                report.severity === 'HIGH' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' : 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20'
                                                }`}>
                                                {report.severity}
                                            </span>
                                            {report.mlFraudScore != null && (
                                                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-violet-600/10 border border-purple-500/30 px-3 py-1 rounded-full w-fit shadow-[0_0_10px_rgba(168,85,247,0.15)] mt-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                                                    <span className="text-[10px] font-black text-purple-200 uppercase tracking-[0.1em]">
                                                        SENTINELX ML: {Math.round(report.mlFraudScore * 100)}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full">
                                            <Activity size={12} className="text-cyber-primary" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {report.severity === 'CRITICAL' ? 'Blocked' : 'Investigating'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="p-3 rounded-xl bg-cyber-primary/5 border border-cyber-primary/10 group-hover:bg-cyber-primary/10 transition-colors space-y-2">
                                            <p className="text-xs text-slate-400 leading-relaxed italic">
                                                "{report.message}"
                                            </p>
                                            {report.mlExplanation && (
                                                <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                                                    <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest bg-violet-500/10 px-2 py-0.5 rounded">
                                                        ML Root Cause: {report.mlExplanation}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {alerts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-500">
                                        No active incident reports.
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
