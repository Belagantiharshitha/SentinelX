import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type UserSession, type SuspiciousAlert } from '../utils/riskEngine';
import { toast } from 'react-hot-toast';

const API_BASE_URL = "http://localhost:8000/api";

interface SOCContextType {
    sessions: UserSession[];
    alerts: SuspiciousAlert[];
    isAttackMode: boolean;
    systemStatus: 'Live' | 'Under Attack' | 'Maintenance';
    dashboardData: any;
    setAttackMode: (val: boolean) => void;
    triggerSimulation: (type: string, targetId?: string) => Promise<void>;
    resolveAlert: (id: string) => void;
    lockdownAccount: (id: string) => Promise<void>;
    refreshData: () => void;
}

const SOCContext = createContext<SOCContextType | undefined>(undefined);

export const SOCProvider = ({ children }: { children: ReactNode }) => {
    const [sessions, setSessions] = useState<UserSession[]>([]);
    const [alerts, setAlerts] = useState<SuspiciousAlert[]>([]);
    const [isAttackMode, setIsAttackMode] = useState(false);
    const [systemStatus, setSystemStatus] = useState<'Live' | 'Under Attack' | 'Maintenance'>('Live');
    const [seenAlertIds, setSeenAlertIds] = useState<Set<string>>(new Set());
    const [dismissedAlertIds, setDismissedAlertIds] = useState<Set<string>>(new Set());
    const [dashboardData, setDashboardData] = useState<any>(null);

    const fetchData = async () => {
        try {
            console.log("[SOCContext] Fetching from:", API_BASE_URL);
            const [accountsRes, incidentsRes, dashboardRes] = await Promise.all([
                fetch(`${API_BASE_URL}/accounts/`),
                fetch(`${API_BASE_URL}/incidents/`),
                fetch(`${API_BASE_URL}/dashboard/overview`)
            ]);

            if (dashboardRes.ok) {
                const dData = await dashboardRes.json();
                setDashboardData(dData);
                // System Status logic: if we have open high/critical incidents, we are under attack
                if (dData.recent_incidents && dData.recent_incidents.some((inc: any) => inc.severity === 'Critical' || inc.severity === 'High')) {
                    setIsAttackMode(true);
                } else {
                    setIsAttackMode(false);
                }
            }

            if (accountsRes.ok) {
                const accountsDataRaw = await accountsRes.json();
                console.log("[SOCContext] Accounts Raw:", accountsDataRaw);
                const accountsData = Array.isArray(accountsDataRaw) ? accountsDataRaw : (accountsDataRaw.value || []);

                const mappedSessions: UserSession[] = accountsData.map((acc: any) => {
                    const rawLevel = (acc.risk_level || 'Safe').toUpperCase();
                    const riskLevel = rawLevel === 'SAFE' ? 'LOW' : rawLevel as any;

                    return {
                        id: String(acc.id),
                        holderName: acc.holder_name || 'Generic User',
                        accountNumber: acc.account_number,
                        bank: 'SentinelX Internal',
                        riskScore: acc.risk_score || 0,
                        riskLevel: riskLevel,
                        status: (acc.account_status || 'active').toLowerCase() === 'active' ? 'Active' : 'Locked',
                        lastEvent: 'System Baseline',
                        device: acc.baseline_primary_device || 'Unknown',
                        location: acc.baseline_primary_location || 'Unknown',
                        lastActivity: acc.updated_at
                    };
                });
                console.log("[SOCContext] Mapped Sessions:", mappedSessions);
                setSessions(mappedSessions);
            }

            if (incidentsRes.ok) {
                const incidentsDataRaw = await incidentsRes.json();
                console.log("[SOCContext] Incidents Raw:", incidentsDataRaw);
                const incidentsData = Array.isArray(incidentsDataRaw) ? incidentsDataRaw : (incidentsDataRaw.value || []);

                const mappedAlerts: SuspiciousAlert[] = incidentsData.map((inc: any) => ({
                    id: String(inc.id),
                    timestamp: inc.created_at,
                    severity: (inc.severity || 'high').toUpperCase() as any,
                    type: inc.attack_type,
                    message: inc.ai_summary || `Automated response: ${inc.action_taken}`,
                    holderName: inc.account?.holder_name,
                    accountNumber: inc.account?.account_number
                }));

                // Trigger toasts for NEW alerts
                mappedAlerts.forEach(alert => {
                    // Only toast High or Critical to reduce noise
                    if (!seenAlertIds.has(alert.id) && (alert.severity === 'HIGH' || alert.severity === 'CRITICAL')) {
                        toast(alert.message, {
                            icon: '🚨',
                            duration: 5000,
                            id: alert.id // Prevent duplicates
                        });
                        setSeenAlertIds(prev => new Set(prev).add(alert.id));
                    }
                });

                console.log("[SOCContext] Mapped Alerts:", mappedAlerts);
                // Filter out dismissed alerts before setting the state
                setAlerts(mappedAlerts.filter(a => !dismissedAlertIds.has(a.id)));
            }
        } catch (error) {
            console.error("[SOCContext] Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [seenAlertIds, dismissedAlertIds]);

    useEffect(() => {
        setSystemStatus(isAttackMode ? 'Under Attack' : 'Live');
    }, [isAttackMode]);

    const triggerSimulation = async (type: string, targetId?: string) => {
        if (sessions.length === 0) {
            console.error("No accounts available for simulation");
            toast.error("No accounts available for simulation");
            return;
        }

        const accountId = targetId || sessions[0].id;
        let endpoint = "";

        const typeLower = type.toLowerCase();
        if (typeLower.includes("credential")) endpoint = "credential-stuffing";
        else if (typeLower.includes("brute")) endpoint = "brute-force";
        else if (typeLower.includes("takeover")) endpoint = "account-takeover";
        else if (typeLower.includes("travel")) endpoint = "impossible-travel";
        else if (typeLower.includes("transaction")) endpoint = "transaction-anomaly";
        else if (typeLower.includes("corruption")) endpoint = "bank-corruption";
        else if (typeLower.includes("sql")) endpoint = "sql-injection"; // generic or default endpoint later
        else endpoint = "brute-force"; // Default fallback if not matched exactly to keep UI alive

        if (!endpoint) return;

        toast.loading(`Triggering ${type}...`, { id: 'sim-loading', duration: 2000 });

        try {
            const res = await fetch(`${API_BASE_URL}/simulate/${endpoint}?account_id=${accountId}`, {
                method: 'POST'
            });
            if (res.ok) {
                const result = await res.json();
                toast.success(`${type} initiated!`, { id: 'sim-loading' });
                fetchData();
                return result;
            } else {
                toast.error(`Failed to trigger ${type}`, { id: 'sim-loading' });
            }
        } catch (error) {
            toast.error("Network error triggering simulation", { id: 'sim-loading' });
        }
    };

    const lockdownAccount = async (id: string) => {
        toast.loading("Initiating emergency lockdown...", { id: 'lockdown-loading' });
        try {
            const res = await fetch(`${API_BASE_URL}/accounts/${id}/lockdown`, {
                method: 'POST'
            });
            if (res.ok) {
                toast.success("Account locked successfully", { id: 'lockdown-loading' });
                fetchData();
            } else {
                toast.error("Failed to lock account", { id: 'lockdown-loading' });
            }
        } catch (error) {
            toast.error("Network error during lockdown", { id: 'lockdown-loading' });
        }
    };

    const resolveAlert = (id: string) => {
        // Dismiss in local UI to prevent reappearance
        setDismissedAlertIds(prev => new Set(prev).add(id));
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    };

    return (
        <SOCContext.Provider
            value={{
                sessions,
                alerts,
                isAttackMode,
                systemStatus,
                dashboardData,
                setAttackMode: setIsAttackMode,
                triggerSimulation,
                resolveAlert,
                lockdownAccount,
                refreshData: fetchData
            }}
        >
            {children}
        </SOCContext.Provider>
    );
};

export const useSOC = () => {
    const context = useContext(SOCContext);
    if (!context) throw new Error('useSOC must be used within a SOCProvider');
    return context;
};
