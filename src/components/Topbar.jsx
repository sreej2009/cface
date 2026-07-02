import { Download, Upload, Bell, Search, Zap } from 'lucide-react';

export default function Topbar({ onAddLead, onTogglePanel, showToast }) {
  return (
    <div className="topbar">
      <span className="topbar-crumb">CRM</span>
      <span className="topbar-sep">›</span>
      <span className="topbar-page">Leads</span>
      <div className="topbar-right">
        <button className="tb-btn" onClick={() => showToast('Importing...', '#4D9EFF')}>
          <Download size={13} strokeWidth={1.75} /> Import
        </button>
        <button className="tb-btn" onClick={() => showToast('Exporting...', '#00D4AA')}>
          <Upload size={13} strokeWidth={1.75} /> Export
        </button>
        <div className="tb-icon notif-pip" title="Notifications">
          <Bell size={14} strokeWidth={1.75} />
        </div>
        <div className="tb-icon" title="Global search">
          <Search size={14} strokeWidth={1.75} />
        </div>
        <div className="tb-icon" title="Live overview" onClick={onTogglePanel}>
          <Zap size={14} strokeWidth={1.75} />
        </div>
        <button className="tb-btn primary" onClick={onAddLead}>+ Add Lead</button>
      </div>
    </div>
  );
}
