import {
    FileText,
    Activity
} from 'lucide-react';

const IncidentReports = () => {
    const reports = [
        {
            id: 'CASE-8291',
            attackType: 'Credential Stuffing',
            severity: 'CRITICAL',
            riskScore: 92,
            actionTaken: 'Locked',
            aiSummary: 'Auth attempts from 42 unique IPs within 3 seconds for this account. Machine pattern confirms credential stuffing attack.'
        },
        {
            id: 'CASE-8290',
            attackType: 'Impossible Travel',
            severity: 'HIGH',
            riskScore: 78,
            actionTaken: 'Flagged',
            aiSummary: 'Session origin jumped from New York to London in 14 minutes. Physically impossible movement suggests session hijacking.'
        },
        {
            id: 'CASE-8289',
            attackType: 'Brute Force',
            severity: 'HIGH',
            riskScore: 85,
            actionTaken: 'Locked',
            aiSummary: 'Detected 15 failed password attempts within 60 seconds followed by a successful login. Classic brute force signature.'
        },
        {
            id: 'CASE-8288',
            attackType: 'Large Transaction',
            severity: 'MEDIUM',
            riskScore: 54,
            actionTaken: 'Verification Sent',
            aiSummary: 'Out-of-pattern withdrawal of $45,000 from an account that historically moves <$500. Awaiting MFA confirmation.'
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Incident Log</h1>
                    <p className="text-slate-500">Security event archive with AI-driven root cause analysis</p>
                </div>

                <button className="btn-primary flex items-center gap-2">
                    <FileText size={18} />
                    Export Case Data
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Attack Type</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Severity</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Risk Score</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Action Taken</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">AI Summary (SentinelX Genesis)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {reports.map((report) => (
                                <tr key={report.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${report.severity === 'CRITICAL' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' :
                                                report.severity === 'HIGH' ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'bg-cyber-primary shadow-[0_0_8px_#10b981]'
                                                }`} />
                                            <span className="font-bold text-sm tracking-tight">{report.attackType}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-[0.2em] ${report.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                                            report.severity === 'HIGH' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' : 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20'
                                            }`}>
                                            {report.severity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="font-mono font-bold text-slate-300">{report.riskScore}</span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full">
                                            <Activity size={12} className="text-cyber-primary" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{report.actionTaken}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="p-3 rounded-xl bg-cyber-primary/5 border border-cyber-primary/10 group-hover:bg-cyber-primary/10 transition-colors">
                                            <p className="text-xs text-slate-400 leading-relaxed italic">
                                                "{report.aiSummary}"
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default IncidentReports;
