import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, X } from 'lucide-react';

interface MockEmail {
  id: number;
  subject: string;
  html_content: string;
  created_at: string;
  is_read: boolean;
}

interface MockMailboxProps {
  email: string;
  onClose: () => void;
}

const MockMailbox: React.FC<MockMailboxProps> = ({ email, onClose }) => {
  const [emails, setEmails] = useState<MockEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<MockEmail | null>(null);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/mail/${email}`);
      const data = await response.json();
      if (response.ok) {
        setEmails(data);
      }
    } catch (error) {
      console.error("Failed to fetch mock emails:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmails();
    // In a real app we might use websockets, here we'll just poll every 3 seconds
    const interval = setInterval(fetchEmails, 3000);
    return () => clearInterval(interval);
  }, [email]);

  // Expose a global function that the injected HTML can call
  useEffect(() => {
    (window as any).handleMfaAction = async (url: string, payload?: any) => {
      try {
        const options: RequestInit = { method: 'POST' };
        if (payload) {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify(payload);
        }
        
        const response = await fetch(url, options);
        const result = await response.json();
        
        if (response.ok) {
          alert(`Success: ${result.message}\nYou can now close this mailbox and continue.`);
          setSelectedEmail(null);
          fetchEmails();
        } else {
          alert(`Error: ${result.error || result.detail}`);
        }
      } catch (err) {
        alert("Failed to connect to authorization server.");
      }
    };
    
    return () => {
      delete (window as any).handleMfaAction;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            <h2 className="font-semibold text-lg">Mock Mailbox: <span className="text-blue-300 font-mono text-sm">{email}</span></h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchEmails} className="hover:bg-slate-800 p-2 rounded-full transition-colors" title="Refresh">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onClose} className="hover:bg-red-500 hover:text-white p-2 text-slate-400 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Inbox List */}
          <div className="w-1/3 border-r border-slate-200 bg-slate-50 overflow-y-auto">
            {emails.length === 0 ? (
              <div className="text-center p-8 text-slate-400">
                <Mail className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Inbox is empty</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-200">
                {emails.map((msg) => (
                  <li 
                    key={msg.id}
                    onClick={() => setSelectedEmail(msg)}
                    className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${selectedEmail?.id === msg.id ? 'bg-blue-100 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-semibold text-slate-800 truncate">SentinelX Security</span>
                      <span className="text-xs text-slate-500">{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className={`text-sm truncate ${!msg.is_read ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{msg.subject}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Email View */}
          <div className="w-2/3 bg-white flex flex-col h-full overflow-hidden">
            {selectedEmail ? (
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedEmail.subject}</h3>
                  <div className="flex items-center text-sm text-slate-500 gap-2">
                    <span className="font-medium text-slate-700">From:</span> SentinelX Alerts
                    <span className="mx-2">•</span>
                    {new Date(selectedEmail.created_at).toLocaleString()}
                  </div>
                </div>
                <div 
                  className="p-6 overflow-y-auto flex-1 email-content-wrapper"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.html_content }}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                <Mail className="w-16 h-16 mb-4 opacity-10" />
                <p>Select an email to view its contents.</p>
                <p className="text-sm mt-2 text-slate-500 text-center">In a real environment, this would be your Gmail or company inbox.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MockMailbox;
