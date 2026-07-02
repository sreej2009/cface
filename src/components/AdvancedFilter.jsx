import { useState } from 'react';
import { Plus, X, Save, SlidersHorizontal } from 'lucide-react';

const FIELDS = {
  name:     { label: 'Name',       type: 'text',   operators: ['contains', 'not_contains', 'equals', 'starts_with'] },
  phone:    { label: 'Phone',      type: 'text',   operators: ['contains', 'equals'] },
  email:    { label: 'Email',      type: 'text',   operators: ['contains', 'equals'] },
  stage:    { label: 'Stage',      type: 'select', operators: ['is', 'is_not'],
              options: ['Untouched', 'Cold', 'Warm', 'Hot', 'Converted', 'Lost'] },
  source:   { label: 'Source',     type: 'select', operators: ['is', 'is_not'],
              options: [['meta','Meta Ads'],['google','Google Ads'],['lp','Landing Page'],['manual','Manual']] },
  assignee: { label: 'Counsellor', type: 'select', operators: ['is', 'is_not'],
              options: ['Priya S', 'Arjun K', 'Meera R'] },
  score:    { label: 'AI Score',   type: 'number', operators: ['gt', 'lt', 'eq', 'gte', 'lte'] },
  campaign: { label: 'Campaign',   type: 'text',   operators: ['contains', 'equals'] },
};

const OP_LABELS = {
  contains: 'contains', not_contains: 'does not contain',
  equals: 'equals',     starts_with: 'starts with',
  is: 'is',             is_not: 'is not',
  gt: '> greater than', lt: '< less than',
  eq: '= equals',       gte: '≥ at least',
  lte: '≤ at most',
};

const SAVED_KEY = 'cface_saved_filters';

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY)) || []; } catch { return []; }
}

function defaultValue(field) {
  const f = FIELDS[field];
  if (f.type === 'select') {
    const opt = f.options[0];
    return Array.isArray(opt) ? opt[0] : opt;
  }
  return '';
}

function newCondition() {
  return { id: Date.now() + Math.random(), field: 'stage', operator: 'is', value: 'Warm' };
}

