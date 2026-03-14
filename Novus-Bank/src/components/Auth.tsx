import React, { useState } from 'react';
import { useBank } from '../context/BankContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Building2, ChevronRight, PieChart, ShieldCheck, Eye, EyeOff, Smartphone, MapPin, Key } from 'lucide-react';
import MockMailbox from './MockMailbox';

export const Auth: React.FC = () => {
  const { login, loginTotp, signup, reportEventToSentinelX, setDevice, setLocation, device, location } = useBank();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  
  // MFA States
  const [isMfaPending, setIsMfaPending] = useState(false);
  const [showMailbox, setShowMailbox] = useState(false);
  const [isTotpPending, setIsTotpPending] = useState(false);
  const [totpCode, setTotpCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsMfaPending(false);

    if (isLogin) {
      if (isTotpPending) {
        // Authenticator login path
        try {
          await loginTotp(email, password, totpCode);
          setFailedAttempts(0);
        } catch (err: any) {
          setError(err.message || 'Invalid authenticator code.');
        }
        return;
      }

      // Standard login path
      try {
        await login(email, password);
        setFailedAttempts(0);
      } catch (err: any) {
        const errorMsg = err.message || 'Invalid credentials. Please try again.';
        
        if (errorMsg === 'TOTP_REQUIRED') {
            setIsTotpPending(true);
            return;
        }

        if (errorMsg.includes("MFA Required") || errorMsg.includes("check your email")) {
          // Trigger MFA Flow
          setIsMfaPending(true);
          setError("New device detected. Please check your email inbox to authorize this login.");
        } else {
          // Standard failures
          const newCount = failedAttempts + 1;
          setFailedAttempts(newCount);
          setError(errorMsg);

          // Report failure to SentinelX
          await reportEventToSentinelX('login_failed', {
            attempt_number: newCount,
            is_potential_brute_force: newCount >= 3,
            email_attempted: email
          });
        }
      }
    } else {
      try {
        await signup(email, name, password);
      } catch (err: any) {
        setError(err.message || 'Registration failed');
      }
    }
  };

  return (
    <div className="auth-container">
      {/* Visual Side */}
      <div className="auth-brand">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: '40px', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <ShieldCheck size={20} color="#2EC4B6" style={{ marginRight: '8px' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>Authorized Bank Access</span>
          </motion.div>

          <h1 style={{ fontSize: '3.5rem', lineHeight: '1.1', color: 'white', marginBottom: '24px', fontWeight: 800 }}>
            Unified <span style={{ color: '#2EC4B6' }}>Banking</span> Portal.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', maxWidth: '480px' }}>
            A comprehensive, clean, and highly secure platform to manage your global assets with institutional-grade precision.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '48px' }}>
            <BrandBenefit icon={<PieChart size={24} />} title="Portfolio Insights" desc="Real-time wealth tracking." />
            <BrandBenefit icon={<Building2 size={24} />} title="Direct Settlement" iconColor="#FF9F1C" desc="Instant inter-bank transfers." />
          </div>
        </div>

        {/* Animated Background Decoration */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, #0353A4 0%, transparent 70%)', opacity: 0.3, filter: 'blur(60px)' }}></div>
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, #2EC4B6 0%, transparent 70%)', opacity: 0.2, filter: 'blur(80px)' }}></div>
      </div>

      {/* Form Side */}
      <div className="auth-form-view">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ width: '100%', maxWidth: '440px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ width: '64px', height: '64px', background: '#0353A4', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 10px 20px rgba(3, 83, 164, 0.2)' }}>
              <Building2 size={32} color="white" />
            </div>
            <h2 style={{ fontSize: '1.75rem', color: '#101828' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p style={{ color: '#64748b', marginTop: '4px' }}>{isLogin ? 'Please login with your portal credentials' : 'Register your institutional account'}</p>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  background: isMfaPending ? '#EFF6FF' : '#FEF2F2', 
                  border: isMfaPending ? '1px solid #BFDBFE' : '1px solid #FCA5A5', 
                  color: isMfaPending ? '#1E40AF' : '#B91C1C', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  marginTop: '16px', 
                  fontSize: '0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  alignItems: 'center'
                }}
              >
                <div>{error}</div>
                {isMfaPending && (
                  <button 
                    type="button"
                    onClick={(e) => { e.preventDefault(); setShowMailbox(true); }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      background: '#0353A4', 
                      color: 'white', 
                      padding: '8px 16px', 
                      borderRadius: '6px', 
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      marginTop: '4px'
                    }}
                  >
                    <Mail size={16} /> Open Mailbox
                  </button>
                )}
              </motion.div>
            )}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Device and Location Simulators (For SentinelX Demo) */}
            {isLogin && !isTotpPending && (
              <div style={{ display: 'flex', gap: '16px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>Login Device</label>
                  <div style={{ position: 'relative' }}>
                    <Smartphone style={{ position: 'absolute', left: '10px', top: '10px' }} size={14} color="#94a3b8" />
                    <select
                      value={device}
                      onChange={e => setDevice(e.target.value)}
                      style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.875rem', background: 'white' }}
                    >
                      <option value="Windows / Chrome">Windows PC (Safe)</option>
                      <option value="iPhone 15 / Safari">iPhone 15</option>
                      <option value="MacBook Pro / Safari">MacBook Pro</option>
                      <option value="Linux Unknown / Curl">Unknown Script</option>
                    </select>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>Location</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin style={{ position: 'absolute', left: '10px', top: '10px' }} size={14} color="#94a3b8" />
                    <select
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.875rem', background: 'white' }}
                    >
                      <option value="Hyderabad">Hyderabad (Safe)</option>
                      <option value="San Francisco, CA">San Francisco, CA</option>
                      <option value="London, UK">London, UK</option>
                      <option value="Moscow, RU">Moscow, RU</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {isTotpPending ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#EFF6FF', color: '#1E40AF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <Key size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>Two-Factor Authentication</h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '4px' }}>Enter the 6-digit code from your authenticator app.</p>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#344054', marginBottom: '6px' }}>Authenticator Code</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.25em', fontWeight: 'bold' }}
                    placeholder="000000"
                    maxLength={6}
                    value={totpCode}
                    onChange={e => setTotpCode(e.target.value.replace(/\D/g, ''))} // only numbers
                    required
                    autoFocus
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => setIsTotpPending(false)}
                  style={{ width: '100%', background: 'none', border: 'none', color: '#64748b', fontSize: '0.875rem', marginTop: '16px', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Cancel and return to login
                </button>
              </motion.div>
            ) : (
                <>
                  {!isLogin && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#344054', marginBottom: '6px' }}>Legal Full Name</label>
                      <div style={{ position: 'relative' }}>
                        <UserIcon style={{ position: 'absolute', left: '14px', top: '14px' }} size={18} color="#94a3b8" />
                        <input
                          type="text"
                          className="form-input"
                          style={{ paddingLeft: '44px' }}
                          placeholder="Enter full name"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#344054', marginBottom: '6px' }}>Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <Mail style={{ position: 'absolute', left: '14px', top: '14px' }} size={18} color="#94a3b8" />
                      <input
                        type="email"
                        className="form-input"
                        style={{ paddingLeft: '44px' }}
                        placeholder="name@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#344054', marginBottom: '6px' }}>Portal Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock style={{ position: 'absolute', left: '14px', top: '14px' }} size={18} color="#94a3b8" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        style={{ paddingLeft: '44px', paddingRight: '44px' }}
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '14px', top: '14px', color: '#94a3b8', border: 'none', background: 'none', padding: 0, display: 'flex', alignItems: 'center' }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </>
            )}

            <button type="submit" disabled={isMfaPending} className={`btn btn-primary`} style={{ width: '100%', padding: '14px', fontSize: '1rem', opacity: isMfaPending ? 0.7 : 1, cursor: isMfaPending ? 'not-allowed' : 'pointer' }}>
              {isTotpPending ? 'Verify Code' : isLogin ? 'Sign In' : 'Create Account'} <ChevronRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.875rem' }}>
            <span style={{ color: '#64748b' }}>{isLogin ? "Don't have an account?" : "Already a member?"}</span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{ color: '#0353A4', fontWeight: 700, marginLeft: '6px', cursor: 'pointer', background: 'none', border: 'none' }}
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </div>
        </motion.div>
      </div>
      
      {showMailbox && <MockMailbox email={email} onClose={() => setShowMailbox(false)} />}

      <style>{`
        .auth-container {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          height: 100vh;
        }

        .auth-brand {
          background-color: #001233;
          padding: 80px;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .auth-form-view {
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        @media (max-width: 1024px) {
          .auth-container { grid-template-columns: 1fr; }
          .auth-brand { display: none; }
        }
      `}</style>
    </div>
  );
};

const BrandBenefit: React.FC<{ icon: React.ReactNode; title: string; desc: string; iconColor?: string }> = ({ icon, title, desc, iconColor = '#2EC4B6' }) => (
  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
    <div style={{ color: iconColor, marginBottom: '12px' }}>{icon}</div>
    <h4 style={{ color: 'white', marginBottom: '4px' }}>{title}</h4>
    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{desc}</p>
  </div>
);
