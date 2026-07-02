import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Zap, LayoutDashboard, Folder, CheckSquare, Target, Megaphone,
  GraduationCap, TrendingUp, Handshake, Users, BarChart2, Settings,
  LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', flyout: 'main' },
  { icon: Folder,          label: 'My Drive',   flyout: 'main' },
  { icon: CheckSquare,     label: 'Tasks',       flyout: 'main' },
  null,
  { icon: Target,          label: 'CRM',         flyout: 'crm',       id: 'crm' },
  { icon: Megaphone,       label: 'Marketing',   flyout: 'marketing', id: 'marketing' },
  { icon: GraduationCap,   label: 'Counselling', flyout: 'main' },
  null,
  { icon: TrendingUp,      label: 'Sales',       flyout: 'main' },
  { icon: Handshake,       label: 'Partners',    flyout: 'main' },
  { icon: Users,           label: 'HRMS',        flyout: 'main' },
  { icon: BarChart2,       label: 'MIS',         flyout: 'main' },
];

const FLYOUTS = {
  crm: {
    title: 'CRM',
    items: [
      { label: 'Leads',          route: '/crm' },
      { label: 'Timeline',       route: '/timeline' },
      { label: 'Follow-up Queue' },
      { label: 'Contacts' },
      { label: 'Flow Builder' },
      { label: 'Reports' },
      { label: 'Settings' },
    ],
  },
  marketing: {
    title: 'Marketing',
    items: [
      { label: 'Dashboard' },
      { label: 'Landing Pages' },
      { label: 'Google Ads' },
      { label: 'Meta Ads' },
      { label: 'Omni Channel' },
      { label: 'Reports' },
    ],
  },
  main: {
    title: 'Navigation',
    items: [
      { label: 'Dashboard' },
      { label: 'My Drive' },
      { label: 'Tasks' },
      { label: 'Calendar' },
    ],
  },
};

export default function Sidebar({ expanded, onToggle, showToast, user, onLogout }) {
  const [activeFlyout, setActiveFlyout] = useState('crm');
  const navigate  = useNavigate();
  const location  = useLocation();

  const toggleFlyout = (name) => {
    setActiveFlyout(prev => (prev === name ? null : name));
  };

  const flyoutLeft = expanded ? '220px' : '60px';

  const displayInitials = user?.initials || 'U';
  const displayName     = user?.name || 'User';

  return (
    <>
      <aside className={`icon-sidebar${expanded ? ' expanded' : ''}`}>
        <div className="logo-mark" onClick={onToggle}>
          <Zap size={18} strokeWidth={1.75} style={{ flexShrink: 0 }} />
          <span className="nav-label" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.4px' }}>CFACE</span>
        </div>

        {NAV_ITEMS.map((item, i) => {
          if (item === null) return <div key={i} className="icon-divider" />;
          const Icon = item.icon;
          return (
            <div
              key={i}
              className={`nav-icon-btn${item.flyout === 'crm' && activeFlyout === 'crm' ? ' active' : ''}`}
              onClick={() => toggleFlyout(item.flyout)}
            >
              <Icon size={18} strokeWidth={1.75} style={{ flexShrink: 0 }} />
              <span className="nav-label">{item.label}</span>
            </div>
          );
        })}

        <div className="sidebar-bottom">
          <div className="nav-icon-btn" onClick={() => showToast && showToast('Settings coming soon', '#A78BFA')}>
            <Settings size={18} strokeWidth={1.75} style={{ flexShrink: 0 }} />
            <span className="nav-label">Settings</span>
          </div>
          {onLogout && (
            <div className="nav-icon-btn" onClick={onLogout} title="Logout">
              <LogOut size={18} strokeWidth={1.75} style={{ flexShrink: 0 }} />
              <span className="nav-label">Logout</span>
            </div>
          )}
          <div className="sidebar-user">
            <div className="avatar-sm">{displayInitials}</div>
            <span className="nav-label" style={{ fontSize: '11.5px', fontWeight: 600, marginLeft: 9 }}>{displayName}</span>
          </div>
        </div>
      </aside>

      {Object.entries(FLYOUTS).map(([key, flyout]) => (
        <div
          key={key}
          className={`flyout${activeFlyout === key ? ' open' : ''}`}
          style={{ left: flyoutLeft }}
        >
          <div className="flyout-header">
            <span className="flyout-title">{flyout.title}</span>
          </div>
          {flyout.items.map((item, i) => {
            const isActive = item.route && location.pathname === item.route;
            return (
              <div
                key={i}
                className={`flyout-item${isActive ? ' active' : ''}`}
                onClick={() => {
                  if (item.route) navigate(item.route);
                  else showToast && showToast(item.label, '#A78BFA');
                }}
              >
                <div className="flyout-dot" />
                {item.label}
                {item.badge && <span className="flyout-badge">{item.badge}</span>}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
