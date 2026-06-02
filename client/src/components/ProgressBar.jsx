import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setVisible(true);
    setProgress(20);
    const t1 = setTimeout(() => setProgress(60), 100);
    const t2 = setTimeout(() => setProgress(90), 300);
    const t3 = setTimeout(() => { setProgress(100); }, 500);
    const t4 = setTimeout(() => { setVisible(false); setProgress(0); }, 700);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, [location]);

  if (!visible) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, height: 3 }}>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #22d3ee)',
        transition: 'width 0.3s ease',
        boxShadow: '0 0 8px rgba(99,102,241,0.8)',
      }} />
    </div>
  );
}
