import { useNavigate } from 'react-router-dom';
import { Phone, MessageCircle, Mail, MoreHorizontal, GraduationCap } from 'lucide-react';
import { STAGE_CFG, SRC_CFG, ASSIGNEE_CFG } from '../../data/leads';

const ICON_MAP = { Phone, MessageCircle, Mail, GraduationCap };

function ScoreRing({ score, color }) {
  const r = 13, c = +(2 * Math.PI * r).toFixed(1);
  const off = +(c * (1 - score / 100)).toFixed(1);
  return (
    <div className="score-ring">
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle className="track" cx="16" cy="16" r={r} strokeDasharray={c} />
        <circle className="fill" cx="16" cy="16" r={r} stroke={color} strokeDasharray={c} strokeDashoffset={off} />
      </svg>
      <div className="score-num2">{score}</div>
    </div>
  );
}

function SrcBadge({ source }) {
  const s = SRC_CFG[source] || SRC_CFG['manual'];
  const Icon = ICON_MAP[s.icon] || Phone;
  return (
    <span className={`src ${s.cls}`}>
      <Icon size={12} strokeWidth={1.75} /> {s.label}
    </span>
  );
}

function StageBadge({ stage }) {
  const s = STAGE_CFG[stage] || STAGE_CFG['Untouched'];
  return (
    <span className={`badge ${s.cls}`}>
      <span className="b-dot" /> {stage}
    </span>
  );
}

function RowActions({ lead, showToast }) {
  return (
    <div className="row-acts">
      <div className="ra-btn call" onClick={e => { e.stopPropagation(); showToast(`Calling ${lead.name}…`, '#00D4AA'); }}>
        <Phone size={13} strokeWidth={1.75} /><div className="ra-tip">Call</div>
      </div>
      <div className="ra-btn wa" onClick={e => { e.stopPropagation(); showToast('WhatsApp opened', '#25D366'); }}>
        <MessageCircle size={13} strokeWidth={1.75} /><div className="ra-tip">WhatsApp</div>
      </div>
      <div className="ra-btn" onClick={e => { e.stopPropagation(); showToast('Email sent!', '#4D9EFF'); }}>
        <Mail size={13} strokeWidth={1.75} /><div className="ra-tip">Email</div>
      </div>
      <div className="ra-btn" onClick={e => { e.stopPropagation(); showToast('More options', '#A78BFA'); }}>
        <MoreHorizontal size={13} strokeWidth={1.75} /><div className="ra-tip">More</div>
      </div>
    </div>
  );
}

export default function LeadsTable({
  leads,
  totalCount,
  page,
  pageSize,
  onPage,
  onPageSize,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  showToast,
}) {
  const navigate   = useNavigate();
  const allChecked = leads.length > 0 && selectedIds.size === leads.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start      = (page - 1) * pageSize + 1;
  const end        = Math.min(page * pageSize, totalCount);

  const pageNums = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, '…', totalPages];
    if (page >= totalPages - 2) return [1, '…', totalPages - 2, totalPages - 1, totalPages];
    return [1, '…', page - 1, page, page + 1, '…', totalPages];
  };

  return (
    <div className="view-list">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: 36 }}>
                <input type="checkbox" checked={allChecked} onChange={e => onToggleAll(e.target.checked)} />
              </th>
              <th className="sort-asc">Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Stage</th>
              <th>Source</th>
              <th>Campaign</th>
              <th>Assigned To</th>
              <th>AI Score</th>
              <th>Last Activity</th>
              <th>Created</th>
              <th style={{ width: 106, cursor: 'default' }}></th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--muted)' }}>
                  No leads found
                </td>
              </tr>
            ) : leads.map(l => {
              const sc   = STAGE_CFG[l.stage] || STAGE_CFG['Untouched'];
              const asgn = ASSIGNEE_CFG[l.assignee] || ASSIGNEE_CFG['Priya S'];
              const ActIcon = l.actIcon ? ICON_MAP[l.actIcon] : null;
              return (
                <tr key={l.id} onClick={() => navigate(`/crm/leads/${l.id}`)}>
                  <td onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedIds.has(l.id)} onChange={() => onToggleSelect(l.id)} />
                  </td>
                  <td>
                    <div className="lead-cell">
                      <div className="lead-av" style={{ background: l.avatarColor }}>{l.initials}</div>
                      <div className="lead-name">{l.name}</div>
                    </div>
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--text2)', whiteSpace: 'nowrap' }}>{l.phone}</td>
                  <td style={{ fontSize: 12, color: 'var(--muted2)' }}>{l.email}</td>
                  <td>
                    <StageBadge stage={l.stage} />
                    {l.substage && (
                      <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 3, paddingLeft: 2 }}>
                        {l.substage}
                      </div>
                    )}
                  </td>
                  <td><SrcBadge source={l.source} /></td>
                  <td style={{ color: 'var(--muted2)', fontSize: 12 }}>{l.campaign}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div className="mini-av" style={{ background: asgn.color }}>{asgn.initials}</div>
                      <span style={{ fontSize: 12 }}>{l.assignee}</span>
                    </div>
                  </td>
                  <td><ScoreRing score={l.score} color={sc.color} /></td>
                  <td>
                    <div className="act-label">
                      {ActIcon && <ActIcon size={12} strokeWidth={1.75} />} {l.actLabel}
                    </div>
                    <div className="act-time">{l.actTime}</div>
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: 12 }}>{l.created}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <RowActions lead={l} showToast={showToast} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Real Pagination */}
        <div className="pagination">
          <div className="pg-size">
            Show{' '}
            <select value={pageSize} onChange={e => { onPageSize(+e.target.value); onPage(1); }}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>{' '}
            per page
          </div>
          <div className="pg-info">
            {totalCount === 0
              ? 'No results'
              : <>Showing <b>{start}–{end}</b> of <b>{totalCount}</b> leads</>
            }
          </div>
          <div className="pg-controls">
            <button className="pg-btn" disabled={page === 1} onClick={() => onPage(page - 1)}>‹</button>
            {pageNums().map((n, i) =>
              n === '…'
                ? <span key={i} className="pg-ellipsis">…</span>
                : <button key={n} className={`pg-btn${page === n ? ' active' : ''}`} onClick={() => onPage(n)}>{n}</button>
            )}
            <button className="pg-btn" disabled={page === totalPages} onClick={() => onPage(page + 1)}>›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
