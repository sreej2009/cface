export default function Toast({ show, msg, color }) {
  return (
    <div className={`toast${show ? ' show' : ''}`}>
      <div className="toast-dot" style={{ background: color }} />
      <span>{msg}</span>
    </div>
  );
}
