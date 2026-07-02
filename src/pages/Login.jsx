import { useState } from 'react';
import { LogIn } from 'lucide-react';

const USERS = [
  { email: 'admin@cface.in',  password: 'admin123', name: 'Admin',   role: 'Admin',      initials: 'AD' },
  { email: 'priya@cface.in',  password: 'priya123', name: 'Priya S', role: 'Counsellor', initials: 'PS' },
  { email: 'arjun@cface.in',  password: 'arjun123', name: 'Arjun K', role: 'Counsellor', initials: 'AK' },
];

export default function Login({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = USERS.find(u => u.email === email && u.password === password);
      if (user) {
        onLogin({ email: user.email, name: user.name, role: user.role, initials: user.initials });
      } else {
        setError('Invalid email or password');
        setLoading(false);
      }
    }, 600);
  };

  const fillDemo = () => { setEmail('admin@cface.in'); setPassword('admin123'); setError(''); };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">C</div>
          <span className="login-brand">CFACE ERP</span>
        </div>

        <h2 className="login-title">Welcome back</h2>
        <p className="login-sub">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="admin@cface.in"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            <LogIn size={14} strokeWidth={1.75} />
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <button className="login-hint-btn" onClick={fillDemo} type="button">
          Use demo credentials: admin@cface.in / admin123
        </button>
      </div>
    </div>
  );
}
