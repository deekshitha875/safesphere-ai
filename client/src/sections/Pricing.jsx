import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionWrapper from '../components/SectionWrapper';

const plans = [
  {
    name: 'Free', price: '₹0', period: 'forever',
    desc: 'Perfect for individuals getting started with online safety.',
    features: ['100 scans/month', 'Basic threat detection', 'Email alerts', '1 platform', 'Community support'],
    cta: 'Get Started Free', popular: false, color: 'border-white/10', glow: 'rgba(99,102,241,0)',
  },
  {
    name: 'Pro', price: '₹999', period: '/month',
    desc: 'Advanced AI protection for families and power users.',
    features: ['Unlimited scans', 'Advanced AI + NLP', 'Real-time alerts (SMS + Email)', '10 platforms', 'Sentiment analysis', 'Priority support', 'Dashboard analytics'],
    cta: 'Start Pro Trial', popular: true, color: 'border-brand-500/50', glow: 'rgba(99,102,241,0.2)',
  },
  {
    name: 'Enterprise', price: 'Custom', period: '',
    desc: 'Tailored solutions for schools, platforms, and organizations.',
    features: ['Unlimited everything', 'Custom AI model training', 'API access', 'White-label option', 'SLA guarantee', 'Dedicated account manager', 'On-premise deployment'],
    cta: 'Contact Sales', popular: false, color: 'border-white/10', glow: 'rgba(139,92,246,0)',
  },
];

export default function Pricing() {
  return (
    <SectionWrapper id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-brand-500/30 text-xs text-brand-400 font-medium mb-4">
            Pricing
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Simple, <span className="gradient-text">transparent pricing</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-slate-400 text-lg max-w-2xl mx-auto">
            Start free, scale as you grow. No hidden fees, no surprises.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((p, i) => (
            <motion.div key={p.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: p.popular ? -8 : -4, transition: { duration: 0.2 } }}
              className={`relative glass rounded-2xl p-6 border ${p.color} ${p.popular ? 'scale-105' : ''}`}
              style={{ boxShadow: p.popular ? `0 0 40px ${p.glow}, 0 20px 40px rgba(0,0,0,0.3)` : 'none' }}
            >
              {p.popular && (
                <motion.div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
                  animate={{ boxShadow: ['0 0 10px rgba(99,102,241,0.3)', '0 0 25px rgba(99,102,241,0.6)', '0 0 10px rgba(99,102,241,0.3)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⭐ Most Popular
                </motion.div>
              )}

              <div className="mb-4">
                <h3 className="font-display font-bold text-white text-xl mb-1">{p.name}</h3>
                <p className="text-slate-400 text-sm">{p.desc}</p>
              </div>
              <div className="mb-6">
                <motion.span className="font-display text-4xl font-bold text-white"
                  key={p.price} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  {p.price}
                </motion.span>
                <span className="text-slate-400 text-sm">{p.period}</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {p.features.map((f, fi) => (
                  <motion.li key={f} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: fi * 0.05 }}
                    className="flex items-center gap-2 text-sm text-slate-300">
                    <motion.span className="text-green-400 text-xs"
                      animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: fi * 0.3 }}>✓</motion.span>
                    {f}
                  </motion.li>
                ))}
              </ul>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to={p.name === 'Enterprise' ? '#contact' : '/register'}
                  className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    p.popular
                      ? 'text-white hover:opacity-90'
                      : 'glass border border-white/10 text-white hover:border-brand-500/50'
                  }`}
                  style={p.popular ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' } : {}}>
                  {p.cta}
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
