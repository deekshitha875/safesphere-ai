import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import NeuralCanvas from '../components/NeuralCanvas';

const DEMO_MESSAGES = [
  { text: "You're so stupid, nobody likes you", label: 'Hate', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: '⚠' },
  { text: "Great job on the project today!", label: 'Safe', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', icon: '✓' },
  { text: "Stop embarrassing yourself online", label: 'Toxic', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: '⚡' },
  { text: "I'll find out where you live", label: 'Threat', color: 'text-red-500', bg: 'bg-red-600/10 border-red-600/30', icon: '🚨' },
];

function StatCounter({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// 3D tilt card
function TiltCard({ children }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className="relative">
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const [scanProgress, setScanProgress] = useState(0);
  const [activeMsg, setActiveMsg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress(0);
      setActiveMsg(prev => (prev + 1) % DEMO_MESSAGES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let frame, start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const p = Math.min(((ts - start) / 3000) * 100, 100);
      setScanProgress(p);
      if (p < 100) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [activeMsg]);

  const msg = DEMO_MESSAGES[activeMsg];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Neural canvas background */}
      <div className="absolute inset-0">
        <NeuralCanvas />
        {/* Extra depth layers */}
        <motion.div className="absolute inset-0"
          animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 8, repeat: Infinity }}
          style={{ background: 'radial-gradient(ellipse 50% 60% at 30% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
        <motion.div className="absolute inset-0"
          animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          style={{ background: 'radial-gradient(ellipse 40% 50% at 70% 40%, rgba(139,92,246,0.07) 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-brand-500/30 text-xs text-brand-400 font-medium mb-6">
              <motion.span className="w-1.5 h-1.5 rounded-full bg-green-400"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              AI-Powered Cyber Safety Platform
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Empowering Digital Safety with{' '}
              <motion.span className="gradient-text inline-block"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200% 200%' }}>
                AI-Driven
              </motion.span>{' '}
              Cyberbullying Detection
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl">
              SafeSphere AI monitors, detects, and prevents online harassment in real time — protecting students, families, and communities across every digital platform.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-12">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/register"
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-all flex items-center gap-2"
                  style={{ boxShadow: '0 0 25px rgba(99,102,241,0.4)' }}>
                  Get Started Free <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/demo"
                  className="px-7 py-3.5 rounded-xl glass border border-white/10 text-white font-semibold text-sm hover:border-brand-500/50 transition-all flex items-center gap-2">
                  <motion.span className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center text-xs"
                    animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>▶</motion.span>
                  Watch Demo
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { target: 98, suffix: '%', label: 'Accuracy' },
                { target: 2, suffix: 'M+', label: 'Protected' },
                { target: 150, suffix: '+', label: 'Platforms' },
                { target: 50, suffix: 'ms', label: 'Response' },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }} className="text-center">
                  <div className="font-display text-2xl font-bold gradient-text">
                    <StatCounter target={s.target} suffix={s.suffix} />
                  </div>
                  <div className="text-slate-500 text-xs mt-1">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — 3D Tilt AI Card */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
            <TiltCard>
              <div className="glass-dark rounded-2xl p-5 glow-border"
                style={{ boxShadow: '0 0 60px rgba(99,102,241,0.15), 0 25px 50px rgba(0,0,0,0.5)', transform: 'translateZ(20px)' }}>

                {/* Card header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-slate-400 text-xs font-medium ml-2">SafeSphere AI — Live Analysis</span>
                  <span className="ml-auto flex items-center gap-1 text-xs text-green-400">
                    <motion.span className="w-1.5 h-1.5 rounded-full bg-green-400"
                      animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    Live
                  </span>
                </div>

                {/* Messages */}
                <div className="space-y-2 mb-4">
                  {DEMO_MESSAGES.map((m, i) => (
                    <motion.div key={i}
                      animate={{
                        opacity: i === activeMsg ? 1 : 0.35,
                        scale: i === activeMsg ? 1 : 0.97,
                        x: i === activeMsg ? 0 : -4,
                      }}
                      transition={{ duration: 0.4 }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm ${i === activeMsg ? m.bg : 'bg-dark-700/40 border-white/5'}`}>
                      <span className={`${i === activeMsg ? 'text-white' : 'text-slate-500'} truncate flex-1 mr-3 text-xs`}>{m.text}</span>
                      <span className={`text-xs font-bold shrink-0 flex items-center gap-1 ${i === activeMsg ? m.color : 'text-slate-600'}`}>
                        {m.icon} {m.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Scan bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span className="flex items-center gap-1">
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block">⚙</motion.span>
                      AI Scanning...
                    </span>
                    <span>{Math.round(scanProgress)}%</span>
                  </div>
                  <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full"
                      style={{ width: `${scanProgress}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #22d3ee)' }}
                      transition={{ duration: 0.1 }} />
                  </div>
                </div>

                {/* Result */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Sentiment', value: msg.label === 'Safe' ? 'Positive' : 'Hostile', color: msg.label === 'Safe' ? 'text-green-400' : 'text-red-400' },
                    { label: 'Threat', value: msg.label === 'Safe' ? 'None' : msg.label === 'Toxic' ? 'Medium' : 'High', color: msg.label === 'Safe' ? 'text-green-400' : msg.label === 'Toxic' ? 'text-yellow-400' : 'text-red-400' },
                    { label: 'Action', value: msg.label === 'Safe' ? 'Clear' : 'Alert Sent', color: msg.label === 'Safe' ? 'text-green-400' : 'text-brand-400' },
                  ].map(r => (
                    <motion.div key={r.label} layout className="bg-dark-700/60 rounded-lg p-2 text-center">
                      <div className="text-slate-500 text-xs mb-1">{r.label}</div>
                      <motion.div key={r.value} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        className={`text-xs font-bold ${r.color}`}>{r.value}</motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating badges with 3D depth */}
              <motion.div animate={{ y: [0, -10, 0], rotateZ: [0, 2, 0] }} transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -top-5 -right-5 glass px-3 py-2 rounded-xl text-xs font-bold text-green-400 border border-green-500/30"
                style={{ boxShadow: '0 8px 25px rgba(16,185,129,0.2)', transform: 'translateZ(40px)' }}>
                ✓ 98% Accuracy
              </motion.div>
              <motion.div animate={{ y: [0, 10, 0], rotateZ: [0, -2, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 0.8 }}
                className="absolute -bottom-5 -left-5 glass px-3 py-2 rounded-xl text-xs font-bold text-brand-400 border border-brand-500/30"
                style={{ boxShadow: '0 8px 25px rgba(99,102,241,0.2)', transform: 'translateZ(40px)' }}>
                ⚡ 50ms Response
              </motion.div>
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1.5 }}
                className="absolute top-1/2 -right-8 glass px-3 py-2 rounded-xl text-xs font-bold text-purple-400 border border-purple-500/30"
                style={{ boxShadow: '0 8px 25px rgba(139,92,246,0.2)', transform: 'translateZ(40px)' }}>
                🛡️ Protected
              </motion.div>
            </TiltCard>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div className="w-5 h-8 rounded-full border border-slate-700 flex items-start justify-center pt-1.5">
          <motion.div className="w-1 h-2 rounded-full bg-brand-500"
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