export default function AdvancedFilter({ show, onClose, onApply, activeFilter }) {
  const [logic,      setLogic]      = useState(activeFilter?.logic || 'AND');
  const [conditions, setConditions] = useState(
    activeFilter?.conditions?.length ? activeFilter.conditions : [newCondition()]
  );
  const [saved,      setSaved]      = useState(loadSaved);
  const [showSave,   setShowSave]   = useState(false);
  const [saveName,   setSaveName]   = useState('');

  if (!show) return null;

  const addCondition = () =>
    setConditions(cs => [...cs, newCondition()]);

  const removeCondition = (id) =>
    setConditions(cs => cs.filter(c => c.id !== id));

  const updateCondition = (id, key, value) => {
    setConditions(cs => cs.map(c => {
      if (c.id !== id) return c;
      if (key === 'field') {
        const f = FIELDS[value];
        return { ...c, field: value, operator: f.operators[0], value: defaultValue(value) };
      }
      return { ...c, [key]: value };
    }));
  };

  const handleApply = () => {
    const valid = conditions.filter(c => String(c.value).trim() !== '');
    onApply(valid.length ? { logic, conditions: valid } : null);
    onClose();
  };

  const handleClear = () => { onApply(null); onClose(); };

  const handleSave = () => {
    if (!saveName.trim()) return;
    const entry = { id: Date.now(), name: saveName.trim(), logic, conditions };
    const next  = [entry, ...saved];
    setSaved(next);
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    setSaveName('');
    setShowSave(false);
  };

  const loadFilter = (f) => { setLogic(f.logic); setConditions(f.conditions); };

  const deleteSaved = (id) => {
    const next = saved.filter(s => s.id !== id);
    setSaved(next);
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  };

  return (
    <div className="overlay show" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal af-modal" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <span className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SlidersHorizontal size={15} strokeWidth={1.75} style={{ color: 'var(--purple2)' }} />
            Advanced Filter
          </span>
          <span className="modal-close" onClick={onClose}><X size={18} strokeWidth={1.75} /></span>
        </div>

        <div className="modal-body" style={{ gap: 0, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Saved filters */}
          {saved.length > 0 && (
            <div>
              <div className="af-label">Saved Filters</div>
              <div className="af-saved-list">
                {saved.map(s => (
                  <div key={s.id} className="af-saved-chip">
                    <span onClick={() => loadFilter(s)}>{s.name}</span>
                    <button className="af-saved-del" onClick={() => deleteSaved(s.id)}>
                      <X size={9} strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AND / OR logic toggle */}
          <div className="af-logic-row">
            <span className="af-label" style={{ marginBottom: 0 }}>Match</span>
            <div className="af-logic-toggle">
              <button className={`af-logic-btn${logic === 'AND' ? ' active' : ''}`} onClick={() => setLogic('AND')}>
                ALL &nbsp;<span style={{ opacity: 0.6, fontSize: 10 }}>(AND)</span>
              </button>
              <button className={`af-logic-btn${logic === 'OR' ? ' active' : ''}`} onClick={() => setLogic('OR')}>
                ANY &nbsp;<span style={{ opacity: 0.6, fontSize: 10 }}>(OR)</span>
              </button>
            </div>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>of the following conditions</span>
          </div>

          {/* Conditions list */}
          <div className="af-conditions">
            {conditions.map((cond, idx) => {
              const fieldCfg = FIELDS[cond.field];
              return (
                <div key={cond.id} className="af-row">
                  {/* AND / OR badge between rows */}
                  {idx > 0 && (
                    <div className="af-between-badge">{logic}</div>
                  )}
                  <div className="af-row-inner">
                    {/* Field */}
                    <select
                      className="form-select af-sel"
                      value={cond.field}
                      onChange={e => updateCondition(cond.id, 'field', e.target.value)}
                    >
                      {Object.entries(FIELDS).map(([k, f]) => (
                        <option key={k} value={k}>{f.label}</option>
                      ))}
                    </select>

                    {/* Operator */}
                    <select
                      className="form-select af-sel"
                      value={cond.operator}
                      onChange={e => updateCondition(cond.id, 'operator', e.target.value)}
                    >
                      {fieldCfg.operators.map(op => (
                        <option key={op} value={op}>{OP_LABELS[op]}</option>
                      ))}
                    </select>

                    {/* Value */}
                    {fieldCfg.type === 'select' ? (
                      <select
                        className="form-select af-sel"
                        value={cond.value}
                        onChange={e => updateCondition(cond.id, 'value', e.target.value)}
                      >
                        {fieldCfg.options.map(opt =>
                          Array.isArray(opt)
                            ? <option key={opt[0]} value={opt[0]}>{opt[1]}</option>
                            : <option key={opt} value={opt}>{opt}</option>
                        )}
                      </select>
                    ) : (
                      <input
                        className="form-input af-input"
                        type={fieldCfg.type === 'number' ? 'number' : 'text'}
                        placeholder="Value…"
                        value={cond.value}
                        onChange={e => updateCondition(cond.id, 'value', e.target.value)}
                      />
                    )}

                    {/* Remove */}
                    <button
                      className="af-remove"
                      onClick={() => removeCondition(cond.id)}
                      disabled={conditions.length === 1}
                      title="Remove"
                    >
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add condition */}
          <button className="af-add-btn" onClick={addCondition}>
            <Plus size={13} strokeWidth={1.75} /> Add Condition
          </button>

          {/* Save filter */}
          {showSave ? (
            <div className="af-save-row">
              <input
                className="form-input"
                placeholder="Filter name (e.g. Hot Meta Leads)…"
                value={saveName}
                onChange={e => setSaveName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                autoFocus
                style={{ flex: 1 }}
              />
              <button className="tb-btn primary" onClick={handleSave}>
                <Save size={12} strokeWidth={1.75} /> Save
              </button>
              <button className="tb-btn" onClick={() => { setShowSave(false); setSaveName(''); }}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="af-add-btn" style={{ color: 'var(--teal)' }} onClick={() => setShowSave(true)}>
              <Save size={13} strokeWidth={1.75} /> Save this filter…
            </button>
          )}
        </div>

        <div className="modal-footer">
          <button className="tb-btn" onClick={handleClear} style={{ marginRight: 'auto', color: 'var(--red)' }}>
            Clear All
          </button>
          <button className="tb-btn" onClick={onClose}>Cancel</button>
          <button className="tb-btn primary" onClick={handleApply}>
            <SlidersHorizontal size={13} strokeWidth={1.75} /> Apply
          </button>
        </div>
      </div>
    </div>
  );
}
