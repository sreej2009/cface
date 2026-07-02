import { Phone, MessageCircle, Mail, MoreHorizontal, GraduationCap, Share2, Search, Globe, Pencil } from 'lucide-react';
import { STAGE_CFG, SRC_CFG, ASSIGNEE_CFG } from '../../data/leads';

const ICON_MAP = { Phone, MessageCircle, Mail, GraduationCap, Share2, Search, Globe, Pencil };

function SrcBadge({ source }) {
  const s = SRC_CFG[source];
  const Icon = ICON_MAP[s.icon] || Phone;
  return (
    <span className={`src ${s.cls}`} style={{ fontSize: 11 }}>
      <Icon size={11} strokeWidth={1.75} /> {s.label}
    </span>
  );
}

function StageBadge({ stage }) {
  const s = STAGE_CFG[stage];
  return (
    <span className={`badge ${s.cls}`}>
      <span className="b-dot" /> {stage}
    </span>
  );
}

export default function CardView({ leads, showToast }) {
  return (
    <div className="view-cards">
      <div className="cards-grid">
        {leads.map(l => <LeadCard key={l.id} lead={l} showToast={showToast} />)}
      </div>
    </div>
  );
}

function LeadCard({ lead: l, showToast }) {
  const sc = STAGE_CFG[l.stage];
  const asgn = ASSIGNEE_CFG[l.assignee] || ASSIGNEE_CFG['Priya S'];
  const ActIcon = l.actIcon ? ICON_MAP[l.actIcon] : null;

  return (
    <div
      className="lead-card"
      style={{ borderTopColor: sc.color }}
      onClick={() => showToast(`Opening ${l.name}'s profile…`, '#A78BFA')}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div className="lead-av" style={{ background: l.avatarColor, width: 38, height: 38, fontSize: 12, flexShrink: 0 }}>{l.initials}</div>
          <div style={{ minWidth: 0 }}>
            <div className="lead-name">{l.name}</div>
            <div className="lead-phone">{l.phone}</div>
            <div className="lead-phone">{l.email}</div>
          </div>
        </div>
        <StageBadge stage={l.stage} />
      </div>
      <div className="card-divider" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <SrcBadge source={l.source} />
        <span style={{ fontSize: 11, color: 'var(--muted2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.campaign}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div className="mini-av" style={{ background: asgn.color }}>{asgn.initials}</div>
        <span style={{ fontSize: '11.5px', color: 'var(--muted2)' }}>{l.assignee}</span>
      </div>
      <div className="card-divider" />
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Score</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: sc.color }}>{l.score}</span>
        </div>
        <div style={{ height: 3, background: 'var(--b2)', borderRadius: 3 }}>
          <div style={{ width: `${l.score}%`, height: '100%', background: sc.color, borderRadius: 3 }} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="act-label" style={{ fontSize: 11 }}>
            {ActIcon && <ActIcon size={11} strokeWidth={1.75} />} {l.actLabel}
          </div>
          <div className="act-time">{l.actTime}</div>
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          <div className="ra-btn call" style={{ width: 26, height: 26, borderRadius: 6 }} onClick={e => { e.stopPropagation(); showToast(`Calling ${l.name}...`, '#00D4AA'); }}>
            <Phone size={11} strokeWidth={1.75} /><div className="ra-tip">Call</div>
          </div>
          <div className="ra-btn wa" style={{ width: 26, height: 26, borderRadius: 6 }} onClick={e => { e.stopPropagation(); showToast('WhatsApp opened', '#25D366'); }}>
            <MessageCircle size={11} strokeWidth={1.75} /><div className="ra-tip">WhatsApp</div>
          </div>
          <div className="ra-btn" style={{ width: 26, height: 26, borderRadius: 6 }} onClick={e => { e.stopPropagation(); showToast('Email sent!', '#4D9EFF'); }}>
            <Mail size={11} strokeWidth={1.75} /><div className="ra-tip">Email</div>
          </div>
          <div className="ra-btn" style={{ width: 26, height: 26, borderRadius: 6 }} onClick={e => { e.stopPropagation(); showToast('More', '#A78BFA'); }}>
            <MoreHorizontal size={11} strokeWidth={1.75} /><div className="ra-tip">More</div>
          </div>
        </div>
      </div>
    </div>
  );
}
