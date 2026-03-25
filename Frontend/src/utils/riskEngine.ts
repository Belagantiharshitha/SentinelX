export interface UserSession {
    id: string;
    holderName: string;
    accountNumber: string;
    bank: string;
    riskScore: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'Active' | 'Locked' | 'Monitoring' | 'Verification Required';
    lastEvent: string;
    device: string;
    location: string;
    lastActivity: string;
}

export interface SuspiciousAlert {
    id: string;
    timestamp: string;
    severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
    type: string;
    message: string;
    holderName?: string;
    accountNumber?: string;
    accountId?: string;
    mlFraudScore?: number;
    mlExplanation?: string;
}

export const getRiskLevel = (score: number): UserSession['riskLevel'] => {
    if (score >= 80) return 'CRITICAL';
    if (score >= 50) return 'HIGH';
    if (score >= 20) return 'MEDIUM';
    return 'LOW';
};

export const generateMockSessions = (count: number): UserSession[] => {
    const banks = ['Global Trust', 'Apex Bank', 'Horizon Financial', 'Evergreen Credit'];
    const statuses: ('Active' | 'Locked' | 'Monitoring' | 'Verification Required')[] = ['Active', 'Locked', 'Monitoring', 'Verification Required'];
    const events = ['Deposit', 'Withdrawal', 'Login', 'Transfer', 'KYC Update'];
    const devices = ['iPhone 15 Pro', 'MacBook Pro M2', 'Windows Desktop', 'Android Galaxy S24'];
    const locations = ['New York, US', 'London, UK', 'Berlin, DE', 'Singapore, SG', 'Tokyo, JP'];

    return Array.from({ length: count }, (_, i) => {
        const score = Math.floor(Math.random() * 40); // Default low risk
        return {
            id: `session-${i + 1000}`,
            holderName: `User ${i + 1}`,
            accountNumber: `ACC-${Math.floor(10000000 + Math.random() * 90000000)}`,
            bank: banks[Math.floor(Math.random() * banks.length)],
            riskScore: score,
            riskLevel: getRiskLevel(score),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            lastEvent: events[Math.floor(Math.random() * events.length)],
            device: devices[Math.floor(Math.random() * devices.length)],
            location: locations[Math.floor(Math.random() * locations.length)],
            lastActivity: new Date().toISOString(),
        };
    });
};

export const calculateDynamicRisk = (current: number, attackMode: boolean) => {
    const volatility = attackMode ? 15 : 2;
    const trend = attackMode ? 5 : -1;
    const newScore = current + trend + (Math.random() * volatility * 2 - volatility);
    return Math.min(100, Math.max(0, Math.round(newScore)));
};
