import React, { useState, useMemo, useEffect } from 'react';
import { useBank } from '../context/BankContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Wallet,
  History,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  LogOut,
  Building2,
  User as UserIcon,
  CheckCircle2,
  Edit2,
  CreditCard,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Zap,
  Sparkles,
  Trophy,
  Globe,
  Receipt,
  BarChart2,
  Target,
  UserRound,
  PiggyBank,
  ChevronRightCircle,
  Home,
  RefreshCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

// Secondary Components
const SidebarNav: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`nav-item ${active ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px 18px', borderRadius: '14px', color: active ? 'white' : 'rgba(255,255,255,0.6)', background: active ? 'rgba(255,255,255,0.1)' : 'transparent', fontWeight: active ? 800 : 600, marginBottom: '4px', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}>
    <div style={{ color: active ? '#2EC4B6' : 'inherit' }}>{icon}</div>
    <span>{label}</span>
  </button>
);

const ProfileBox: React.FC<{ icon: React.ReactNode; label: string; val: string }> = ({ icon, label, val }) => (
  <motion.div whileHover={{ x: 5 }} style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', marginBottom: '10px' }}>
      {icon}
      <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
    </div>
    <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#101828' }}>{val}</p>
  </motion.div>
);

const PinModal: React.FC<{ isOpen: boolean; onClose: () => void; onSuccess: () => void; title: string }> = ({ isOpen, onClose, onSuccess, title }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const correctPin = '1234';

  const handleKeypad = (val: string) => {
    if (pin.length < 4) {
      const newPin = pin + val;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === correctPin) {
          onSuccess();
          setTimeout(() => setPin(''), 100);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 800);
        }
      }
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeypad(e.key);
      } else if (e.key === 'Backspace') {
        setPin(prev => prev.slice(0, -1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pin, handleKeypad]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 6000, padding: '20px' }}>
          <motion.div initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.95 }} style={{ background: 'white', padding: '40px', borderRadius: '32px', width: '100%', maxWidth: '380px', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
            <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', color: '#94a3b8' }}><X size={28} /></button>
            <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Lock size={32} color="#0353A4" />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Identity Auth</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '32px' }}>{title}</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
              {[...Array(4)].map((_, i) => (
                <motion.div key={i} animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}} style={{ width: '20px', height: '20px', borderRadius: '50%', border: '3px solid #0353A4', background: pin.length > i ? '#0353A4' : 'transparent', transition: 'all 0.2s', borderColor: error ? '#ef4444' : '#0353A4' }} />
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'X', '0', '✓'].map(key => (
                <motion.button key={key} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => key === 'X' ? setPin(pin.slice(0, -1)) : handleKeypad(key)} style={{ height: '64px', borderRadius: '16px', background: '#f8fafc', fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#101828', cursor: 'pointer', border: '1px solid #e2e8f0' }} disabled={error}>
                  {key === 'X' ? <ArrowLeft size={24} /> : key === '✓' ? <ShieldCheck size={24} color="#2EC4B6" /> : key}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DigitalBankingShowcase = () => {
  const sideItemsLeft = [
    { icon: <Globe size={18} />, title: "Easy overseas money transfer", color: "#fdf2f8", iconColor: "#db2777" },
    { icon: <Receipt size={18} />, title: "One-stop bill pay", color: "#fff1f2", iconColor: "#e11d48" },
    { icon: <BarChart2 size={18} />, title: "Accounts, Investments & more", color: "#fdf2f8", iconColor: "#db2777" }
  ];

  const sideItemsRight = [
    { icon: <Target size={18} />, title: "Track all card payments", color: "#fff1f2", iconColor: "#e11d48" },
    { icon: <UserRound size={18} />, title: "Personal Loans on-the-go", color: "#fdf2f8", iconColor: "#db2777" },
    { icon: <PiggyBank size={18} />, title: "Instant FD opening & more", color: "#fff1f2", iconColor: "#e11d48" }
  ];

  const floatingCards = [
    { title: "Send Money Abroad", top: "15%", left: "0%" },
    { title: "Bill Payments", top: "35%", left: "-15%" },
    { title: "Manage All Investments", top: "70%", left: "5%" },
    { title: "Manage Your Cards", top: "10%", right: "5%" },
    { title: "Personal Loans", top: "25%", right: "-10%" },
    { title: "Fixed Deposits", top: "55%", right: "0%" }
  ];

  return (
    <div style={{ textAlign: 'center' }}>
      <motion.h2 initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '12px' }}>
        The best of digital banking is now <span style={{ color: '#C2185B', fontStyle: 'italic' }}>open</span>
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ fontSize: '1rem', color: '#64748b', marginBottom: '64px' }}>
        Get the <span style={{ color: '#C2185B', fontWeight: 700 }}>open</span> app by Novus Bank for a superior experience – <span style={{ color: '#C2185B', fontWeight: 700, cursor: 'pointer' }}>Explore More</span>
      </motion.p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px 1fr', gap: '32px', alignItems: 'center', position: 'relative' }}>
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {sideItemsLeft.map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.2 }} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.iconColor }}>{item.icon}</div>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4b5563', maxWidth: '200px' }}>{item.title}</p>
            </motion.div>
          ))}
        </div>

        <div style={{ position: 'relative', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {floatingCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              animate={{ y: [0, -15, 0] }}
              transition={{ delay: 0.5 + idx * 0.1, y: { repeat: Infinity, duration: 3 + idx, ease: "easeInOut" } }}
              style={{
                position: 'absolute',
                padding: '12px 20px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(194, 24, 91, 0.15)',
                boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#1e293b',
                fontWeight: 800,
                fontSize: '0.85rem',
                zIndex: 3,
                whiteSpace: 'nowrap',
                ...card
              }}
            >
              <div style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg, #C2185B, #F06292)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <ChevronRightCircle size={14} />
              </div>
              {card.title}
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '48px', alignItems: 'flex-end' }}>
          {sideItemsRight.map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.2 }} style={{ display: 'flex', alignItems: 'center', gap: '16px', flexDirection: 'row-reverse' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.iconColor }}>{item.icon}</div>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4b5563', maxWidth: '200px' }}>{item.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { user, transactions, logout, performTransaction, updateUser, location, setLocation, device, setDevice, reportEventToSentinelX, setupTotp, verifyTotp } = useBank();
  const navigate = useNavigate();

  // Expose for the simulation buttons inside child components without prop drilling
  (window as any).bankUtils = { setLocation, setDevice, reportEventToSentinelX };

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);

  // PIN states
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinPurpose, setPinPurpose] = useState<'balance' | 'transaction' | null>(null);
  const [revealedAccountIds, setRevealedAccountIds] = useState<string[]>([]);
  const [checkingAccountId, setCheckingAccountId] = useState<string | null>(null);

  // Transfer States
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [selectedAcc, setSelectedAcc] = useState('');

  // Success & Processing View States
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [lastTransferDetails, setLastTransferDetails] = useState<{ amount: number, recipient: string } | null>(null);

  // Carousel State
  const [currentBanner, setCurrentBanner] = useState(0);

  // Profile States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || '');

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
    }
  }, [user]);

  // Auto-carousel
  useEffect(() => {
    if (activeTab === 'overview') {
      const timer = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % 3);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [activeTab]);

  if (!user) return null;

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t =>
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);

  const handleCheckBalance = (accountId: string) => {
    if (revealedAccountIds.includes(accountId)) {
      setRevealedAccountIds(prev => prev.filter(id => id !== accountId));
    } else {
      setCheckingAccountId(accountId);
      setPinPurpose('balance');
      setShowPinModal(true);
    }
  };

  const startTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setPinPurpose('transaction');
    setShowPinModal(true);
  };

  const finalizeTransfer = async () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    setShowPinModal(false);
    setShowTransferModal(false);
    setIsProcessing(true);

    try {
      await performTransaction('transfer', val, `Transfer to ${recipient}`, 'transfer', selectedAcc || user.accounts[0].id);

      // Artificial delay for high-end feel
      setTimeout(() => {
        setIsProcessing(false);
        setLastTransferDetails({ amount: val, recipient });
        setShowSuccessOverlay(true);
        setAmount('');
        setRecipient('');

        // Burst confetti
        confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#2EC4B6', '#FF9F1C', '#0353A4']
        });
      }, 2500);

    } catch (err: any) {
      setIsProcessing(false);
      alert(err.message);
    }
  };

  const handlePinSuccess = () => {
    if (pinPurpose === 'balance') {
      if (checkingAccountId) {
        setRevealedAccountIds(prev => [...prev, checkingAccountId]);
      }
      setShowPinModal(false);
      setCheckingAccountId(null);
    } else if (pinPurpose === 'transaction') {
      finalizeTransfer();
    }
    setPinPurpose(null);
  };

  const handleUpdateProfile = () => {
    updateUser({ name: profileName });
    setIsEditingProfile(false);
  };

  // Animation variants
  const container: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Banner data
  const banners = [
    {
      id: 0,
      title: "Wealth Frontier",
      desc: "Experience zero-limit international transfers with 5% instant cashback.",
      icon: <Sparkles size={48} />,
      bg: "linear-gradient(135deg, #0353A4 0%, #001233 100%)",
      accent: "#2EC4B6"
    },
    {
      id: 1,
      title: "Global Custody",
      desc: "Your assets are secured by SentinelX institutional-grade shield.",
      icon: <ShieldCheck size={48} />,
      bg: "linear-gradient(135deg, #2EC4B6 0%, #CBF3F0 100%)",
      color: "#001233",
      accent: "#0353A4"
    },
    {
      id: 2,
      title: "Premier Club",
      desc: "Unlock personalized wealth management and 24/7 concierge service.",
      icon: <Trophy size={48} />,
      bg: "linear-gradient(135deg, #FF9F1C 0%, #FFBF69 100%)",
      color: "#001233",
      accent: "#FFFFFF"
    }
  ];

  return (
    <div className="app-shell" style={{ overflow: 'hidden', height: '100vh' }}>
      <aside className="sidebar" style={{ height: '100vh', position: 'sticky', top: 0 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#2EC4B6', padding: '8px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(46, 196, 182, 0.2)' }}>
              <Building2 size={24} color="white" />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Novus Bank</h2>
          </div>
        </div>

        <nav style={{ flexGrow: 1, padding: '24px 12px' }}>
          <SidebarNav active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarNav active={activeTab === 'accounts'} onClick={() => setActiveTab('accounts')} icon={<Wallet size={20} />} label="My Accounts" />
          <SidebarNav active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} icon={<History size={20} />} label="Transactions" />
          <SidebarNav active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<UserIcon size={20} />} label="Profile" />
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={logout} className="nav-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderRadius: '14px', color: '#fda4af', border: 'none', background: 'rgba(244, 63, 94, 0.05)', fontWeight: 700 }}>
            <LogOut size={20} />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-view">
        <header style={{ height: '80px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', flexShrink: 0, position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '14px', padding: '10px 20px', width: '400px', border: '1px solid #e2e8f0' }}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search assets or transfers..."
              style={{ background: 'none', border: 'none', marginLeft: '12px', outline: 'none', color: '#101828', width: '100%', fontSize: '0.95rem', fontWeight: 600 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#94a3b8' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div 
              onClick={() => setActiveTab('profile')}
              style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingRight: '24px', borderRight: '1px solid #f1f5f9', cursor: 'pointer' }}
            >
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1rem', fontWeight: 900, color: '#101828' }}>{user.name}</p>
                <p style={{ fontSize: '0.75rem', color: '#2EC4B6', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                  <span style={{ width: '6px', height: '6px', background: '#2EC4B6', borderRadius: '50%' }}></span> Verified
                </p>
              </div>
              <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #0353A4, #2EC4B6)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '1.2rem' }}>
                {user.name.charAt(0)}
              </div>
            </div>

            <button
              onClick={logout}
              className="btn btn-outline"
              style={{ color: '#ef4444', borderColor: '#fee2e2', background: '#fff1f2', borderRadius: '12px', padding: '10px 16px', fontSize: '0.9rem', fontWeight: 800 }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="ov" variants={container} initial="hidden" animate="show" exit="hidden">
                {/* Hero Carousel Banner */}
                <motion.div variants={item} style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.1)' }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentBanner}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      style={{ position: 'absolute', inset: 0, background: banners[currentBanner].bg, color: banners[currentBanner].color || 'white', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div style={{ maxWidth: '65%' }}>
                        <motion.h2 initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>{banners[currentBanner].title}</motion.h2>
                        <motion.p initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ fontSize: '1rem', opacity: 0.9 }}>{banners[currentBanner].desc}</motion.p>
                        <motion.button initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} className="btn" style={{ marginTop: '20px', background: banners[currentBanner].color ? '#0353A4' : 'white', color: banners[currentBanner].color || '#0353A4', padding: '8px 20px', fontWeight: 700, fontSize: '0.85rem' }}>Explore More</motion.button>
                      </div>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ marginRight: '20px' }}>
                        {banners[currentBanner].icon}
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>

                  <div style={{ position: 'absolute', bottom: '16px', left: '32px', display: 'flex', gap: '6px' }}>
                    {banners.map((_, i) => (
                      <div key={i} onClick={() => setCurrentBanner(i)} style={{ width: currentBanner === i ? '24px' : '8px', height: '8px', borderRadius: '4px', background: 'white', opacity: currentBanner === i ? 1 : 0.4, cursor: 'pointer', transition: 'all 0.3s' }} />
                    ))}
                  </div>
                </motion.div>

                {/* Loan Offer Banner (Replaces Net Worth) */}
                <motion.div
                  variants={item}
                  whileHover={{ scale: 1.01, translateY: -2 }}
                  style={{ marginBottom: '32px', background: 'linear-gradient(135deg, #0353A4 0%, #001233 100%)', color: 'white', padding: '32px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 20px 40px rgba(3, 83, 164, 0.15)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, #2EC4B6 0%, transparent 70%)', opacity: 0.2, filter: 'blur(40px)' }}></div>
                  <div style={{ zIndex: 1 }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                      Elevate Your <span style={{ color: '#2EC4B6' }}>Empire.</span>
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.7)' }}>
                      <p style={{ fontWeight: 700, fontSize: '1.05rem' }}>Bespoke Credit Lines up to ₹10,00,000</p>
                      <Sparkles size={18} color="#FF9F1C" />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', zIndex: 1 }}>
                    <button className="btn" style={{ background: '#2EC4B6', color: '#001233', padding: '12px 28px', borderRadius: '14px', fontWeight: 900, fontSize: '0.95rem', boxShadow: '0 8px 20px rgba(46, 196, 182, 0.3)' }}>Apply Instant</button>
                  </div>
                </motion.div>

                {/* New Promotional Banners (Replaces Quick Pay) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr', gap: '32px', marginBottom: '48px' }}>
                  {/* Left: Apply Now Icons */}
                  <motion.div variants={item} style={{ background: 'white', borderRadius: '32px', padding: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#101828', letterSpacing: '-0.01em' }}>Premium Services</h3>
                      <button style={{ color: '#0353A4', fontWeight: 800, fontSize: '0.85rem' }}>View All Accounts</button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                      {[
                        { icon: <Wallet size={26} color="#0353A4" />, label: "Global Savings", bg: '#EBF2FA' },
                        { icon: <CreditCard size={26} color="#2EC4B6" />, label: "Infinite Card", bg: '#EAF9F8' },
                        { icon: <UserRound size={26} color="#FF9F1C" />, label: "Wealth Mgmt", bg: '#FFF6E9' },
                        { icon: <Home size={26} color="#C2185B" />, label: "Estate Loan", bg: '#FCEEF5' }
                      ].map((service, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ y: -5, scale: 1.02 }}
                          onClick={() => setShowTransferModal(true)}
                          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', flex: 1, background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <div style={{ width: '64px', height: '64px', background: service.bg, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                            {service.icon}
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475467', textAlign: 'center', width: '60px' }}>{service.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Right: Cashback Banner */}
                  <motion.div variants={item} style={{ background: 'linear-gradient(135deg, #2EC4B6 0%, #0353A4 100%)', borderRadius: '32px', padding: '32px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', color: 'white' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}><Zap size={140} color="white" /></div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px', zIndex: 1, letterSpacing: '-0.01em' }}>
                      25% Instant <br /><span style={{ color: '#CBF3F0' }}>Cashback</span>
                    </h3>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8, fontWeight: 600, zIndex: 1, marginBottom: '16px' }}>On all grocery & fuel spends this month.</p>
                    <button style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontWeight: 800, padding: '8px 16px', borderRadius: '12px', width: 'fit-content', fontSize: '0.8rem', zIndex: 1 }}>Claim Offer</button>
                  </motion.div>
                </div>

                <div style={{ background: 'white', borderRadius: '32px', padding: '48px 32px', boxShadow: '0 20px 40px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
                  <DigitalBankingShowcase />
                </div>
              </motion.div>
            )}

            {
              activeTab !== 'overview' && (
                <motion.div key={activeTab} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                  {activeTab === 'accounts' && <AccountsView user={user} revealedAccountIds={revealedAccountIds} onSend={() => setShowTransferModal(true)} onCheckBalance={handleCheckBalance} />}
                  {activeTab === 'transactions' && <TransactionsView transactions={filteredTransactions} />}
                  {activeTab === 'profile' && <ProfileView user={user} isEditing={isEditingProfile} setIsEditing={setIsEditingProfile} profileName={profileName} setProfileName={setProfileName} location={location} setLocation={setLocation} device={device} setDevice={setDevice} onSave={handleUpdateProfile} setupTotp={setupTotp} verifyTotp={verifyTotp} />}
                </motion.div>
              )
            }
          </AnimatePresence >
        </div >
      </main >

      {/* PIN Modal */}
      < PinModal isOpen={showPinModal} onClose={() => { setShowPinModal(false); setPinPurpose(null); }} onSuccess={handlePinSuccess} title={pinPurpose === 'balance' ? 'Enter PIN for Balance' : 'Enter PIN for Secure Pay'} />

      {/* Transfer Modal */}
      <AnimatePresence>
        {showTransferModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '440px', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Secure Payment</h3>
                <button onClick={() => setShowTransferModal(false)} className="btn btn-outline" style={{ padding: '6px', borderRadius: '50%' }}><X size={20} /></button>
              </div>
              <form onSubmit={startTransaction}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '6px', color: '#94a3b8', letterSpacing: '0.1em' }}>SOURCE ACCOUNT</label>
                  <select className="form-input" value={selectedAcc} onChange={(e) => setSelectedAcc(e.target.value)} style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {user.accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} (₹{acc.balance.toLocaleString()})</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '6px', color: '#94a3b8', letterSpacing: '0.1em' }}>RECIPIENT INFO</label>
                  <input type="text" className="form-input" value={recipient} onChange={e => setRecipient(e.target.value)} required placeholder="Name or Account ID" style={{ fontWeight: 700, fontSize: '0.95rem' }} />
                </div>
                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '6px', color: '#94a3b8', letterSpacing: '0.1em' }}>AMOUNT (INR)</label>
                  <input type="number" className="form-input" style={{ fontSize: '2rem', fontWeight: 900, textAlign: 'center', color: '#0353A4', border: 'none', borderBottom: '2px solid #f1f5f9', borderRadius: 0 }} value={amount} onChange={e => setAmount(e.target.value)} required placeholder="0" />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', borderRadius: '12px', fontWeight: 800 }}>Authorize Payment</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full-Screen Processing Screen */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: '#0353A4', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              style={{ width: '80px', height: '80px', border: '6px solid rgba(255,255,255,0.05)', borderTopColor: '#2EC4B6', borderRadius: '50%', marginBottom: '32px' }}
            />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Verifying Credentials...</h2>
            <p style={{ marginTop: '12px', opacity: 0.6, fontSize: '1rem', letterSpacing: '0.15em' }}>SECURING BANKING TUNNEL</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessOverlay && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,1)', zIndex: 5000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
              style={{ width: '120px', height: '120px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4, type: 'spring' }}
              >
                <CheckCircle2 size={80} color="#10b981" />
              </motion.div>
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ fontSize: '2.25rem', color: '#101828', marginBottom: '8px', fontWeight: 900 }}
            >
              Payment Successful!
            </motion.h2>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
              style={{ textAlign: 'center', marginBottom: '40px' }}
            >
              <p style={{ color: '#0353A4', fontSize: '1.5rem', fontWeight: 900 }}>₹{lastTransferDetails?.amount.toLocaleString('en-IN')}</p>
              <p style={{ color: '#94a3b8', marginTop: '6px', fontSize: '1rem', fontWeight: 600 }}>Recipient: {lastTransferDetails?.recipient}</p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{ background: '#f8fafc', padding: '24px 32px', borderRadius: '20px', border: '1px solid #e2e8f0', minWidth: '320px', boxShadow: 'var(--shadow-sm)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#64748b', fontWeight: 800, fontSize: '0.8rem' }}>REF NUMBER</span>
                <span style={{ fontWeight: 900, color: '#101828', fontSize: '0.9rem' }}>#TXN{Math.floor(Math.random() * 8999999) + 1000000}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: 800, fontSize: '0.8rem' }}>STATUS</span>
                <span style={{ fontWeight: 900, color: '#10b981', fontSize: '0.9rem' }}>SETTLED</span>
              </div>
            </motion.div>

            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="btn btn-primary" style={{ marginTop: '40px', padding: '14px 60px', fontSize: '1.1rem', borderRadius: '16px', fontWeight: 800 }} onClick={() => setShowSuccessOverlay(false)}
            >
              Back to Home
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
};

// Refined Accounts View
const AccountsView = ({ user, revealedAccountIds, onSend, onCheckBalance }: any) => (
  <div className="tab-pane">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Account Assets</h2>
      <button className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '0.9rem' }} onClick={onSend}><Plus size={18} /> New Account</button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
      {user.accounts.map((acc: any) => {
        const isRevealed = revealedAccountIds.includes(acc.id);
        return (
          <motion.div key={acc.id} whileHover={{ y: -5 }} style={{ background: 'white', padding: '32px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '14px', color: '#0353A4' }}>
                <Wallet size={32} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#101828' }}>{acc.name}</h3>
                <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1rem' }}>{acc.accountNumber}</p>
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>LEDGER BALANCE</p>
            <h2 style={{ fontSize: '2.5rem', margin: '12px 0', color: '#101828', fontWeight: 800 }}>
              {isRevealed ? `₹${acc.balance.toLocaleString('en-IN')}` : '••••••••'}
            </h2>
            <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary" style={{ flex: 1, padding: '12px', fontSize: '0.95rem', borderRadius: '12px' }} onClick={onSend}>Send</button>
              <button className="btn btn-outline" style={{ flex: 1, padding: '12px', fontSize: '0.95rem', color: '#0353A4', borderColor: '#0353A4', borderRadius: '12px' }} onClick={() => onCheckBalance(acc.id)}>
                {isRevealed ? <EyeOff size={18} /> : <Eye size={18} />} Check
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);

const TransactionsView = ({ transactions }: any) => (
  <div className="tab-pane">
    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '24px' }}>Archive</h2>
    <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr style={{ height: '60px', background: '#f8fafc' }}>
              <th style={{ paddingLeft: '24px' }}>TYPE</th>
              <th>DESCRIPTION</th>
              <th>DATE</th>
              <th>CATEGORY</th>
              <th style={{ textAlign: 'right', paddingRight: '24px' }}>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t: any, idx: number) => (
              <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }} style={{ height: '72px' }}>
                <td style={{ paddingLeft: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.type === 'deposit' ? '#ecfdf5' : '#fef2f2', color: t.type === 'deposit' ? '#10b981' : '#ef4444' }}>
                    {t.type === 'deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                </td>
                <td><p style={{ fontWeight: 800, fontSize: '1rem', color: '#101828' }}>{t.description}</p></td>
                <td style={{ color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>{new Date(t.date).toLocaleDateString()}</td>
                <td><span style={{ textTransform: 'uppercase', fontSize: '0.75rem', background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', color: '#475467', fontWeight: 800 }}>{t.category}</span></td>
                <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '1.1rem', color: t.type === 'deposit' ? '#10b981' : '#101828', paddingRight: '24px' }}>
                  {t.type === 'deposit' ? '+' : '-'} ₹{t.amount.toLocaleString('en-IN')}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const ProfileView = ({ user, isEditing, setIsEditing, profileName, setProfileName, location, setLocation, device, setDevice, onSave, setupTotp, verifyTotp }: any) => {
  const [totpSetupData, setTotpSetupData] = useState<{secret: string, qr_code_base64: string} | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [totpError, setTotpError] = useState('');
  const [totpSuccess, setTotpSuccess] = useState('');
  const navigate = useNavigate();
  
  const handleSetupTotp = async () => {
    setTotpError('');
    const data = await setupTotp(user.id);
    if (data) {
      setTotpSetupData(data);
    } else {
      setTotpError('Failed to initialize matching sequence.');
    }
  };

  const handleVerifyTotp = async () => {
    setTotpError('');
    setTotpSuccess('');
    const success = await verifyTotp(user.id, verifyCode);
    if (success) {
      setTotpSuccess('Authenticator App successfully linked!');
      setTotpSetupData(null);
    } else {
      setTotpError('Invalid code. Please try again.');
    }
  };

  return (
  <div className="tab-pane">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Profile Core</h2>
      {!isEditing && <button className="btn btn-outline" style={{ borderRadius: '12px', padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => setIsEditing(true)}><Edit2 size={16} /> Edit Info</button>}
    </div>
    <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '48px' }}>
        <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'linear-gradient(135deg, #0353A4, #2EC4B6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.8rem', fontWeight: 900, boxShadow: 'var(--shadow-md)', border: '4px solid white' }}>{profileName.charAt(0)}</div>
        <div style={{ flex: 1 }}>
          {isEditing ? (
            <input type="text" className="form-input" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px', border: 'none', borderBottom: '3px solid #0353A4', borderRadius: 0, paddingLeft: 0, height: '70px', width: '100%' }} value={profileName} onChange={e => setProfileName(e.target.value)} />
          ) : (
            <h3 style={{ fontSize: '2.75rem', fontWeight: 900, color: '#101828', letterSpacing: '-0.02em', marginBottom: '4px' }}>{user.name}</h3>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2EC4B6' }}>
            <Sparkles size={20} />
            <p style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Diamond Premier Member</p>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        <ProfileBox icon={<Mail size={22} color="#0353A4" />} label="Official Contact" val={user.email} />
        <ProfileBox icon={<CreditCard size={22} color="#0353A4" />} label="Primary Account" val={user.accounts[0]?.accountNumber || 'N/A'} />
        <ProfileBox icon={<Building2 size={22} color="#0353A4" />} label="Home Branch" val="Novus Global HQ" />
        <ProfileBox icon={<History size={22} color="#0353A4" />} label="Member Since" val="2021" />
      </div>

      <div style={{ marginTop: '48px', borderTop: '1px solid #f1f5f9', paddingTop: '32px' }}>
        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', color: '#0353A4' }}>Session Context</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', marginBottom: '10px' }}>
              <Globe size={18} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Current Location</span>
            </div>
            {isEditing ? (
              <input 
                type="text" 
                className="form-input" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                style={{ width: '100%', padding: '8px 12px' }}
              />
            ) : (
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#101828' }}>{location}</p>
            )}
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px' }}>Syncing with SentinelX node...</p>
          </div>

          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', marginBottom: '10px' }}>
              <Sparkles size={18} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Current Device</span>
            </div>
            {isEditing ? (
              <input 
                type="text" 
                className="form-input" 
                value={device} 
                onChange={(e) => setDevice(e.target.value)}
                style={{ width: '100%', padding: '8px 12px' }}
              />
            ) : (
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#101828' }}>{device}</p>
            )}
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px' }}>Institutional-grade encryption active.</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '48px', padding: '32px', borderRadius: '24px', background: 'white', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '16px', color: '#0353A4' }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Two-Factor Authentication (TOTP)</h4>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Protect your account with an Authenticator App (Google Authenticator, Authy, etc.).</p>
          </div>
        </div>

        {!totpSetupData ? (
          <button 
            onClick={handleSetupTotp}
            style={{ padding: '12px 24px', background: '#0353A4', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Key size={18} />
            Set Up Authenticator App
          </button>
        ) : (
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <h5 style={{ fontWeight: 800, marginBottom: '16px', color: '#101828' }}>1. Scan this QR Code with your Authenticator App</h5>
            <div style={{ background: 'white', padding: '16px', display: 'inline-block', borderRadius: '12px', marginBottom: '8px', boxShadow: 'var(--shadow-sm)' }}>
              <img src={`data:image/png;base64,${totpSetupData.qr_code_base64}`} alt="TOTP QR Code" style={{ width: '200px', height: '200px' }} />
            </div>
            
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
              Can't scan? Use this setup key: <br/>
              <code style={{ background: '#e2e8f0', padding: '4px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '0.9rem', color: '#0353A4', letterSpacing: '0.1em' }}>{totpSetupData.secret}</code>
            </p>
            
            <h5 style={{ fontWeight: 800, marginBottom: '8px', color: '#101828', marginTop: '16px' }}>2. Enter the 6-digit code</h5>
            <div style={{ display: 'flex', gap: '12px', maxWidth: '300px' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="000000" 
                maxLength={6}
                value={verifyCode}
                onChange={e => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.2em', fontWeight: 'bold' }} 
              />
              <button 
                onClick={handleVerifyTotp}
                style={{ padding: '0 24px', background: '#2EC4B6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}
              >
                Verify
              </button>
            </div>
          </div>
        )}

        {totpError && <p style={{ color: '#ef4444', marginTop: '16px', fontWeight: 600, fontSize: '0.9rem' }}>{totpError}</p>}
        {totpSuccess && <p style={{ color: '#10b981', marginTop: '16px', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} /> {totpSuccess}</p>}
      </div>

      <div style={{ marginTop: '48px', padding: '32px', borderRadius: '24px', background: 'linear-gradient(135deg, #0353A4 0%, #001233 100%)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <div style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '16px' }}>
            <Globe size={28} color="#2EC4B6" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Security Sandbox</h4>
            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Test SentinelX detection engines</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <button
            onClick={async () => {
              const { setLocation, setDevice, reportEventToSentinelX } = (window as any).bankUtils;
              if (user.baseline_location && user.baseline_device) {
                setLocation(user.baseline_location);
                setDevice(user.baseline_device);
                await reportEventToSentinelX('status_change', { description: `Session synced to account baseline: ${user.baseline_location}` });
                alert(`Session Context Synced! Origin is now set to ${user.user_name || user.name}'s verified Home Baseline.`);
              } else {
                alert('No baseline data found for this account. Please re-login.');
              }
            }}
            style={{
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid #22c55e',
              color: '#22c55e',
              padding: '16px',
              borderRadius: '16px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <ShieldCheck size={18} />
            Sync Session to Safe Baseline
          </button>
          
          <button
            onClick={async () => {
              const { setLocation, reportEventToSentinelX } = (window as any).bankUtils;
              setLocation('Moscow, RU');
              await reportEventToSentinelX('status_change', { description: 'Location updated to Moscow, RU' });
              alert('Location jumped to Moscow, RU! Now perform a transaction to trigger "Impossible Travel".');
            }}
            style={{
              background: 'rgba(46, 196, 182, 0.2)',
              border: '1px solid #2EC4B6',
              color: '#2EC4B6',
              padding: '16px',
              borderRadius: '16px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <Zap size={18} />
            Simulate Foreign Travel (Instinct Jump)
          </button>
          
          <button
            onClick={async () => {
              if (!confirm('Are you sure you want to hard-reset security status? This will clear all risk scores and event history for this demo account.')) return;
              try {
                const accNo = user.accounts[0]?.accountNumber;
                if (!accNo) return alert('Account number not found.');
                
                const response = await fetch(`http://localhost:8000/api/simulate/reset-account?account_number=${accNo}`, {
                  method: 'POST'
                });
                if (response.ok) {
                  alert('Security Status Hard-Reset Successful! Returning to "Safe" baseline.');
                  window.location.reload();
                }
              } catch (err) {
                console.error('Reset failed:', err);
              }
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '16px',
              borderRadius: '16px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <RefreshCcw size={18} />
            Hard-Reset Security Status
          </button>
          
          <button
            onClick={() => navigate('/mailbox')}
            style={{
              background: 'rgba(3, 83, 164, 0.1)',
              border: '1px solid #0353A4',
              color: '#0353A4',
              padding: '16px',
              borderRadius: '16px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              gridColumn: 'span 2'
            }}
          >
            <Mail size={18} />
            Open SentinelX Alert Mailbox
          </button>
        </div>
      </div>
      
      {isEditing && (
        <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
          <button className="btn btn-primary" onClick={onSave} style={{ padding: '12px 32px', borderRadius: '12px' }}>Save Info</button>
          <button className="btn btn-outline" onClick={() => { setIsEditing(false); setProfileName(user.name); }} style={{ padding: '12px 32px', borderRadius: '12px' }}>Discard</button>
        </div>
      )}
    </div>
  </div>
  );
};


