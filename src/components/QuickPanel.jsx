import { Zap, X, Flame, Calendar, Inbox, Sparkles, Share2, Search, Globe, Pencil, MessageCircle, Target, CheckCircle, Phone } from 'lucide-react';

export default function QuickPanel({ open, onClose }) {
  return (
    <div className={`quick-panel${open ? ' open' : ''}`}>
      <div className="qp-header">
        <span className="qp-title">
          <Zap size={14} strokeWidth={1.75} color="var(--purple2)" /> Live Overview
        </span>
        <span className="qp-close" onClick={onClose}><X size={16} strokeWidth={1.75} /></span>
      </div>
      <div className="qp-body">
        <div className="qp-section">
          <div className="qp-slabel">Today's Action Items</div>
          <div className="qp-row">
            <div className="qp-rl"><Flame size={14} strokeWidth={1.75} color="#FF4D6D" /> Hot leads to call</div>
            <div className="qp-rr" style={{ color: '#FF4D6D' }}>12</div>
          </div>
          <div className="qp-row">
            <div className="qp-rl"><Calendar size={14} strokeWidth={1.75} color="#FF8C42" /> Follow-ups due</div>
            <div className="qp-rr" style={{ color: '#FF8C42' }}>28</div>
          </div>
          <div className="qp-row">
            <div className="qp-rl"><Inbox size={14} strokeWidth={1.75} color="#4D9EFF" /> Unread messages</div>
            <div className="qp-rr" style={{ color: '#4D9EFF' }}>7</div>
          </div>
          <div className="qp-row">
            <div className="qp-rl"><Sparkles size={14} strokeWidth={1.75} color="#00D4AA" /> New leads today</div>
            <div className="qp-rr" style={{ color: '#00D4AA' }}>43</div>
          </div>
        </div>
        <div className="qp-section">
          <div className="qp-slabel">Source Breakdown</div>
          <div className="qp-row">
            <div className="qp-rl"><Share2 size={14} strokeWidth={1.75} color="#5B9FFF" /> Meta Ads</div>
            <div className="qp-rr">61,200</div>
          </div>
          <div className="qp-row">
            <div className="qp-rl"><Search size={14} strokeWidth={1.75} color="#FF7070" /> Google Ads</div>
            <div className="qp-rr">38,450</div>
          </div>
          <div className="qp-row">
            <div className="qp-rl"><Globe size={14} strokeWidth={1.75} color="#00D4AA" /> Landing Pages</div>
            <div className="qp-rr">18,900</div>
          </div>
          <div className="qp-row">
            <div className="qp-rl"><Pencil size={14} strokeWidth={1.75} color="#A78BFA" /> Manual</div>
            <div className="qp-rr">4,639</div>
          </div>
        </div>
        <div className="qp-section">
          <div className="qp-slabel">Recent Activity</div>
          <div className="feed-item">
            <div className="feed-ic" style={{ background: 'rgba(37,211,102,0.1)' }}>
              <MessageCircle size={14} strokeWidth={1.75} color="#25D366" />
            </div>
            <div>
              <div className="feed-text">Divya Priya replied on WhatsApp</div>
              <div className="feed-time">2 min ago · Arjun K</div>
            </div>
          </div>
          <div className="feed-item">
            <div className="feed-ic" style={{ background: 'rgba(108,71,255,0.1)' }}>
              <Target size={14} strokeWidth={1.75} color="var(--purple2)" />
            </div>
            <div>
              <div className="feed-text">New lead from Medico Expo campaign</div>
              <div className="feed-time">15 min ago · Meta Ads</div>
            </div>
          </div>
          <div className="feed-item">
            <div className="feed-ic" style={{ background: 'rgba(0,212,170,0.1)' }}>
              <CheckCircle size={14} strokeWidth={1.75} color="#00D4AA" />
            </div>
            <div>
              <div className="feed-text">Meenakshi R converted to Admission</div>
              <div className="feed-time">3 hrs ago · Arjun K</div>
            </div>
          </div>
          <div className="feed-item">
            <div className="feed-ic" style={{ background: 'rgba(255,140,66,0.1)' }}>
              <Phone size={14} strokeWidth={1.75} color="#FF8C42" />
            </div>
            <div>
              <div className="feed-text">Follow-up logged for Arun Kumar</div>
              <div className="feed-time">2 hrs ago · Priya S</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
