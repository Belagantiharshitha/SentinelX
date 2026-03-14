import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { BankProvider, useBank } from './context/BankContext';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import MockMailbox from './components/MockMailbox';

const AppContent: React.FC = () => {
  const { user, isLoading, isLocked } = useBank();

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="app-main-wrapper" style={{ position: 'relative' }}>
        <Routes>
            <Route path="/" element={user ? <Dashboard /> : <Auth />} />
            <Route path="/mailbox" element={<StandaloneMailbox />} />
        </Routes>
      
      {isLocked && (
        <div className="security-lock-overlay">
          <div className="lock-content">
            <div className="lock-icon">🔒</div>
            <h1>Account Frozen</h1>
            <p>Our SentinelX AI has detected suspicious activity on your account. Access has been restricted for your security.</p>
            <div className="lock-badges">
              <span className="badge">Auto-Mitigation Active</span>
              <span className="badge">SentinelX Secured</span>
            </div>
            <p className="contact-support">Please contact Novus Bank high-security support.</p>
          </div>
        </div>
      )}

      <style>{`
        .security-lock-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(10px);
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
          animation: fadeIn 0.5s ease;
        }

        .lock-content {
          max-width: 450px;
          padding: 40px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .lock-icon {
          font-size: 64px;
          margin-bottom: 24px;
          filter: drop-shadow(0 0 15px var(--primary));
        }

        .lock-content h1 {
          font-size: 28px;
          margin-bottom: 16px;
          background: linear-gradient(to right, #fff, #9ca3af);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .lock-content p {
          color: #9ca3af;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .lock-badges {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 24px;
        }

        .badge {
          padding: 6px 12px;
          background: rgba(139, 92, 246, 0.2);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 20px;
          font-size: 12px;
          color: #a78bfa;
          font-weight: 600;
        }

        .contact-support {
          font-size: 14px;
          font-weight: 500;
          color: var(--primary) !important;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

const StandaloneMailbox = () => {
    const { user } = useBank();
    const navigate = useNavigate();
    
    // Use prompt to ask for email if not logged in
    const [mockEmail, setMockEmail] = React.useState(user?.email || '');
    
    React.useEffect(() => {
        if (!mockEmail) {
            const entered = prompt("Enter the email address you want to check the mailbox for:");
            if (entered) setMockEmail(entered);
            else navigate('/');
        }
    }, [mockEmail, navigate]);

    if (!mockEmail) return null;

    return (
        <div style={{ height: '100vh', background: '#f8fafc' }}>
            <MockMailbox email={mockEmail} onClose={() => navigate('/')} />
        </div>
    );
};

function App() {
  return (
    <BrowserRouter>
      <BankProvider>
        <AppContent />
        <style>{`
          .loading-state {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }

          .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            border-top-color: var(--primary);
            animation: spin 1s ease-in-out infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </BankProvider>
    </BrowserRouter>
  );
}

export default App;
