import { motion } from 'framer-motion';
import SectionWrapper from '../components/SectionWrapper';

const steps = [
  { num: '01', icon: '📥', title: 'Data Collection', desc: 'User messages and posts are collected from connected platforms via secure API integrations in real time.' },
  { num: '02', icon: '🤖', title: 'AI Processing', desc: 'Our transformer-based NLP model analyzes text for tone, intent, context, and harmful patterns in milliseconds.' },
  { num: '03', icon: '🎯', title: 'Pattern Detection', desc: 'Machine learning identifies cyberbullying patterns, hate speech, threats, and harassment with 98% accuracy.' },
  { num: '04', icon: '🚨', title: 'Smart Response', desc: 'Automated alerts sent to users, parents, or admins with severity scores and recommended actions instantly.' },
];

export default function HowItWorks() {
  return (
    <SectionWrapper id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-purple-500/30 text-xs text-purple-400 font-medium mb-4">
            How It Works
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            From message to <span className="gradient-text">protection</span> in milliseconds
          </motion.h2>
        </div>

        <div className="relative">
          {/* Animated connector */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-px overflow-hidden">
            <motion.div className="h-full"
              style={{ background: 'linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #22d3ee, transparent)' }}
              animate={{ x: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="relative text-center group"
              >
                <motion.div
                  className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 mx-auto"
                  style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.3)' }}
                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="text-2xl">{s.icon}</span>
                  <motion.span
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    animate={{ boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 15px rgba(99,102,241,0.6)', '0 0 0px rgba(99,102,241,0)'] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  >
                    {i + 1}
                  </motion.span>
                </motion.div>
                <h3 className="font-display font-semibold text-white text-lg mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Flow diagram */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 glass rounded-2xl p-6 lg:p-8 overflow-x-auto">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm min-w-max mx-auto">
            {['User Message', '→', 'API Gateway', '→', 'NLP Engine', '→', 'Threat Classifier', '→', 'Alert System', '→', 'Safe Platform'].map((item, i) => (
              item === '→' ? (
                <motion.span key={i} className="text-brand-500 font-bold text-xl"
                  animate={{ opacity: [0.4, 1, 0.4], x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}>
                  →
                </motion.span>
              ) : (
                <motion.span key={i}
                  className="px-3 py-1.5 rounded-lg glass border border-white/10 text-slate-300 font-medium"
                  whileHover={{ scale: 1.05, borderColor: 'rgba(99,102,241,0.5)' }}>
                  {item}
                </motion.span>
              )
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
