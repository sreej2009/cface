import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { AVATAR_COLORS, SUBSTAGE_CFG } from '../data/leads';

const SRC_MAP = { 'Meta Ads': 'meta', 'Google Ads': 'google', 'Landing Page': 'lp', 'Manual': 'manual', 'WhatsApp': 'lp' };

export default function AddLeadModal({ show, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '', source: 'Meta Ads', campaign: 'Medico Expo 2026', assignee: 'Auto Assign', stage: 'Untouched', substage: 'Fresh Lead', notes: '' });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = (sendWA) => {
    if (!form.name.trim() || !form.phone.trim()) {
      onSave(null, 'Name and phone are required');
      return;
    }
    const words = form.name.trim().split(' ');
    const initials = ((words[0]?.[0] || '') + (words[1]?.[0] || '')).toUpperCase();
    const assignee = form.assignee === 'Auto Assign' ? 'Priya S' : form.assignee;
    const lead = {
      id: Date.now(),
      name: form.name.trim(),
      initials,
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      phone: form.phone.trim(),
      email: form.email.trim() || '—',
      stage: form.stage,
      substage: form.substage,
      source: SRC_MAP[form.source] || 'manual',
      campaign: form.campaign,
      assignee,
      score: Math.floor(Math.random() * 30) + 10,
      actIcon: null, actLabel: 'No activity', actTime: 'Just now',
      created: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    onSave(lead, sendWA);
    setForm({ name: '', phone: '', email: '', city: '', source: 'Meta Ads', campaign: 'Medico Expo 2026', assignee: 'Auto Assign', stage: 'Untouched', substage: 'Fresh Lead', notes: '' });
  };

  return (
    <div className={`overlay${show ? ' show' : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Add New Lead</span>
          <span className="modal-close" onClick={onClose}><X size={18} strokeWidth={1.75} /></span>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input className="form-input" type="text" placeholder="Arun Kumar" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input className="form-input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input className="form-input" type="email" placeholder="email@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label>City</label>
              <input className="form-input" type="text" placeholder="Chennai" value={form.city} onChange={e => set('city', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Source</label>
              <select className="form-select" value={form.source} onChange={e => set('source', e.target.value)}>
                <option>Meta Ads</option><option>Google Ads</option><option>Landing Page</option><option>Manual</option><option>WhatsApp</option>
              </select>
            </div>
            <div className="form-group">
              <label>Campaign</label>
              <select className="form-select" value={form.campaign} onChange={e => set('campaign', e.target.value)}>
                <option>Medico Expo 2026</option><option>MBBS Abroad 2026</option><option>KlickEdu MBBS</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Assign To</label>
              <select className="form-select" value={form.assignee} onChange={e => set('assignee', e.target.value)}>
                <option>Auto Assign</option><option>Priya S</option><option>Arjun K</option><option>Meera R</option>
              </select>
            </div>
            <div className="form-group">
              <label>Stage</label>
              <select className="form-select" value={form.stage} onChange={e => {
                const s = e.target.value;
                set('stage', s);
                set('substage', (SUBSTAGE_CFG[s] || [])[0] || '');
              }}>
                <option>Untouched</option><option>Cold</option><option>Warm</option><option>Hot</option>
              </select>
            </div>
          </div>
          {(SUBSTAGE_CFG[form.stage] || []).length > 0 && (
            <div className="form-group">
              <label>Sub-stage</label>
              <select className="form-select" value={form.substage} onChange={e => set('substage', e.target.value)}>
                {(SUBSTAGE_CFG[form.stage] || []).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          )}
          <div className="form-group">
            <label>Notes</label>
            <input className="form-input" type="text" placeholder="Any initial notes..." value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="tb-btn" onClick={onClose}>Cancel</button>
          <button className="tb-btn" onClick={() => handleSave(true)}>
            <Save size={13} strokeWidth={1.75} /> Save + WhatsApp
          </button>
          <button className="tb-btn primary" onClick={() => handleSave(false)}>+ Add Lead</button>
        </div>
      </div>
    </div>
  );
}
