import { useSOC } from '../context/SOCContext';
import { motion } from 'framer-motion';
import {
    Key,
    Flame,
    Globe,
    ShieldX,
    Database,
    Binary,
    Wifi,
    Bug,
    ShieldOff,
    Lock,
    Zap,
    Skull,
    Mail,
    Bomb,
    Network,
    Fingerprint,
    Cloud,
    Code,
    MessageSquare,
    Ghost,
    Magnet,
    Server,
    Bot,
    Eye,
    UserPlus,
    ArrowRightLeft
} from 'lucide-react';

const Simulation = () => {
    const { triggerSimulation } = useSOC();

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
            id: 'sql_inject',
            label: 'SQL Injection',
            icon: Database,
            color: 'violet',
            desc: 'Attempt to bypass authentication and dump table data via malicious query strings.'
        },
        {
            id: 'xss_payload',
            label: 'Cross-Site Scripting',
            icon: Bug,
            color: 'cyan',
            desc: 'Injecting malicious JavaScript logic into the bank frontend to steal session cookies.'
        },
        {
            id: 'ddos_cluster',
            label: 'DDoS Traffic Cluster',
            icon: Wifi,
            color: 'indigo',
            desc: 'Flood the API gateway with high-volume junk traffic to simulate service denial.'
        },
        {
            id: 'priv_esc',
            label: 'Privilege Escalation',
            icon: ShieldOff,
            color: 'amber',
            desc: 'Simulate a user account attempting to gain administrative super-user rights.'
        },
        {
            id: 'ransomware',
            label: 'Ransomware Flow',
            icon: Lock,
            color: 'rose',
            desc: 'Simulate encrypted file propagation and high-disk-I/O anomalies in the server core.'
        },
        {
            id: 'mitm_sniff',
            label: 'MITM Packet Sniffing',
            icon: Binary,
            color: 'emerald',
            desc: 'Intercept data packets between the user terminal and the secure bank node.'
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
            id: 'bc',
            label: 'Internal Data Corruption',
            icon: ShieldX,
            color: 'rose',
            desc: 'Simulate direct manipulation of account balances by unauthorized background workers.'
        },
        {
            id: 'phishing',
            label: 'Advanced Phishing Campaign',
            icon: Mail,
            color: 'yellow',
            desc: 'Simulate targeted email attacks to trick users into revealing sensitive information.'
        },
        {
            id: 'zero_day',
            label: 'Zero-Day Exploit',
            icon: Bomb,
            color: 'red',
            desc: 'Deploy a hypothetical unknown vulnerability to bypass security controls.'
        },
        {
            id: 'supply_chain',
            label: 'Supply Chain Attack',
            icon: Network,
            color: 'teal',
            desc: 'Compromise third-party software or services to gain access to the main system.'
        },
        {
            id: 'insider_threat',
            label: 'Insider Threat Simulation',
            icon: Fingerprint,
            color: 'gray',
            desc: 'Model malicious activities by an authorized user with privileged access.'
        },
        {
            id: 'cloud_misconfig',
            label: 'Cloud Misconfiguration',
            icon: Cloud,
            color: 'sky',
            desc: 'Exploit improperly configured cloud resources to access sensitive data.'
        },
        {
            id: 'api_abuse',
            label: 'API Abuse & Fuzzing',
            icon: Code,
            color: 'pink',
            desc: 'Automated testing of API endpoints for vulnerabilities and unexpected behavior.'
        },
        {
            id: 'social_eng',
            label: 'Social Engineering',
            icon: MessageSquare,
            color: 'lime',
            desc: 'Simulate psychological manipulation to trick individuals into performing actions.'
        },
        {
            id: 'rootkit',
            label: 'Rootkit Installation',
            icon: Ghost,
            color: 'purple',
            desc: 'Deploy stealthy malware to gain persistent and undetectable access to a system.'
        },
        {
            id: 'dns_spoof',
            label: 'DNS Spoofing',
            icon: Magnet,
            color: 'orange',
            desc: 'Redirect users to malicious websites by corrupting DNS resolution.'
        },
        {
            id: 'server_side_request_forgery',
            label: 'SSRF Attack',
            icon: Server,
            color: 'blue',
            desc: 'Force the server to make requests to an arbitrary domain, potentially accessing internal resources.'
        },
        {
            id: 'web_shell',
            label: 'Web Shell Deployment',
            icon: Binary,
            color: 'emerald',
            desc: 'Install a malicious script on a web server to gain remote control.'
        },
        {
            id: 'botnet_command_control',
            label: 'Botnet C2 Activity',
            icon: Bot,
            color: 'indigo',
            desc: 'Simulate communication between compromised machines and a command-and-control server.'
        },
        {
            id: 'data_exfil',
            label: 'Data Exfiltration',
            icon: Eye,
            color: 'cyan',
            desc: 'Simulate the unauthorized transfer of data from a computer or server.'
        },
    ];

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-[-0.04em] text-white italic">
                        SENTINEL<span className="text-cyber-primary">X</span> ARSENAL
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-1 ml-1">
                        <span className="text-cyber-primary">OFFENSIVE SIMULATION</span> // VULNERABILITY TESTING
                    </p>
                </div>
                <div className="px-4 py-2 bg-cyber-primary/5 border border-cyber-primary/20 rounded-xl flex items-center gap-3">
                    <Zap size={14} className="text-cyber-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyber-primary">System Ready</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {simulationActions.map((action, i) => (
                    <motion.button
                        key={action.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => triggerSimulation(action.label)}
                        className="glass-card p-6 text-left group hover:border-cyber-primary/30 transition-all active:scale-[0.98] relative overflow-hidden h-[240px] flex flex-col"
                    >
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyber-primary/5 rounded-full blur-2xl group-hover:bg-cyber-primary/10 transition-colors" />

                        <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 w-fit mb-5 text-slate-400 group-hover:text-cyber-primary group-hover:bg-cyber-primary/10 group-hover:border-cyber-primary/40 transition-all shadow-sm`}>
                            <action.icon size={24} strokeWidth={2.5} />
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-black italic mb-1 group-hover:text-white transition-colors uppercase tracking-tight">{action.label}</h3>
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

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6 flex flex-col justify-center items-center text-center opacity-40 border-dashed border-2 border-white/5 bg-transparent h-[240px]"
                >
                    <Skull size={40} className="mb-4 text-slate-700" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700 leading-tight italic">Classified Scenarios Locked</h3>
                    <p className="text-[10px] font-bold text-slate-800 mt-2">REQUIRES LEVEL 5 CLEARANCE</p>
                </motion.div>
            </div>
        </div>
    );
};

export default Simulation;
