import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const EXAMPLES = [
  "You're so stupid, nobody likes you",
  "Great job on the project today!",
  "Stop embarrassing yourself online",
  "I'll find out where you live",
  "You're amazing, keep it up!",
  "Everyone hates you, just disappear",
];

const LABEL_CONFIG = {
  safe: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', icon: '✓', label: 'Safe' },
  toxic: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: '⚡', label: 'Toxic' },
  hate: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: '⚠', label: 'Hate Speech' },
  harassment: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', icon: '🚨', label: 'Harassment' },
};

export default function Demo() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const analyze = async (input) => {
    const t = input || text;
    if (!t.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await axios.post('/api/analyze/demo', { text: t });
      setResult({ text: t, ...data.result });
      setHistory(prev => [{ text: t, ...data.result }, ...prev.slice(0, 4)]);
    } catch {
      setResult({ error: true });
    } finally {
      setLoading(false);
    }
  };

  const cfg = result && !result.error ? LABEL_CONFIG[result.label] || LABEL_CONFIG.safe : null;

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-brand-500/30 text-xs text-brand-400 font-medium mb-4">
            Live Demo
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Try SafeSphere AI <span className="gradient-text">Live</span>
          </h1>
          <p className="text-slate-400">Type any message and watch our AI analyze it in real time.</p>
        </motion.div>

        {/* Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-dark rounded-2xl p-6 mb-6">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type a message to analyze..."
            rows={4}
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm resize-none focus:outline-none mb-4"
          />
          <div className="flex items-center justify-between">
            <span className="text-slate-600 text-xs">{text.length} characters</span>
            <button
              onClick={() => analyze()}
              disabled={loading || !text.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity btn-glow disabled:opacity-40"
            >
              {loading ? 'Analyzing...' : 'Analyze →'}
            </button>
          </div>
        </motion.div>

        {/* Examples */}
        <div className="mb-6">
          <p className="text-slate-500 text-xs mb-3">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map(ex => (
              <button key={ex} onClick={() => { setText(ex); analyze(ex); }}
                className="px-3 py-1.5 rounded-lg glass border border-white/10 text-slate-400 hover:text-white hover:border-brand-500/30 text-xs transition-all">
                {ex.length > 30 ? ex.slice(0, 30) + '...' : ex}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && !result.error && cfg && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`glass rounded-2xl p-6 border mb-6 ${cfg.bg}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className={`text-2xl font-bold font-display ${cfg.color} mb-1`}>
                    {cfg.icon} {cfg.label}
                  </div>
                  <div className="text-slate-400 text-sm">"{result.text}"</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-xl">{result.confidence}%</div>
                  <div className="text-slate-500 text-xs">Confidence</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Sentiment', value: result.sentiment },
                  { label: 'Threat Level', value: result.threatLevel },
                  { label: 'Action', value: result.action },
                ].map(r => (
                  <div key={r.label} className="bg-dark-800/60 rounded-xl p-3 text-center">
                    <div className="text-slate-500 text-xs mb-1">{r.label}</div>
                    <div className="text-white text-xs font-semibold capitalize">{r.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {history.length > 0 && (
          <div>
            <p className="text-slate-500 text-xs mb-3">Recent analyses:</p>
            <div className="space-y-2">
              {history.map((h, i) => {
                const c = LABEL_CONFIG[h.label] || LABEL_CONFIG.safe;
                return (
                  <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${c.bg} text-sm`}>
                    <span className="text-slate-300 truncate flex-1 mr-3">"{h.text}"</span>
                    <span className={`font-semibold shrink-0 ${c.color}`}>{c.icon} {c.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
