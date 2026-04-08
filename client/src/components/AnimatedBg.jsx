import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Floating 3D orbs that follow a slow sine path
function Orb({ style, delay = 0, size = 400, color = '99,102,241' }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        background: `radial-gradient(circle at 40% 40%, rgba(${color},0.12) 0%, rgba(${color},0.04) 50%, transparent 70%)`,
        filter: 'blur(60px)',
        ...style,
      }}
      animate={{
        x: [0, 40, -20, 30, 0],
        y: [0, -30, 20, -10, 0],
        scale: [1, 1.08, 0.96, 1.04, 1],
      }}
      transition={{ duration: 18 + delay * 3, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

// Animated grid lines
function GridLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(99,102,241,1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }}
    />
  );
}

// Scanning beam effect
function ScanBeam() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(139,92,246,0.6), rgba(99,102,241,0.4), transparent)' }}
      animate={{ top: ['0%', '100%', '0%'] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
    />
  );
}

// Floating particles
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vy: -(Math.random() * 0.4 + 0.1),
      vx: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.5 ? '99,102,241' : '139,92,246',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.6 }} />;
}

export default function AnimatedBg() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 20% 20%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(139,92,246,0.07) 0%, transparent 60%), #020617'
      }} />

      <GridLines />
      <ScanBeam />

      {/* 3D Orbs */}
      <Orb style={{ top: '-10%', left: '-5%' }} size={600} color="99,102,241" delay={0} />
      <Orb style={{ top: '30%', right: '-10%' }} size={500} color="139,92,246" delay={2} />
      <Orb style={{ bottom: '-5%', left: '20%' }} size={450} color="34,211,238" delay={4} />
      <Orb style={{ top: '60%', left: '50%' }} size={350} color="99,102,241" delay={1} />
      <Orb style={{ top: '10%', right: '30%' }} size={300} color="139,92,246" delay={3} />

      <Particles />
    </div>
  );
}
