import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone, MessageCircle, Mail, StickyNote, ArrowRightLeft,
  Calendar, Filter, X, Clock, FilePen,
} from 'lucide-react';
import { STAGE_CFG, ASSIGNEE_CFG } from '../data/leads';

/* ── Config ─────────────────────────────────────────── */
const TYPE_CFG = {
  call:         { label: 'Call',          Icon: Phone,            color: '#00D4AA', bg: 'rgba(0,212,170,0.12)' },
  whatsapp:     { label: 'WhatsApp',      Icon: MessageCircle,    color: '#25D366', bg: 'rgba(37,211,102,0.1)'  },
  email:        { label: 'Email',         Icon: Mail,             color: '#4D9EFF', bg: 'rgba(77,158,255,0.12)' },
  note:         { label: 'Note',          Icon: StickyNote,       color: '#A78BFA', bg: 'rgba(167,139,250,0.12)'},
  stage_change: { label: 'Stage Change',  Icon: ArrowRightLeft,   color: '#FF8C42', bg: 'rgba(255,140,66,0.12)' },
  followup:     { label: 'Follow-up',     Icon: Calendar,         color: '#00D4AA', bg: 'rgba(0,212,170,0.1)'  },
  lead_edit:    { label: 'Lead Updated',  Icon: FilePen,          color: '#8B6BFF', bg: 'rgba(139,107,255,0.12)'},
};
const ALL_TYPES = Object.keys(TYPE_CFG);

