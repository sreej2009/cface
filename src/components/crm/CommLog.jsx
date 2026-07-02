import { useState } from 'react';
import { Phone, MessageCircle, Mail, StickyNote, ChevronDown, ChevronUp, Send, FilePen } from 'lucide-react';

const TYPES = [
  { key: 'call',      label: 'Call',      Icon: Phone,          color: '#00D4AA', bg: 'rgba(0,212,170,0.12)' },
  { key: 'whatsapp',  label: 'WhatsApp',  Icon: MessageCircle,  color: '#25D366', bg: 'rgba(37,211,102,0.1)' },
  { key: 'email',     label: 'Email',     Icon: Mail,           color: '#4D9EFF', bg: 'rgba(77,158,255,0.12)' },
  { key: 'note',      label: 'Note',      Icon: StickyNote,     color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' },
];

const CALL_STATUSES = ['Connected', 'No Answer', 'Busy', 'Voicemail'];

const TYPE_MAP = Object.fromEntries(TYPES.map(t => [t.key, t]));

function nowLabel() {
  const d = new Date();
  return {
    date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    timestamp: d.getTime(),
  };
}

function CommEntry({ entry }) {
  const [expanded, setExpanded] = useState(false);
  const t = TYPE_MAP[entry.type];

  if (entry.type === 'stage_change') {
    return (
      <div className="cl-entry cl-stage">
        <div className="cl-spine" />
        <div className="cl-dot" style={{ background: 'var(--b2)', width: 10, height: 10, border: '2px solid var(--b1)' }} />
        <div className="cl-body">
          <span className="cl-stage-text">
            Stage moved <b style={{ color: 'var(--muted2)' }}>{entry.from}</b> → <b style={{ color: 'var(--purple2)' }}>{entry.to}</b>
          </span>
          <span className="cl-meta">{entry.date} · {entry.time} · {entry.by}</span>
        </div>
      </div>
    );
  }

  if (entry.type === 'lead_edit') {
    return (
      <div className="cl-entry">
        <div className="cl-spine" />
        <div className="cl-icon" style={{ background: 'rgba(139,107,255,0.12)', color: '#8B6BFF' }}>
          <FilePen size={13} strokeWidth={1.75} />
        </div>
        <div className="cl-body">
          <div className="cl-title-row" style={{ marginBottom: 3 }}>
            <span className="cl-type" style={{ color: '#8B6BFF' }}>Lead Updated</span>
            <span style={{ fontSize: 10, color: 'var(--muted)', background: 'var(--card2)', padding: '1px 7px', borderRadius: 5 }}>
              {entry.changes?.length} field{entry.changes?.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="cl-meta-row" style={{ marginBottom: 6 }}>
            <span className="cl-meta">{entry.date} · {entry.time}</span>
            <span className="cl-by">{entry.by}</span>
          </div>
          <div className="cl-diff-table">
            {(entry.changes || []).map((c, i) => (
              <div key={i} className="cl-diff-row">
                <span className="cl-diff-field">{c.field}</span>
                <span className="cl-diff-before">{c.before}</span>
                <span className="cl-diff-arrow">→</span>
                <span className="cl-diff-after">{c.after}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (entry.type === 'followup') {
    return (
      <div className="cl-entry cl-stage">
        <div className="cl-spine" />
        <div className="cl-dot" style={{ background: '#00D4AA44', width: 10, height: 10, border: '2px solid #00D4AA' }} />
        <div className="cl-body">
          <span className="cl-stage-text">
            Follow-up scheduled for <b style={{ color: '#00D4AA' }}>{entry.scheduledDate}{entry.scheduledTime ? ' at ' + entry.scheduledTime : ''}</b>
          </span>
          {entry.notes && <div className="cl-note-text">{entry.notes}</div>}
          <span className="cl-meta">{entry.date} · {entry.time} · {entry.by}</span>
        </div>
      </div>
    );
  }

  const Icon = t?.Icon || Mail;
  const hasNotes = !!entry.notes;

  return (
    <div className="cl-entry">
      <div className="cl-spine" />
      <div className="cl-icon" style={{ background: t?.bg, color: t?.color }}>
        <Icon size={13} strokeWidth={1.75} />
      </div>
      <div className="cl-body">
        <div className="cl-header" onClick={() => hasNotes && setExpanded(e => !e)}>
          <div className="cl-title-row">
            <span className="cl-type" style={{ color: t?.color }}>{t?.label}</span>
            {entry.type === 'call' && entry.callStatus && (
              <span className="cl-badge" style={{
                background: entry.callStatus === 'Connected' ? 'rgba(0,212,170,0.1)' : 'rgba(90,96,128,0.15)',
                color: entry.callStatus === 'Connected' ? '#00D4AA' : 'var(--muted2)',
              }}>
                {entry.callStatus}
              </span>
            )}
            {entry.type === 'call' && entry.duration && (
              <span className="cl-badge" style={{ background: 'rgba(77,158,255,0.1)', color: '#4D9EFF' }}>
                {entry.duration}
              </span>
            )}
            {entry.type === 'whatsapp' && entry.direction && (
              <span className="cl-badge" style={{ background: 'rgba(37,211,102,0.1)', color: '#25D366' }}>
                {entry.direction}
              </span>
            )}
            {entry.type === 'email' && entry.subject && (
              <span className="cl-subj">{entry.subject}</span>
            )}
          </div>
          <div className="cl-meta-row">
            <span className="cl-meta">{entry.date} · {entry.time}</span>
            <span className="cl-by">{entry.by}</span>
            {hasNotes && (
              <span className="cl-expand">
                {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </span>
            )}
          </div>
        </div>
        {hasNotes && expanded && (
          <div className="cl-notes">{entry.notes}</div>
        )}
        {hasNotes && !expanded && (
          <div className="cl-preview" onClick={() => setExpanded(true)}>{entry.notes}</div>
        )}
      </div>
    </div>
  );
}

export default function CommLog({ lead, onCommsChange, assignee }) {
  const [activeType, setActiveType] = useState(null);
  const [form, setForm]             = useState({
    callStatus: 'Connected', duration: '', direction: 'Sent',
    subject: '', notes: '',
  });

  const comms = lead.comms || [];

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleTypeClick = (key) => {
    setActiveType(prev => prev === key ? null : key);
    setForm({ callStatus: 'Connected', duration: '', direction: 'Sent', subject: '', notes: '' });
  };

  const handleLog = () => {
    const { date, time, timestamp } = nowLabel();
    const entry = {
      id: timestamp,
      type: activeType,
      by: assignee || 'Unknown',
      date, time, timestamp,
      notes: form.notes.trim(),
    };
    if (activeType === 'call') {
      entry.callStatus = form.callStatus;
      entry.duration   = form.duration;
    }
    if (activeType === 'whatsapp') entry.direction = form.direction;
    if (activeType === 'email')    entry.subject   = form.subject;

    onCommsChange([entry, ...comms]);
    setActiveType(null);
    setForm({ callStatus: 'Connected', duration: '', direction: 'Sent', subject: '', notes: '' });
  };

  const sorted = [...comms].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  return (
    <div className="cl-wrap">
      {/* Type selector buttons */}
      <div className="cl-type-row">
        {TYPES.map(({ key, label, Icon, color, bg }) => (
          <button
            key={key}
            className={`cl-type-btn${activeType === key ? ' active' : ''}`}
            style={activeType === key ? { background: bg, borderColor: color, color } : {}}
            onClick={() => handleTypeClick(key)}
          >
            <Icon size={13} strokeWidth={1.75} /> {label}
          </button>
        ))}
      </div>

      {/* Log form */}
      {activeType && (
        <div className="cl-form">
          {activeType === 'call' && (
            <div className="cl-form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label>Status</label>
                <select className="form-select" value={form.callStatus} onChange={e => setF('callStatus', e.target.value)}>
                  {CALL_STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Duration</label>
                <input className="form-input" placeholder="e.g. 5 min" value={form.duration} onChange={e => setF('duration', e.target.value)} />
              </div>
            </div>
          )}
          {activeType === 'whatsapp' && (
            <div className="form-group">
              <label>Direction</label>
              <select className="form-select" value={form.direction} onChange={e => setF('direction', e.target.value)}>
                <option>Sent</option><option>Received</option>
              </select>
            </div>
          )}
          {activeType === 'email' && (
            <div className="form-group">
              <label>Subject</label>
              <input className="form-input" placeholder="Email subject…" value={form.subject} onChange={e => setF('subject', e.target.value)} />
            </div>
          )}
          <div className="form-group">
            <label>{activeType === 'note' ? 'Note' : 'Notes / Summary'}</label>
            <textarea
              className="form-input cl-textarea"
              placeholder={
                activeType === 'call'     ? 'What was discussed?' :
                activeType === 'whatsapp' ? 'Message summary…' :
                activeType === 'email'    ? 'Email summary…' :
                'Add a note…'
              }
              value={form.notes}
              onChange={e => setF('notes', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && e.ctrlKey && handleLog()}
              rows={2}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button className="tb-btn" onClick={() => setActiveType(null)}>Cancel</button>
            <button className="tb-btn primary" onClick={handleLog}>
              <Send size={12} strokeWidth={1.75} /> Log {TYPES.find(t => t.key === activeType)?.label}
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="cl-timeline">
        {sorted.length === 0 ? (
          <div className="cl-empty">No communications logged yet. Use the buttons above to log an activity.</div>
        ) : (
          sorted.map(entry => <CommEntry key={entry.id} entry={entry} />)
        )}
      </div>
    </div>
  );
}
