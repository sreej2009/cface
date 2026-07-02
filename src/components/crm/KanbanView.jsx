import { useState, useRef } from 'react';
import { Phone, MessageCircle, Mail, MoreHorizontal, GraduationCap, Plus, Share2, Search, Globe, Pencil } from 'lucide-react';
import { STAGE_CFG, SRC_CFG, ASSIGNEE_CFG } from '../../data/leads';

const ICON_MAP = { Phone, MessageCircle, Mail, GraduationCap, Share2, Search, Globe, Pencil };
const STAGES = ['Untouched', 'Cold', 'Warm', 'Hot', 'Converted', 'Lost'];

function SrcBadge({ source }) {
  const s = SRC_CFG[source];
  const Icon = ICON_MAP[s.icon] || Phone;
  return (
    <span className={`src ${s.cls}`} style={{ fontSize: 11 }}>
      <Icon size={11} strokeWidth={1.75} /> {s.label}
    </span>
  );
}

export default function KanbanView({ leads, onLeadsChange, showToast }) {
  const [dragOverStage, setDragOverStage] = useState(null);
  const dragId = useRef(null);

  const onDragStart = (e, id) => {
    dragId.current = id;
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      const el = document.getElementById(`kcard-${id}`);
      if (el) el.classList.add('dragging');
    }, 0);
  };

  const onDragEnd = () => {
    if (dragId.current !== null) {
      const el = document.getElementById(`kcard-${dragId.current}`);
      if (el) el.classList.remove('dragging');
    }
    setDragOverStage(null);
  };

  const onDragOver = (e, stage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const onDragLeave = (e, stage) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverStage(prev => (prev === stage ? null : prev));
    }
  };

  const onDrop = (e, stage) => {
    e.preventDefault();
    setDragOverStage(null);
    if (dragId.current === null) return;
    const id = dragId.current;
    const lead = leads.find(l => l.id === id);
    if (lead && lead.stage !== stage) {
      onLeadsChange(leads.map(l => l.id === id ? { ...l, stage } : l));
      showToast(`${lead.name} → ${stage}`, STAGE_CFG[stage].color);
    }
    dragId.current = null;
  };

  return (
    <div className="view-kanban">
      {STAGES.map(stage => {
        const sc = STAGE_CFG[stage];
        const cols = leads.filter(l => l.stage === stage);
        return (
          <div
            key={stage}
            className={`kanban-col${dragOverStage === stage ? ' drag-over' : ''}`}
            onDragOver={e => onDragOver(e, stage)}
            onDragLeave={e => onDragLeave(e, stage)}
            onDrop={e => onDrop(e, stage)}
          >
            <div className="kanban-col-header" style={{ borderTop: `2px solid ${sc.color}` }}>
              <div className="kanban-col-title">
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: sc.color, display: 'inline-block', flexShrink: 0 }} />
                {stage}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span className="kanban-col-count">{cols.length}</span>
                <div className="ra-btn" style={{ width: 22, height: 22, borderRadius: 5 }} onClick={() => showToast(`Add to ${stage}`, sc.color)}>
                  <Plus size={12} strokeWidth={1.75} />
                </div>
              </div>
            </div>
            <div className="kanban-cards">
              {cols.map(l => <KanbanCard key={l.id} lead={l} onDragStart={onDragStart} onDragEnd={onDragEnd} showToast={showToast} />)}
              {cols.length === 0 && <div className="kanban-empty">Drop here</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KanbanCard({ lead: l, onDragStart, onDragEnd, showToast }) {
  const sc = STAGE_CFG[l.stage];
  const asgn = ASSIGNEE_CFG[l.assignee] || ASSIGNEE_CFG['Priya S'];
  return (
    <div
      id={`kcard-${l.id}`}
      className="kanban-card"
      draggable
      onDragStart={e => onDragStart(e, l.id)}
      onDragEnd={onDragEnd}
      onClick={() => showToast(`Opening ${l.name}'s profile…`, '#A78BFA')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
        <div className="lead-av" style={{ background: l.avatarColor, width: 30, height: 30, fontSize: 10, flexShrink: 0 }}>{l.initials}</div>
        <div style={{ minWidth: 0 }}>
          <div className="lead-name" style={{ fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
          <div className="lead-phone" style={{ fontSize: '10.5px' }}>{l.phone}</div>
        </div>
      </div>
      <div style={{ marginBottom: 7 }}><SrcBadge source={l.source} /></div>
      <div style={{ fontSize: '10.5px', color: 'var(--muted2)', marginBottom: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.campaign}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div className="mini-av" style={{ background: asgn.color, width: 20, height: 20, fontSize: 8 }}>{asgn.initials}</div>
          <span className="kanban-score" style={{ color: sc.color, background: sc.bg }}>{l.score}</span>
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          <div className="ra-btn call" style={{ width: 24, height: 24, borderRadius: 6 }} onClick={e => { e.stopPropagation(); showToast(`Calling ${l.name}...`, '#00D4AA'); }}>
            <Phone size={9} strokeWidth={1.75} /><div className="ra-tip">Call</div>
          </div>
          <div className="ra-btn wa" style={{ width: 24, height: 24, borderRadius: 6 }} onClick={e => { e.stopPropagation(); showToast('WhatsApp opened', '#25D366'); }}>
            <MessageCircle size={9} strokeWidth={1.75} /><div className="ra-tip">WhatsApp</div>
          </div>
          <div className="ra-btn" style={{ width: 24, height: 24, borderRadius: 6 }} onClick={e => { e.stopPropagation(); showToast('Email sent!', '#4D9EFF'); }}>
            <Mail size={9} strokeWidth={1.75} /><div className="ra-tip">Email</div>
          </div>
          <div className="ra-btn" style={{ width: 24, height: 24, borderRadius: 6 }} onClick={e => { e.stopPropagation(); showToast('More', '#A78BFA'); }}>
            <MoreHorizontal size={9} strokeWidth={1.75} /><div className="ra-tip">More</div>
          </div>
        </div>
      </div>
    </div>
  );
}
