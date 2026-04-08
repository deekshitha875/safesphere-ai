import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import SectionWrapper from '../components/SectionWrapper';

const features = [
  { icon: '⚡', title: 'Real-Time Detection', desc: 'AI scans messages and posts instantly, flagging harmful content before it causes damage — with under 50ms latency.', tag: '50ms response', color: 'from-brand-500 to-brand-600', glow: 'rgba(99,102,241,0.3)' },
  { icon: '🧠', title: 'Sentiment Analysis', desc: 'Understands nuanced emotions — anger, hate, sarcasm, and passive aggression — with contextual NLP models.', tag: '98% accuracy', color: 'from-purple-500 to-purple-600', glow: 'rgba(139,92,246,0.3)' },
  { icon: '🌐', title: 'Multi-Platform Integration', desc: 'Seamlessly integrates with social media, messaging apps, forums, and custom platforms via REST API.', tag: '150+ platforms', color: 'from-cyan-500 to-cyan-600', glow: 'rgba(34,211,238,0.3)' },
  { icon: '🔔', title: 'Smart Alerts', desc: 'Instantly notifies users, parents, or admins when threats are detected — with severity levels and recommended actions.', tag: 'Instant alerts', color: 'from-amber-500 to-orange-500', glow: 'rgba(245,158,11,0.3)' },
  { icon: '🔒', title: 'Privacy Protection', desc: 'End-to-end encryption, zero data retention, and GDPR-compliant architecture ensure your data stays yours.', tag: 'GDPR compliant', color: 'from-green-500 to-emerald-600', glow: 'rgba(16,185,129,0.3)' },
  { icon: '⚖️', title: 'Ethical AI Engine', desc: 'Bias-free, explainable AI decisions with human-in-the-loop review for edge cases and appeals.', tag: 'Explainable AI', color: 'from-red-500 to-rose-600', glow: 'rgba(239,68,68,0.3)' },
];

function FeatureCard({ f, i }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 25 });
  const glowX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      className="relative group cursor-default"
    >
      {/* Glow follow effect */}
      <motion.div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowX} ${glowY}, ${f.glow} 0%, transparent 60%)`,
        }} />

      <div className="glass rounded-2xl p-6 h-full border border-white/5 group-hover:border-white/15 transition-all duration-300"
        style={{ transform: 'translateZ(10px)' }}>
        <motion.div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-xl mb-4`}
          whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.4 }}
          style={{ boxShadow: `0 8px 20px ${f.glow}`, transform: 'translateZ(20px)' }}>
          {f.icon}
        </motion.div>
        <h3 className="font-display font-semibold text-white text-lg mb-2" style={{ transform: 'translateZ(15px)' }}>{f.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">{f.desc}</p>
        <span className="inline-block px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium">
          {f.tag}
        </span>
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <SectionWrapper id="features" className="bg-dark-800/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-brand-500/30 text-xs text-brand-400 font-medium mb-4">
            Core Features
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Everything you need to stay{' '}
            <span className="gradient-text">safe online</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto">
            Powered by state-of-the-art NLP and machine learning models trained on millions of real-world interactions.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => <FeatureCard key={f.title} f={f} i={i} />)}
        </div>
      </div>
    </SectionWrapper>
  );
}
