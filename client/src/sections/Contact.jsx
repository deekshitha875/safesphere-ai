import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import SectionWrapper from '../components/SectionWrapper';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionWrapper id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-brand-500/30 text-xs text-brand-400 font-medium mb-6">
              Get In Touch
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Let's make the internet <span className="gradient-text">safer together</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Have questions about SafeSphere AI? Want to explore enterprise options? We'd love to hear from you.
            </p>
            <div className="space-y-4">
              {[
                { icon: '📧', label: 'Email', value: 'hello@safesphere.ai' },
                { icon: '📞', label: 'Phone', value: '+91 98765 43210' },
                { icon: '📍', label: 'Location', value: 'Bangalore, India' },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-lg">{c.icon}</div>
                  <div>
                    <div className="text-slate-500 text-xs">{c.label}</div>
                    <div className="text-white text-sm font-medium">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1.5">Name</label>
                  <input
                    type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name" required
                    className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1.5">Email</label>
                  <input
                    type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com" required
                    className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">Message</label>
                <textarea
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us how we can help..." required rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
                />
              </div>
              {status === 'success' && <p className="text-green-400 text-sm">✓ Message sent! We'll get back to you soon.</p>}
              {status === 'error' && <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>}
              <button
                type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity btn-glow disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
