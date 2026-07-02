import { useState, useRef } from 'react';

export function useToast() {
  const [toast, setToast] = useState({ show: false, msg: '', color: '#6C47FF' });
  const timer = useRef(null);

  const showToast = (msg, color = '#6C47FF') => {
    clearTimeout(timer.current);
    setToast({ show: true, msg, color });
    timer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
  };

  return { toast, showToast };
}
