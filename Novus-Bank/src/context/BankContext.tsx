import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Account {
  id: string;
  type: 'checking' | 'savings' | 'investment';
  name: string;
  balance: number;
  accountNumber: string;
}

export interface Card {
  id: string;
  type: 'debit' | 'credit';
  provider: 'visa' | 'mastercard';
  last4: string;
  status: 'active' | 'blocked';
  limit?: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  category: 'food' | 'shopping' | 'transfer' | 'salary' | 'utilities' | 'entertainment';
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending';
}

export interface User {
  id: string;
  email: string;
  name: string;
  accounts: Account[];
  cards: Card[];
  totalBalance: number;
  pin: string;
  baseline_location?: string;
  baseline_device?: string;
}

interface BankContextType {
  user: User | null;
  transactions: Transaction[];
  login: (email: string, password: string) => Promise<User | undefined>;
  loginTotp: (email: string, password: string, totpCode: string) => Promise<User | undefined>;
  setupTotp: (accountId: string) => Promise<{ secret: string, qr_code_base64: string } | null>;
  verifyTotp: (accountId: string, code: string) => Promise<boolean>;
  signup: (email: string, name: string, password: string) => Promise<User | undefined>;
  logout: () => void;
  reportEventToSentinelX: (eventType: string, details?: any) => Promise<void>;
  performTransaction: (type: Transaction['type'], amount: number, description: string, category: Transaction['category'], accountId?: string) => Promise<void>;
  updateUser: (updatedFields: Partial<User>) => void;
  isLoading: boolean;
  isLocked: boolean;
  location: string;
  setLocation: (loc: string) => void;
  device: string;
  setDevice: (dev: string) => void;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export const BankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentUserAccountId, setCurrentUserAccountId] = useState<number>(18); // ID exists in DB (1-250)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('bank_user');
      const savedTransactions = localStorage.getItem('bank_transactions');

      if (savedUser && savedUser !== 'null') {
        setUser(JSON.parse(savedUser));
      }
      if (savedTransactions && savedTransactions !== 'undefined') {
        setTransactions(JSON.parse(savedTransactions));
      }
    } catch (err) {
      console.error('Failed to load storage:', err);
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('bank_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bank_user');
    }
  }, [user]);

  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('bank_transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  // 🔥 Polling Account Status (LOCKED state)
  useEffect(() => {
    if (!user || !currentUserAccountId) return;

    const checkStatus = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/accounts/${currentUserAccountId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.account_status === 'Locked') {
            setIsLocked(true);
          } else {
            setIsLocked(false);
          }
        }
      } catch (err) {
        console.error('Failed to poll account status:', err);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [user, currentUserAccountId]);

  const [location, setLocation] = useState('Hyderabad');
  const [device, setDevice] = useState('Windows / Chrome');

  const reportEventToSentinelX = async (eventType: string, details: any = {}, overrideId?: number) => {
    const targetId = overrideId || currentUserAccountId;
    if (!targetId && eventType !== 'login_failed') return null;

    try {
      const response = await fetch('http://localhost:8000/api/events/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_id: targetId,
          event_type: eventType,
          ip_address: '192.168.1.45',
          device: device,
          location: location,
          ...details
        }),
      });
      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to report event to SentinelX:', await response.text());
        return null;
      }
    } catch (err) {
      console.error('Connection error reporting to SentinelX:', err);
      return null;
    }
  };

  const _handleSuccessfulLogin = async (backendUser: any) => {
    setCurrentUserAccountId(backendUser.id);
    
    // Report success to SentinelX
    await reportEventToSentinelX('login_success', {}, backendUser.id);

    const accounts: Account[] = [
      { 
        id: '1', 
        type: 'checking', 
        name: 'Primary Checking', 
        balance: 24500.00, 
        accountNumber: backendUser.account_number 
      }
    ];

    const cards: Card[] = [
      { id: 'c1', type: 'debit', provider: 'visa', last4: backendUser.account_number.slice(-4), status: 'active' }
    ];

    const newUser: User = {
      id: String(backendUser.id),
      email: backendUser.email,
      name: backendUser.name,
      accounts,
      cards,
      totalBalance: 24500.00,
      pin: '1234',
      baseline_location: backendUser.baseline_location,
      baseline_device: backendUser.baseline_device
    };

    setTransactions([
      { id: 't1', type: 'deposit', category: 'salary', amount: 24500, date: new Date().toISOString(), description: 'Opening Balance', status: 'completed' }
    ]);
    
    setUser(newUser);
    return newUser;
  };

  const login = async (email: string, pass: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/accounts/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password: pass,
          device: device,
          location: location
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Handle TOTP Challenge
      if (data.status === 'totp_required') {
        throw new Error('TOTP_REQUIRED');
      }

      // Handle Basic MFA Challenge (Mock Mailbox)
      if (data.status === 'mfa_required') {
        throw new Error(data.message || 'MFA Required');
      }

      if (data.status === 'success') {
        return await _handleSuccessfulLogin(data.user);
      }
    } catch (err: any) {
      console.error('[Bank] Login Error:', err);
      throw err;
    }
  };

  const loginTotp = async (email: string, pass: string, totpCode: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/accounts/login/totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password: pass,
          totp_code: totpCode
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.status === 'success') {
        return await _handleSuccessfulLogin(data.user);
      }
    } catch (err: any) {
      console.error('[Bank] TOTP Login Error:', err);
      throw err;
    }
  };

  const setupTotp = async (accountId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/accounts/${accountId}/totp/setup`, {
        method: 'POST'
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error);
      return data;
    } catch (err) {
      console.error("Failed to setup TOTP", err);
      return null;
    }
  };

  const verifyTotp = async (accountId: string, code: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/accounts/${accountId}/totp/enable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error);
      return true;
    } catch (err) {
      console.error("Failed to verify TOTP", err);
      return false;
    }
  };

  const signup = async (email: string, name: string, password: string) => {
    try {
      const accountNumber = `ACC-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const response = await fetch('http://localhost:8000/api/accounts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_number: accountNumber,
          holder_name: name,
          email: email,
          password: password,
          baseline_avg_transaction: 50.0,
          baseline_primary_device: device,
          baseline_primary_location: location,
          baseline_login_start_hour: 8,
          baseline_login_end_hour: 22
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Registration failed');
      }

      const backendAccount = await response.json();
      setCurrentUserAccountId(backendAccount.id);

      // Report to SentinelX
      await reportEventToSentinelX('registration_success', {}, backendAccount.id);

      const accounts: Account[] = [
        { 
          id: '1', 
          type: 'checking', 
          name: 'Primary Checking', 
          balance: 24500.00, 
          accountNumber: backendAccount.account_number 
        }
      ];

      const cards: Card[] = [
        { id: 'c1', type: 'debit', provider: 'visa', last4: backendAccount.account_number.slice(-4), status: 'active' }
      ];

      const newUser: User = {
        id: String(backendAccount.id),
        email: backendAccount.email,
        name: backendAccount.holder_name,
        accounts,
        cards,
        totalBalance: 24500.00,
        pin: '1234'
      };

      setTransactions([
        { id: 't1', type: 'deposit', category: 'salary', amount: 24500, date: new Date().toISOString(), description: 'Opening Balance', status: 'completed' }
      ]);
      
      setUser(newUser);
      return newUser;
    } catch (err: any) {
      console.error('[Bank] Signup Error:', err);
      throw err;
    }
  };

  const logout = () => {
    reportEventToSentinelX('logout');
    setUser(null);
    setTransactions([]);
    localStorage.removeItem('bank_user');
    localStorage.removeItem('bank_transactions');
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updatedFields });
  };

  const performTransaction = async (
    type: Transaction['type'],
    amount: number,
    description: string,
    category: Transaction['category'],
    accountId?: string
  ) => {
    if (!user) return;

    setIsLoading(true);

    // Check with SentinelX before finalizing
    const sentinelResponse = await reportEventToSentinelX('transaction', {
      transaction_amount: amount,
      description: description
    });

    if (sentinelResponse && sentinelResponse.account_status === 'Locked') {
      setIsLoading(false);
      throw new Error('Transaction denied: Account locked for security review.');
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    const targetAccountId = accountId || user.accounts[0].id;
    const account = user.accounts.find(acc => acc.id === targetAccountId);

    if ((type === 'withdrawal' || type === 'transfer') && account && account.balance < amount) {
      setIsLoading(false);
      throw new Error('Insufficient funds in the selected account');
    }

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      category,
      amount,
      date: new Date().toISOString(),
      description,
      status: 'completed'
    };

    const newAccounts = user.accounts.map(acc => {
      if (acc.id === targetAccountId) {
        return {
          ...acc,
          balance: type === 'deposit' ? acc.balance + amount : acc.balance - amount
        };
      }
      return acc;
    });

    const newTotalBalance = newAccounts.reduce((sum, acc) => sum + acc.balance, 0);

    const updatedUser = {
      ...user,
      totalBalance: newTotalBalance,
      accounts: newAccounts
    };

    setUser(updatedUser);
    setTransactions(prev => [newTransaction, ...prev]);

    setIsLoading(false);
  };

  return (
    <BankContext.Provider value={{
      user,
      transactions,
      login,
      signup,
      logout,
      reportEventToSentinelX,
      performTransaction,
      updateUser,
      isLoading,
      isLocked,
      location,
      setLocation,
      device,
      setDevice,
      loginTotp,
      setupTotp,
      verifyTotp
    }}>
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
};
