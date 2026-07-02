import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CRM from './pages/CRM';
import Login from './pages/Login';
import LeadDetail from './pages/LeadDetail';
import Timeline from './pages/Timeline';
import Toast from './components/Toast';
import { useToast } from './hooks/useToast';
import { INITIAL_LEADS } from './data/leads';

const AUTH_KEY  = 'cface_auth';
const LEADS_KEY = 'cface_leads';

function loadLeads() {
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_LEADS;
  } catch {
    return INITIAL_LEADS;
  }
}

function ProtectedApp({ user, onLogout, showToast }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [leads, setLeads] = useState(loadLeads);

  const handleLeadsChange = (newLeads) => {
    setLeads(newLeads);
    localStorage.setItem(LEADS_KEY, JSON.stringify(newLeads));
  };

  return (
    <>
      <Sidebar
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(e => !e)}
        showToast={showToast}
        user={user}
        onLogout={onLogout}
      />
      <Routes>
        <Route path="/crm" element={
          <CRM leads={leads} onLeadsChange={handleLeadsChange} showToast={showToast} />
        } />
        <Route path="/crm/leads/:id" element={
          <LeadDetail leads={leads} onLeadsChange={handleLeadsChange} showToast={showToast} />
        } />
        <Route path="/timeline" element={
          <Timeline leads={leads} />
        } />
        <Route path="*" element={<Navigate to="/crm" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; }
  });
  const { toast, showToast } = useToast();

  const handleLogin = (userData) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/crm" replace /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/*" element={
          user
            ? <ProtectedApp user={user} onLogout={handleLogout} showToast={showToast} />
            : <Navigate to="/login" replace />
        } />
      </Routes>
      <Toast {...toast} />
    </>
  );
}
