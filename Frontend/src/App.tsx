// SentinelX v2.0 - UI Overhaul applied
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SOCProvider } from './context/SOCContext';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Alerts from './pages/Alerts';
import Simulation from './pages/Simulation';
import IncidentReports from './pages/IncidentReports';
import Login from './pages/Login';
import AccountDetail from './pages/AccountDetail';
import Notifications from './pages/Notifications';

const AppContent = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login for now

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-slate-200 relative overflow-hidden">
      {/* Ambient glowing orbs for a more modern premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Header />
        <main className="flex-1 p-8 overflow-auto z-10 relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/reports" element={<IncidentReports />} />
            <Route path="/accounts/:id" element={<AccountDetail />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <SOCProvider>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      }} />
      <Router>
        <AppContent />
      </Router>
    </SOCProvider>
  );
}

export default App;
