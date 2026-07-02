import { useState } from 'react';
import { Target, Circle, Snowflake, Thermometer, Flame, CheckCircle, XCircle } from 'lucide-react';

const STATS = [
  { label: 'All Leads',  val: '1,23,189', icon: Target,      color: 'var(--purple2)', bg: 'rgba(108,71,255,0.15)' },
  { label: 'Untouched',  val: '1,16,166', icon: Circle,      color: '#7A82A8',         bg: 'rgba(90,96,128,0.15)'  },
  { label: 'Cold',       val: '1,883',    icon: Snowflake,   color: '#4D9EFF',         bg: 'rgba(77,158,255,0.15)' },
  { label: 'Warm',       val: '1,867',    icon: Thermometer, color: '#FF8C42',         bg: 'rgba(255,140,66,0.15)' },
  { label: 'Hot',        val: '316',      icon: Flame,       color: '#FF4D6D',         bg: 'rgba(255,77,109,0.15)' },
  { label: 'Converted',  val: '34',       icon: CheckCircle, color: '#00D4AA',         bg: 'rgba(0,212,170,0.15)'  },
  { label: 'Lost',       val: '1,317',    icon: XCircle,     color: '#FF7A9A',         bg: 'rgba(255,77,109,0.1)'  },
];

export default function StatStrip() {
  const [active, setActive] = useState(0);

  return (
    <div className="stat-strip">
      {STATS.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className={`stat-chip${active === i ? ' active' : ''}`} onClick={() => setActive(i)}>
            <div className="stat-ic" style={{ background: s.bg }}>
              <Icon size={17} strokeWidth={1.75} color={s.color} />
            </div>
            <div>
              <div className="stat-val" style={active !== i ? { color: s.color } : {}}>{s.val}</div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
