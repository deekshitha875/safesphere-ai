import { motion } from 'framer-motion';
import SectionWrapper from '../components/SectionWrapper';

const badges = [
  { icon: '🔐', label: 'AES-256 Encryption' },
  { icon: '🇪🇺', label: 'GDPR Compliant' },
  { icon: '🛡️', label: 'SOC 2 Type II' },
  { icon: '🔒', label: 'Zero Data Retention' },
  { icon: '✅', label: 'ISO 27001' },
  { icon: '🌐', label: 'CCPA Compliant' },
];

export default function Security() {
  return (
    <SectionWrapper className="bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-green-500/30 text-xs text-green-400 font-medium mb-6">
              Security & Privacy
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Your data is <span className="gradient-text">your data</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              We built SafeSphere AI with privacy at its core. Every piece of data is encrypted in transit and at rest. We never sell your data, and our AI operates on a zero-retention policy for analyzed content.
            </p>
            <ul className="space-y-3">
              {[
                'End-to-end AES-256 encryption for all data',
                'AI analysis happens in-memory — no content stored',
                'Full audit logs for enterprise compliance',
                'Regular third-party security audits',
                'Ethical AI with bias detection and human review',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="glass rounded-2xl p-8">
              <h3 className="font-display font-semibold text-white text-lg mb-6 text-center">Compliance & Certifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {badges.map((b, i) => (
                  <motion.div
                    key={b.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-xl p-4 text-center hover:border-brand-500/30 transition-all"
                  >
                    <div className="text-2xl mb-2">{b.icon}</div>
                    <div className="text-slate-300 text-xs font-medium">{b.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
