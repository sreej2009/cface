import { Search, Layers, Radio, User, Calendar, UserPlus, Tag, MessageCircle, Trash2, List, Kanban, LayoutGrid, SlidersHorizontal } from 'lucide-react';

export default function Toolbar({
  view, onView,
  search, onSearch,
  filters, onFilter,
  selectedCount, onClearSelection,
  onBulkDelete, onBulkAssign,
  advFilterActive, onAdvFilter,
  showToast,
}) {
  const hasBulk = selectedCount > 0;

  return (
    <div className="toolbar">
      <div className="search-wrap">
        <Search size={13} strokeWidth={1.75} color="var(--muted)" />
        <input
          type="text"
          placeholder="Search name, phone, email…"
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
      </div>

      <div className={`flt${filters.stage ? ' active' : ''}`}>
        <Layers size={13} strokeWidth={1.75} />
        <select value={filters.stage} onChange={e => onFilter('stage', e.target.value)}>
          <option value="">Stage</option>
          <option>Untouched</option><option>Cold</option><option>Warm</option>
          <option>Hot</option><option>Converted</option><option>Lost</option>
        </select>
      </div>

      <div className={`flt${filters.source ? ' active' : ''}`}>
        <Radio size={13} strokeWidth={1.75} />
        <select value={filters.source} onChange={e => onFilter('source', e.target.value)}>
          <option value="">Source</option>
          <option value="meta">Meta Ads</option>
          <option value="google">Google Ads</option>
          <option value="lp">Landing Page</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      <div className={`flt${filters.assignee ? ' active' : ''}`}>
        <User size={13} strokeWidth={1.75} />
        <select value={filters.assignee} onChange={e => onFilter('assignee', e.target.value)}>
          <option value="">Counsellor</option>
          <option>Priya S</option><option>Arjun K</option><option>Meera R</option>
        </select>
      </div>

      <div className="flt">
        <Calendar size={13} strokeWidth={1.75} />
        <select>
          <option>This Week</option><option>Today</option><option>This Month</option><option>Last 3 Months</option>
        </select>
      </div>

      {hasBulk && (
        <div className="bulk-bar show">
          <span className="bulk-count">{selectedCount} selected</span>
          <button className="tb-btn" onClick={() => onBulkAssign?.()}>
            <UserPlus size={13} strokeWidth={1.75} /> Assign
          </button>
          <button className="tb-btn" onClick={() => showToast('Tagged!', '#A78BFA')}>
            <Tag size={13} strokeWidth={1.75} /> Tag
          </button>
          <button className="tb-btn" onClick={() => showToast('Message sent!', '#25D366')}>
            <MessageCircle size={13} strokeWidth={1.75} /> Message
          </button>
          <button className="tb-btn" style={{ color: 'var(--red)' }} onClick={() => { onBulkDelete?.(); onClearSelection(); }}>
            <Trash2 size={13} strokeWidth={1.75} />
          </button>
        </div>
      )}

      <div className="toolbar-right">
        <button
          className={`tb-btn${advFilterActive ? ' adv-filter-active' : ''}`}
          onClick={onAdvFilter}
          title="Advanced Filter"
        >
          <SlidersHorizontal size={13} strokeWidth={1.75} />
          Filter
          {advFilterActive && <span className="adv-filter-dot" />}
        </button>
        <div className="view-grp">
          <button className={`view-btn${view === 'list' ? ' active' : ''}`} title="List" onClick={() => onView('list')}>
            <List size={14} strokeWidth={1.75} />
          </button>
          <button className={`view-btn${view === 'kanban' ? ' active' : ''}`} title="Kanban" onClick={() => onView('kanban')}>
            <Kanban size={14} strokeWidth={1.75} />
          </button>
          <button className={`view-btn${view === 'cards' ? ' active' : ''}`} title="Cards" onClick={() => onView('cards')}>
            <LayoutGrid size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
