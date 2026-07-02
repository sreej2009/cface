import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Phone, MessageCircle, Mail, Edit2, Save, X,
  Trash2, Calendar, UserCheck, MapPin, Briefcase,
} from 'lucide-react';
import { STAGE_CFG, SRC_CFG, ASSIGNEE_CFG, SUBSTAGE_CFG } from '../data/leads';
import CommLog from '../components/crm/CommLog';

const PIPELINE = ['Untouched', 'Cold', 'Warm', 'Hot', 'Converted'];

function StagePipeline({ stage, substage, onMove, onSubMove }) {
  const isLost = stage === 'Lost';
  const curIdx = PIPELINE.indexOf(stage);
  const sc     = STAGE_CFG[stage] || STAGE_CFG['Untouched'];
  const subs   = SUBSTAGE_CFG[stage] || [];

  return (
    <div className="pipeline-wrap">
      {/* Stage nodes */}
      <div className="pipeline-track">
        {PIPELINE.map((s, i) => {
          const cfg       = STAGE_CFG[s];
          const isDone    = !isLost && i < curIdx;
          const isCurrent = stage === s;
          return (
            <div key={s} className="pipe-item">
              {i > 0 && (
                <div className={`pipe-line${isDone || isCurrent ? ' filled' : ''}`} />
              )}
              <button
                className={`pipe-node${isDone ? ' done' : ''}${isCurrent ? ' current' : ''}`}
                style={
                  isCurrent ? { background: cfg.color, borderColor: cfg.color, boxShadow: `0 0 12px ${cfg.color}55` }
                  : isDone   ? { background: 'var(--purple)', borderColor: 'var(--purple)' }
                  : {}
                }
                onClick={() => onMove(s)}
                title={`Move to ${s}`}
              >
                {isDone ? '✓' : i + 1}
              </button>
              <span
                className={`pipe-label${isCurrent ? ' current' : ''}${isDone ? ' done' : ''}`}
                style={isCurrent ? { color: cfg.color } : {}}
              >
                {s}
              </span>
            </div>
          );
        })}
      </div>

      {/* Lost badge */}
      {isLost && (
        <div className="pipe-lost-badge">
          <span className="badge b-lost"><span className="b-dot" />Lost</span>
          <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 8 }}>— click a stage above to re-activate</span>
        </div>
      )}

      {/* Sub-stage pills */}
      {subs.length > 0 && (
        <div className="substage-wrap">
          <span className="substage-label">Sub-stage</span>
          <div className="substage-pills">
            {subs.map(sub => {
              const isActive = substage === sub;
              return (
                <button
                  key={sub}
                  className={`substage-pill${isActive ? ' active' : ''}`}
                  style={isActive ? { background: sc.bg, borderColor: sc.color, color: sc.color } : {}}
                  onClick={() => onSubMove(sub)}
                >
                  {isActive && <span className="substage-dot" style={{ background: sc.color }} />}
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const SRC_LABEL_TO_KEY = {
  'Meta Ads':     'meta',
  'Google Ads':   'google',
  'Landing Page': 'lp',
  'Manual':       'manual',
};
const SRC_KEY_TO_LABEL = Object.fromEntries(
  Object.entries(SRC_LABEL_TO_KEY).map(([l, k]) => [k, l])
);

export default function LeadDetail({ leads, onLeadsChange, showToast }) {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const lead      = leads.find(l => l.id === +id);

  const [editing,     setEditing]     = useState(false);
  const [form,        setForm]        = useState(null);
  const [showDelete,  setShowDelete]  = useState(false);
  const [showReassign,setShowReassign]= useState(false);
  const [reassignTo,  setReassignTo]  = useState('');
  const [followUp,    setFollowUp]    = useState({ show: false, date: '', time: '', note: '' });

  if (!lead) {
    return (
      <div className="app-body" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--muted)', textAlign: 'center' }}>
          <p style={{ marginBottom: 12 }}>Lead not found.</p>
          <button className="tb-btn" onClick={() => navigate('/crm')}>
            <ArrowLeft size={13} strokeWidth={1.75} /> Back to CRM
          </button>
        </div>
      </div>
    );
  }

  const startEdit = () => {
    setForm({ ...lead, sourceLabel: SRC_KEY_TO_LABEL[lead.source] || 'Manual' });
    setEditing(true);
  };
  const cancelEdit = () => { setForm(null); setEditing(false); };
  const saveEdit = () => {
    const FIELD_LABELS = {
      name: 'Name', phone: 'Phone', email: 'Email',
      stage: 'Stage', substage: 'Sub-stage',
      assignee: 'Assignee', campaign: 'Campaign',
    };

    const updated = { ...lead, ...form, source: SRC_LABEL_TO_KEY[form.sourceLabel] || lead.source };
    delete updated.sourceLabel;

    const changes = [];
    if (lead.source !== updated.source)
      changes.push({ field: 'Source', before: SRC_KEY_TO_LABEL[lead.source] || lead.source, after: SRC_KEY_TO_LABEL[updated.source] || updated.source });
    Object.entries(FIELD_LABELS).forEach(([k, label]) => {
      if ((lead[k] || '') !== (updated[k] || ''))
        changes.push({ field: label, before: lead[k] || '—', after: updated[k] || '—' });
    });

    if (changes.length) {
      const now = new Date();
      const entry = {
        id: now.getTime(), type: 'lead_edit', changes,
        by: lead.assignee,
        date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        timestamp: now.getTime(),
      };
      updated.comms = [entry, ...(lead.comms || [])];
    }

    onLeadsChange(leads.map(l => l.id === lead.id ? updated : l));
    setEditing(false);
    setForm(null);
    showToast(`Lead updated${changes.length ? ` · ${changes.length} field${changes.length > 1 ? 's' : ''} changed` : ''}`, '#6C47FF');
  };

  const deleteLead = () => {
    onLeadsChange(leads.filter(l => l.id !== lead.id));
    showToast('Lead deleted', '#FF4D6D');
    navigate('/crm');
  };

  const handleCommsChange = (newComms) => {
    onLeadsChange(leads.map(l => l.id === lead.id ? { ...l, comms: newComms } : l));
  };

  const saveReassign = () => {
    if (!reassignTo) { showToast('Select a counsellor', '#FF4D6D'); return; }
    onLeadsChange(leads.map(l => l.id === lead.id ? { ...l, assignee: reassignTo } : l));
    showToast(`Reassigned to ${reassignTo}`, '#6C47FF');
    setShowReassign(false);
    setReassignTo('');
  };

  const saveFollowUp = () => {
    if (!followUp.date) { showToast('Select a date', '#FF4D6D'); return; }
    const now = new Date();
    const entry = {
      id: now.getTime(),
      type: 'followup',
      scheduledDate: followUp.date,
      scheduledTime: followUp.time,
      notes: followUp.note,
      by: lead.assignee,
      date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.getTime(),
    };
    onLeadsChange(leads.map(l => l.id === lead.id ? { ...l, comms: [entry, ...(l.comms || [])] } : l));
    showToast(`Follow-up set for ${followUp.date}${followUp.time ? ' at ' + followUp.time : ''}`, '#00D4AA');
    setFollowUp({ show: false, date: '', time: '', note: '' });
  };

  const moveStage = (newStage) => {
    if (newStage === lead.stage) return;
    const now      = new Date();
    const defaults = SUBSTAGE_CFG[newStage] || [];
    const entry    = {
      id: now.getTime(), type: 'stage_change',
      from: lead.stage, to: newStage, by: lead.assignee,
      date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.getTime(),
    };
    const updated = {
      ...lead,
      stage: newStage,
      substage: defaults[0] || '',
      comms: [entry, ...(lead.comms || [])],
    };
    onLeadsChange(leads.map(l => l.id === lead.id ? updated : l));
    showToast(`Stage → ${newStage}`, STAGE_CFG[newStage]?.color || '#6C47FF');
  };

  const moveSubstage = (newSub) => {
    if (newSub === lead.substage) return;
    const now   = new Date();
    const entry = {
      id: now.getTime(), type: 'stage_change',
      from: lead.substage || '—', to: newSub, by: lead.assignee,
      date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.getTime(),
    };
    const updated = { ...lead, substage: newSub, comms: [entry, ...(lead.comms || [])] };
    onLeadsChange(leads.map(l => l.id === lead.id ? updated : l));
    showToast(`Sub-stage → ${newSub}`, STAGE_CFG[lead.stage]?.color || '#6C47FF');
  };

  const sc   = STAGE_CFG[lead.stage]       || STAGE_CFG['Untouched'];
  const asgn = ASSIGNEE_CFG[lead.assignee] || ASSIGNEE_CFG['Priya S'];
  const src  = SRC_CFG[lead.source]        || SRC_CFG['manual'];
  const cur  = editing ? form : lead;

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="app-body">
      {/* Topbar */}
      <div className="topbar">
        <button className="tb-btn" onClick={() => navigate('/crm')}>
          <ArrowLeft size={13} strokeWidth={1.75} /> Back
        </button>
        <span className="topbar-crumb">CRM</span>
        <span className="topbar-sep">›</span>
        <span className="topbar-crumb">Leads</span>
        <span className="topbar-sep">›</span>
        <span className="topbar-page">{lead.name}</span>

        <div className="topbar-right">
          {!editing ? (
            <>
              <button className="tb-btn" onClick={() => showToast(`Calling ${lead.name}…`, '#00D4AA')}>
                <Phone size={13} strokeWidth={1.75} /> Call
              </button>
              <button className="tb-btn" onClick={() => showToast('WhatsApp opened', '#25D366')}>
                <MessageCircle size={13} strokeWidth={1.75} /> WhatsApp
              </button>
              <button className="tb-btn" onClick={() => setFollowUp(f => ({ ...f, show: true }))}>
                <Calendar size={13} strokeWidth={1.75} /> Follow-up
              </button>
              <button className="tb-btn" onClick={() => { setReassignTo(lead.assignee); setShowReassign(true); }}>
                <UserCheck size={13} strokeWidth={1.75} /> Reassign
              </button>
              <button className="tb-btn" onClick={startEdit}>
                <Edit2 size={13} strokeWidth={1.75} /> Edit
              </button>
              <button className="tb-btn" style={{ color: 'var(--red)' }} onClick={() => setShowDelete(true)}>
                <Trash2 size={13} strokeWidth={1.75} />
              </button>
            </>
          ) : (
            <>
              <button className="tb-btn" onClick={cancelEdit}>
                <X size={13} strokeWidth={1.75} /> Cancel
              </button>
              <button className="tb-btn primary" onClick={saveEdit}>
                <Save size={13} strokeWidth={1.75} /> Save
              </button>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="detail-body">

        {/* LEFT — main info */}
        <div className="detail-main">

          {/* Header card — rich */}
          <div className="detail-card detail-hero" style={{ borderLeftColor: sc.color }}>
            <div className="detail-hero-top">
              {/* Avatar */}
              <div className="detail-hero-av" style={{ background: lead.avatarColor, boxShadow: `0 0 24px ${lead.avatarColor}55` }}>
                {lead.initials}
              </div>

              {/* Main info */}
              <div className="detail-hero-info">
                {editing
                  ? <input className="form-input" value={cur.name} onChange={e => setF('name', e.target.value)} style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }} />
                  : <div className="detail-name">{lead.name}</div>
                }
                <div className="detail-hero-meta">
                  <span><Phone size={11} strokeWidth={1.75} style={{ opacity: 0.6 }} /> {lead.phone}</span>
                  <span><Mail size={11} strokeWidth={1.75} style={{ opacity: 0.6 }} /> {lead.email}</span>
                  <span><Briefcase size={11} strokeWidth={1.75} style={{ opacity: 0.6 }} /> {src.label}</span>
                  {lead.campaign && <span><MapPin size={11} strokeWidth={1.75} style={{ opacity: 0.6 }} /> {lead.campaign}</span>}
                </div>
                <div className="detail-hero-badges">
                  <span className={`badge ${sc.cls}`}><span className="b-dot" />{lead.stage}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div className="mini-av" style={{ background: asgn.color }}>{asgn.initials}</div>
                    <span style={{ fontSize: 11.5, color: 'var(--muted2)' }}>{lead.assignee}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--muted)', background: 'var(--card2)', padding: '2px 8px', borderRadius: 5 }}>
                    Added {lead.created}
                  </span>
                </div>
              </div>

              {/* Score */}
              <div className="detail-hero-score">
                <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="32" cy="32" r="26" fill="none" stroke="var(--b2)" strokeWidth="5" />
                  <circle
                    cx="32" cy="32" r="26" fill="none"
                    stroke={sc.color} strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 26}`}
                    strokeDashoffset={`${2 * Math.PI * 26 * (1 - lead.score / 100)}`}
                  />
                </svg>
                <div className="detail-score-center">
                  <span className="detail-score-num" style={{ color: sc.color }}>{lead.score}</span>
                  <span className="detail-score-lbl">AI Score</span>
                </div>
              </div>
            </div>

            {/* Stage pipeline */}
            <div className="detail-hero-pipeline">
              <div className="detail-section-title" style={{ marginBottom: 12 }}>Stage Pipeline</div>
              <StagePipeline stage={lead.stage} substage={lead.substage} onMove={moveStage} onSubMove={moveSubstage} />
            </div>
          </div>

          {/* Contact info */}
          <div className="detail-card">
            <div className="detail-section-title">Contact Information</div>
            <div className="detail-grid">
              <div className="form-group">
                <label>Phone</label>
                {editing
                  ? <input className="form-input" value={cur.phone} onChange={e => setF('phone', e.target.value)} />
                  : <div className="detail-val">{lead.phone}</div>
                }
              </div>
              <div className="form-group">
                <label>Email</label>
                {editing
                  ? <input className="form-input" value={cur.email} onChange={e => setF('email', e.target.value)} />
                  : <div className="detail-val">{lead.email}</div>
                }
              </div>
              <div className="form-group">
                <label>Stage</label>
                {editing
                  ? (
                    <select className="form-select" value={cur.stage} onChange={e => setF('stage', e.target.value)}>
                      <option>Untouched</option><option>Cold</option><option>Warm</option>
                      <option>Hot</option><option>Converted</option><option>Lost</option>
                    </select>
                  )
                  : <div className="detail-val">{lead.stage}</div>
                }
              </div>
              <div className="form-group">
                <label>Assigned To</label>
                {editing
                  ? (
                    <select className="form-select" value={cur.assignee} onChange={e => setF('assignee', e.target.value)}>
                      <option>Priya S</option><option>Arjun K</option><option>Meera R</option>
                    </select>
                  )
                  : <div className="detail-val">{lead.assignee}</div>
                }
              </div>
              <div className="form-group">
                <label>Source</label>
                {editing
                  ? (
                    <select className="form-select" value={cur.sourceLabel} onChange={e => setF('sourceLabel', e.target.value)}>
                      <option>Meta Ads</option><option>Google Ads</option><option>Landing Page</option><option>Manual</option>
                    </select>
                  )
                  : <div className="detail-val">{src.label}</div>
                }
              </div>
              <div className="form-group">
                <label>Campaign</label>
                {editing
                  ? <input className="form-input" value={cur.campaign} onChange={e => setF('campaign', e.target.value)} />
                  : <div className="detail-val">{lead.campaign}</div>
                }
              </div>
              <div className="form-group">
                <label>Created</label>
                <div className="detail-val">{lead.created}</div>
              </div>
            </div>
          </div>

          {/* Communication Log */}
          <div className="detail-card" style={{ padding: '16px' }}>
            <div className="detail-section-title" style={{ marginBottom: 14 }}>Communication Log</div>
            <CommLog lead={lead} onCommsChange={handleCommsChange} assignee={lead.assignee} />
          </div>
        </div>

        {/* RIGHT — side panel */}
        <div className="detail-side">

          <div className="detail-card">
            <div className="detail-section-title">Assigned Counsellor</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
              <div className="lead-av" style={{ background: asgn.color, width: 36, height: 36, fontSize: 12, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                {asgn.initials}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text2)', fontSize: 13 }}>{lead.assignee}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Counsellor</div>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-section-title">Last Activity</div>
            <div style={{ marginTop: 8 }}>
              <div className="act-label">{lead.actLabel}</div>
              <div className="act-time">{lead.actTime}</div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-section-title">Quick Actions</div>
            <div className="detail-actions">
              <button className="tb-btn detail-act-btn" onClick={() => showToast(`Calling ${lead.name}…`, '#00D4AA')}>
                <Phone size={13} strokeWidth={1.75} /> Call Now
              </button>
              <button className="tb-btn detail-act-btn" onClick={() => showToast('WhatsApp opened', '#25D366')}>
                <MessageCircle size={13} strokeWidth={1.75} /> WhatsApp
              </button>
              <button className="tb-btn detail-act-btn" onClick={() => showToast('Email opened', '#4D9EFF')}>
                <Mail size={13} strokeWidth={1.75} /> Send Email
              </button>
              <button className="tb-btn detail-act-btn" style={{ color: 'var(--teal)' }} onClick={() => setFollowUp(f => ({ ...f, show: true }))}>
                <Calendar size={13} strokeWidth={1.75} /> Schedule Follow-up
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* DELETE CONFIRM */}
      {showDelete && (
        <div className="overlay show" onClick={() => setShowDelete(false)}>
          <div className="modal" style={{ width: 380 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title" style={{ color: 'var(--red)' }}>Delete Lead</span>
              <span className="modal-close" onClick={() => setShowDelete(false)}><X size={18} strokeWidth={1.75} /></span>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text)', fontSize: 13, lineHeight: 1.6 }}>
                Are you sure you want to delete <b style={{ color: 'var(--white)' }}>{lead.name}</b>?
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="tb-btn" onClick={() => setShowDelete(false)}>Cancel</button>
              <button
                className="tb-btn"
                style={{ background: 'rgba(255,77,109,0.12)', border: '1px solid rgba(255,77,109,0.35)', color: 'var(--red)' }}
                onClick={deleteLead}
              >
                <Trash2 size={13} strokeWidth={1.75} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REASSIGN MODAL */}
      {showReassign && (
        <div className="overlay show" onClick={() => setShowReassign(false)}>
          <div className="modal" style={{ width: 360 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Reassign Lead</span>
              <span className="modal-close" onClick={() => setShowReassign(false)}><X size={18} strokeWidth={1.75} /></span>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 14 }}>
                Reassign <b style={{ color: 'var(--text2)' }}>{lead.name}</b> to:
              </p>
              <div className="reassign-options">
                {['Priya S', 'Arjun K', 'Meera R'].map(name => {
                  const cfg = { 'Priya S': { color: '#6C47FF', initials: 'PS' }, 'Arjun K': { color: '#00D4AA', initials: 'AK' }, 'Meera R': { color: '#A78BFA', initials: 'MR' } }[name];
                  return (
                    <div
                      key={name}
                      className={`reassign-option${reassignTo === name ? ' selected' : ''}`}
                      onClick={() => setReassignTo(name)}
                    >
                      <div className="lead-av" style={{ background: cfg.color, width: 34, height: 34, fontSize: 11, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                        {cfg.initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text2)', fontSize: 13 }}>{name}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>Counsellor</div>
                      </div>
                      {reassignTo === name && <div className="reassign-check">✓</div>}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal-footer">
              <button className="tb-btn" onClick={() => setShowReassign(false)}>Cancel</button>
              <button className="tb-btn primary" onClick={saveReassign}>
                <UserCheck size={13} strokeWidth={1.75} /> Reassign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOLLOW-UP SCHEDULER */}
      {followUp.show && (
        <div className="overlay show" onClick={() => setFollowUp(f => ({ ...f, show: false }))}>
          <div className="modal" style={{ width: 380 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Schedule Follow-up</span>
              <span className="modal-close" onClick={() => setFollowUp(f => ({ ...f, show: false }))}><X size={18} strokeWidth={1.75} /></span>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    className="form-input"
                    type="date"
                    value={followUp.date}
                    onChange={e => setFollowUp(f => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    className="form-input"
                    type="time"
                    value={followUp.time}
                    onChange={e => setFollowUp(f => ({ ...f, time: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Note</label>
                <input
                  className="form-input"
                  placeholder="Reminder note…"
                  value={followUp.note}
                  onChange={e => setFollowUp(f => ({ ...f, note: e.target.value }))}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="tb-btn" onClick={() => setFollowUp(f => ({ ...f, show: false }))}>Cancel</button>
              <button className="tb-btn primary" onClick={saveFollowUp}>
                <Calendar size={13} strokeWidth={1.75} /> Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
