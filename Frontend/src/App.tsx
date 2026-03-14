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
import AdminProfile from './pages/AdminProfile';

const AppContent = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login for now

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen w-screen bg-obsidian text-slate-200 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyber-primary/10 blur-[180px] rounded-full pointer-events-none mix-blend-screen animate-float" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyber-secondary/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen animate-float" style={{ animationDelay: '-5s' }} />
      <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] bg-cyber-accent/5 blur-[120px] rounded-full pointer-events-none mix-blend-overlay animate-slow-spin" />

      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 z-10 overflow-hidden relative">
        <Header />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto z-10 relative scroll-smooth overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto w-full pb-20">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/simulation" element={<Simulation />} />
              <Route path="/reports" element={<IncidentReports />} />
              <Route path="/accounts/:id" element={<AccountDetail />} />
              <Route path="/profile" element={<AdminProfile />} />
            </Routes>
          </div>
        </main>

        {/* Subtle Bottom Fade to prevent footer clipping/hiding content */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-obsidian to-transparent pointer-events-none z-20" />
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
