import { useState, useMemo } from 'react';
import { X, UserCheck } from 'lucide-react';
import Topbar from '../components/Topbar';
import StatStrip from '../components/StatStrip';
import Toolbar from '../components/Toolbar';
import LeadsTable from '../components/crm/LeadsTable';
import KanbanView from '../components/crm/KanbanView';
import CardView from '../components/crm/CardView';
import QuickPanel from '../components/QuickPanel';
import AddLeadModal from '../components/AddLeadModal';
import AdvancedFilter from '../components/AdvancedFilter';

function evalCondition(lead, { field, operator, value }) {
  const lv = String(lead[field] ?? '');
  const v  = String(value);
  switch (operator) {
    case 'contains':     return lv.toLowerCase().includes(v.toLowerCase());
    case 'not_contains': return !lv.toLowerCase().includes(v.toLowerCase());
    case 'equals':       return lv.toLowerCase() === v.toLowerCase();
    case 'starts_with':  return lv.toLowerCase().startsWith(v.toLowerCase());
    case 'is':           return lead[field] === value;
    case 'is_not':       return lead[field] !== value;
    case 'gt':           return +lead[field] > +v;
    case 'lt':           return +lead[field] < +v;
    case 'eq':           return +lead[field] === +v;
    case 'gte':          return +lead[field] >= +v;
    case 'lte':          return +lead[field] <= +v;
    default:             return true;
  }
}

const COUNSELLORS = [
  { name: 'Priya S',  color: '#6C47FF', initials: 'PS' },
  { name: 'Arjun K',  color: '#00D4AA', initials: 'AK' },
  { name: 'Meera R',  color: '#A78BFA', initials: 'MR' },
];

export default function CRM({ leads, onLeadsChange, showToast }) {
  const [view,        setView]        = useState('list');
  const [search,      setSearch]      = useState('');
  const [filters,     setFilters]     = useState({ stage: '', source: '', assignee: '' });
  const [page,        setPage]        = useState(1);
  const [pageSize,    setPageSize]    = useState(25);
  const [panelOpen,      setPanelOpen]      = useState(true);
  const [modalOpen,      setModalOpen]      = useState(false);
  const [selectedIds,    setSelectedIds]    = useState(new Set());
  const [reassignModal,  setReassignModal]  = useState(false);
  const [reassignTarget, setReassignTarget] = useState('');
  const [advFilter,      setAdvFilter]      = useState(null);
  const [advFilterOpen,  setAdvFilterOpen]  = useState(false);

  const handleFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value }));
    setPage(1);
  };

  const handleSearch = (val) => { setSearch(val); setPage(1); };

  const filtered = useMemo(() => leads.filter(l => {
    // Simple toolbar filters
    if (search) {
      const q = search.toLowerCase();
      if (!l.name.toLowerCase().includes(q) && !l.phone.includes(q) && !l.email.toLowerCase().includes(q)) return false;
    }
    if (filters.stage    && l.stage    !== filters.stage)    return false;
    if (filters.source   && l.source   !== filters.source)   return false;
    if (filters.assignee && l.assignee !== filters.assignee) return false;
    // Advanced filter
    if (advFilter?.conditions?.length) {
      const results = advFilter.conditions.map(c => evalCondition(l, c));
      const pass = advFilter.logic === 'AND' ? results.every(Boolean) : results.some(Boolean);
      if (!pass) return false;
    }
    return true;
  }), [leads, search, filters, advFilter]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  );

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = (checked) => {
    setSelectedIds(checked ? new Set(paginated.map(l => l.id)) : new Set());
  };

  const handleBulkDelete = () => {
    onLeadsChange(leads.filter(l => !selectedIds.has(l.id)));
    showToast(`${selectedIds.size} lead(s) deleted`, '#FF4D6D');
    setSelectedIds(new Set());
  };

  const handleBulkAssign = () => {
    setReassignTarget('');
    setReassignModal(true);
  };

  const saveBulkAssign = () => {
    if (!reassignTarget) { showToast('Select a counsellor', '#FF4D6D'); return; }
    onLeadsChange(leads.map(l => selectedIds.has(l.id) ? { ...l, assignee: reassignTarget } : l));
    showToast(`${selectedIds.size} lead(s) assigned to ${reassignTarget}`, '#6C47FF');
    setReassignModal(false);
    setSelectedIds(new Set());
  };

  const handleSave = (lead, msgOrWA) => {
    if (!lead) { showToast(msgOrWA, '#FF4D6D'); return; }
    onLeadsChange([lead, ...leads]);
    setModalOpen(false);
    showToast(msgOrWA === true ? 'Lead added & WhatsApp sent!' : 'Lead added!', msgOrWA === true ? '#25D366' : '#6C47FF');
  };

  return (
    <>
      <div className="app-body">
        <Topbar
          onAddLead={() => setModalOpen(true)}
          onTogglePanel={() => setPanelOpen(o => !o)}
          showToast={showToast}
        />
        <div className="body-split">
          <div className="main-content">
            <StatStrip leads={leads} />
            <Toolbar
              view={view}
              onView={setView}
              search={search}
              onSearch={handleSearch}
              filters={filters}
              onFilter={handleFilter}
              selectedCount={selectedIds.size}
              onClearSelection={() => setSelectedIds(new Set())}
              onBulkDelete={handleBulkDelete}
              onBulkAssign={handleBulkAssign}
              advFilterActive={!!advFilter}
              onAdvFilter={() => setAdvFilterOpen(true)}
              showToast={showToast}
            />
            {view === 'list' && (
              <LeadsTable
                leads={paginated}
                totalCount={filtered.length}
                page={page}
                pageSize={pageSize}
                onPage={setPage}
                onPageSize={setPageSize}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onToggleAll={toggleAll}
                showToast={showToast}
              />
            )}
            {view === 'kanban' && (
              <KanbanView
                leads={filtered}
                onLeadsChange={onLeadsChange}
                showToast={showToast}
              />
            )}
            {view === 'cards' && (
              <CardView leads={filtered} showToast={showToast} />
            )}
          </div>
          <QuickPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
        </div>
      </div>

      <AddLeadModal show={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} />

      <AdvancedFilter
        show={advFilterOpen}
        onClose={() => setAdvFilterOpen(false)}
        onApply={f => { setAdvFilter(f); setPage(1); }}
        activeFilter={advFilter}
      />

      {/* BULK REASSIGN MODAL */}
      {reassignModal && (
        <div className="overlay show" onClick={() => setReassignModal(false)}>
          <div className="modal" style={{ width: 360 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Reassign {selectedIds.size} Lead{selectedIds.size > 1 ? 's' : ''}</span>
              <span className="modal-close" onClick={() => setReassignModal(false)}><X size={18} strokeWidth={1.75} /></span>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 14 }}>
                Assign selected leads to:
              </p>
              <div className="reassign-options">
                {COUNSELLORS.map(c => (
                  <div
                    key={c.name}
                    className={`reassign-option${reassignTarget === c.name ? ' selected' : ''}`}
                    onClick={() => setReassignTarget(c.name)}
                  >
                    <div className="lead-av" style={{ background: c.color, width: 34, height: 34, fontSize: 11, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                      {c.initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text2)', fontSize: 13 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>Counsellor</div>
                    </div>
                    {reassignTarget === c.name && <div className="reassign-check">✓</div>}
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="tb-btn" onClick={() => setReassignModal(false)}>Cancel</button>
              <button className="tb-btn primary" onClick={saveBulkAssign}>
                <UserCheck size={13} strokeWidth={1.75} /> Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