function relTime(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1)   return 'just now';
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7)   return `${d}d ago`;
  return new Date(ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

/* ── Single entry ───────────────────────────────────── */
function TLEntry({ entry, lead, navigate }) {
  const cfg  = TYPE_CFG[entry.type] || TYPE_CFG.note;
  const sc   = STAGE_CFG[lead?.stage] || STAGE_CFG['Untouched'];
  const asgn = ASSIGNEE_CFG[entry.by] || ASSIGNEE_CFG['Priya S'];

  return (
    <div className="tl-entry">
      {/* Left: icon */}
      <div className="tl-icon-wrap">
        <div className="tl-icon" style={{ background: cfg.bg, color: cfg.color }}>
          <cfg.Icon size={14} strokeWidth={1.75} />
        </div>
        <div className="tl-vline" />
      </div>

      {/* Right: content */}
      <div className="tl-content">
        <div className="tl-top">
          {/* Lead chip */}
          {lead && (
            <div
              className="tl-lead-chip"
              onClick={() => navigate(`/crm/leads/${lead.id}`)}
              title="Open lead"
            >
              <div className="tl-av" style={{ background: lead.avatarColor }}>{lead.initials}</div>
              <span>{lead.name}</span>
              <span className={`badge ${sc.cls}`} style={{ fontSize: 9.5, padding: '1px 6px' }}>
                <span className="b-dot" />{lead.stage}
              </span>
            </div>
          )}
          <div className="tl-time" title={entry.date + ' ' + entry.time}>
            <Clock size={10} strokeWidth={1.75} />
            {relTime(entry.timestamp)}
            <span className="tl-abs">{entry.date} · {entry.time}</span>
          </div>
        </div>

        <div className="tl-card">
          {/* Type header */}
          <div className="tl-card-head">
            <span className="tl-type-badge" style={{ color: cfg.color, background: cfg.bg }}>
              <cfg.Icon size={11} strokeWidth={1.75} /> {cfg.label}
            </span>

            {entry.type === 'call' && (
              <>
                {entry.callStatus && (
                  <span className="tl-pill" style={{
                    background: entry.callStatus === 'Connected' ? 'rgba(0,212,170,0.1)' : 'rgba(90,96,128,0.15)',
                    color: entry.callStatus === 'Connected' ? '#00D4AA' : 'var(--muted2)',
                  }}>{entry.callStatus}</span>
                )}
                {entry.duration && (
                  <span className="tl-pill" style={{ background: 'rgba(77,158,255,0.1)', color: '#4D9EFF' }}>
                    {entry.duration}
                  </span>
                )}
              </>
            )}
            {entry.type === 'whatsapp' && entry.direction && (
              <span className="tl-pill" style={{ background: 'rgba(37,211,102,0.1)', color: '#25D366' }}>
                {entry.direction}
              </span>
            )}
            {entry.type === 'email' && entry.subject && (
              <span className="tl-subj">{entry.subject}</span>
            )}
            {entry.type === 'stage_change' && (
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                <b style={{ color: 'var(--muted2)' }}>{entry.from}</b>
                {' → '}
                <b style={{ color: 'var(--purple2)' }}>{entry.to}</b>
              </span>
            )}
            {entry.type === 'lead_edit' && (
              <span className="tl-pill" style={{ background: 'rgba(139,107,255,0.1)', color: '#8B6BFF' }}>
                {entry.changes?.length} field{entry.changes?.length > 1 ? 's' : ''} changed
              </span>
            )}
            {entry.type === 'followup' && (
              <span className="tl-pill" style={{ background: 'rgba(0,212,170,0.1)', color: '#00D4AA' }}>
                {entry.scheduledDate}{entry.scheduledTime ? ' · ' + entry.scheduledTime : ''}
              </span>
            )}

            {/* By */}
            <div className="tl-by-wrap">
              <div className="tl-by-av" style={{ background: asgn?.color || '#6C47FF' }}>
                {asgn?.initials || '?'}
              </div>
              <span className="tl-by">{entry.by}</span>
            </div>
          </div>

          {/* Edit diff */}
          {entry.type === 'lead_edit' && entry.changes?.length > 0 && (
            <div className="tl-card-body" style={{ padding: 0 }}>
              <div className="cl-diff-table" style={{ padding: '8px 12px' }}>
                {entry.changes.map((c, i) => (
                  <div key={i} className="cl-diff-row">
                    <span className="cl-diff-field">{c.field}</span>
                    <span className="cl-diff-before">{c.before}</span>
                    <span className="cl-diff-arrow">→</span>
                    <span className="cl-diff-after">{c.after}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes body */}
          {entry.notes && entry.type !== 'lead_edit' && (
            <div className="tl-card-body">{entry.notes}</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Group entries by date label ────────────────────── */
function groupByDate(entries) {
  const groups = {};
  entries.forEach(e => {
    const key = e.date || 'Unknown';
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  });
  return Object.entries(groups);
}

/* ── Main page ──────────────────────────────────────── */
export default function Timeline({ leads }) {
  const navigate = useNavigate();
  const [typeFilter,   setTypeFilter]   = useState([]);
  const [counsellor,   setCounsellor]   = useState('');
  const [searchLead,   setSearchLead]   = useState('');
  const [showFilters,  setShowFilters]  = useState(false);

  // Flatten all comms from all leads
  const allEntries = useMemo(() => {
    const out = [];
    leads.forEach(lead => {
      (lead.comms || []).forEach(c => {
        out.push({ ...c, leadId: lead.id });
      });
    });
    return out.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [leads]);

  const filtered = useMemo(() => allEntries.filter(e => {
    const lead = leads.find(l => l.id === e.leadId);
    if (typeFilter.length && !typeFilter.includes(e.type)) return false;
    if (counsellor && e.by !== counsellor) return false;
    if (searchLead) {
      const q = searchLead.toLowerCase();
      if (!lead?.name.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [allEntries, typeFilter, counsellor, searchLead, leads]);

  const grouped = groupByDate(filtered);

  const toggleType = (t) =>
    setTypeFilter(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const activeFilterCount = typeFilter.length + (counsellor ? 1 : 0) + (searchLead ? 1 : 0);

  return (
    <div className="app-body">
      {/* Topbar */}
      <div className="topbar">
        <span className="topbar-crumb">CRM</span>
        <span className="topbar-sep">›</span>
        <span className="topbar-page">Timeline</span>
        <div className="topbar-right">
          <button
            className={`tb-btn${activeFilterCount ? ' adv-filter-active' : ''}`}
            onClick={() => setShowFilters(f => !f)}
          >
            <Filter size={13} strokeWidth={1.75} />
            Filter
            {activeFilterCount > 0 && <span className="adv-filter-dot" />}
          </button>
        </div>
      </div>

      {/* Filter bar */}
      {showFilters && (
        <div className="tl-filter-bar">
          {/* Type toggles */}
          <div className="tl-filter-group">
            <span className="tl-filter-label">Type</span>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {ALL_TYPES.map(t => {
                const cfg = TYPE_CFG[t];
                const on  = typeFilter.includes(t);
                return (
                  <button
                    key={t}
                    className="cl-type-btn"
                    style={on ? { background: cfg.bg, borderColor: cfg.color, color: cfg.color } : {}}
                    onClick={() => toggleType(t)}
                  >
                    <cfg.Icon size={11} strokeWidth={1.75} /> {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="tl-filter-group">
            <span className="tl-filter-label">Counsellor</span>
            <select className="form-select" style={{ width: 160 }} value={counsellor} onChange={e => setCounsellor(e.target.value)}>
              <option value="">All</option>
              <option>Priya S</option><option>Arjun K</option><option>Meera R</option>
            </select>
          </div>

          <div className="tl-filter-group">
            <span className="tl-filter-label">Lead</span>
            <input
              className="form-input"
              style={{ width: 180 }}
              placeholder="Search lead name…"
              value={searchLead}
              onChange={e => setSearchLead(e.target.value)}
            />
          </div>

          {activeFilterCount > 0 && (
            <button
              className="tb-btn"
              style={{ color: 'var(--red)', marginLeft: 'auto' }}
              onClick={() => { setTypeFilter([]); setCounsellor(''); setSearchLead(''); }}
            >
              <X size={12} strokeWidth={2} /> Clear
            </button>
          )}
        </div>
      )}

      {/* Timeline body */}
      <div className="tl-body">
        {filtered.length === 0 ? (
          <div className="tl-empty">
            <Clock size={32} strokeWidth={1} style={{ color: 'var(--b2)', marginBottom: 12 }} />
            <div>No activities yet.</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>
              Open a lead → Communication Log → log a call, WhatsApp, or note.
            </div>
          </div>
        ) : (
          <>
            <div className="tl-count">{filtered.length} activit{filtered.length === 1 ? 'y' : 'ies'}</div>
            {grouped.map(([date, entries]) => (
              <div key={date} className="tl-group">
                <div className="tl-date-label">{date}</div>
                {entries.map(entry => (
                  <TLEntry
                    key={entry.id}
                    entry={entry}
                    lead={leads.find(l => l.id === entry.leadId)}
                    navigate={navigate}
                  />
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
