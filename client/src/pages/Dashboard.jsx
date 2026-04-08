import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PIE_COLORS = { safe: '#10b981', toxic: '#f59e0b', hate: '#ef4444', harassment: '#8b5cf6' };

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('/api/dashboard/stats')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (!user) return null;

  const pieData = stats ? Object.entries(stats.byLabel).map(([name, value]) => ({ name, value })) : [];
  const barData = stats?.recent?.slice(0, 7).map((a, i) => ({
    name: `#${i + 1}`,
    safe: a.result.label === 'safe' ? 1 : 0,
    flagged: a.result.label !== 'safe' ? 1 : 0,
  })) || [];

  return (
    <div className="min-h-screen bg-dark-900 pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Welcome back, {user.name.split(' ')[0]} 👋</h1>
            <p className="text-slate-400 text-sm mt-1">Here's your safety overview</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/demo" className="px-4 py-2 rounded-xl glass border border-white/10 text-white text-sm hover:border-brand-500/50 transition-all">
              + Analyze Text
            </Link>
            <button onClick={logout} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm transition-colors">
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Safety Score', value: `${stats.safetyScore}%`, icon: '🛡️', color: 'text-green-400' },
                { label: 'Total Scanned', value: stats.total, icon: '🔍', color: 'text-brand-400' },
                { label: 'Flagged', value: stats.flagged, icon: '⚠️', color: 'text-yellow-400' },
                { label: 'Safe', value: stats.safe, icon: '✓', color: 'text-green-400' },
              ].map(s => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl p-5">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-slate-500 text-xs mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Bar chart */}
              <div className="lg:col-span-2 glass rounded-2xl p-5">
                <h3 className="text-white font-semibold text-sm mb-4">Recent Analysis Activity</h3>
                {barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={barData} barSize={10}>
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                      <Bar dataKey="safe" fill="#6366f1" radius={4} />
                      <Bar dataKey="flagged" fill="#ef4444" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-40 flex items-center justify-center text-slate-500 text-sm">No data yet. Try the <Link to="/demo" className="text-brand-400 ml-1">Live Demo</Link>.</div>
                )}
              </div>

              {/* Pie chart */}
              <div className="glass rounded-2xl p-5">
                <h3 className="text-white font-semibold text-sm mb-4">Content Breakdown</h3>
                {pieData.some(d => d.value > 0) ? (
                  <>
                    <ResponsiveContainer width="100%" height={140}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0}>
                          {pieData.map((entry, i) => <Cell key={i} fill={PIE_COLORS[entry.name] || '#6366f1'} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      {pieData.map(d => (
                        <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                          <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[d.name] }} />
                          {d.name} ({d.value})
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-40 flex items-center justify-center text-slate-500 text-sm">No analyses yet</div>
                )}
              </div>
            </div>

            {/* Recent analyses */}
            {stats.recent?.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <h3 className="text-white font-semibold text-sm mb-4">Recent Analyses</h3>
                <div className="space-y-2">
                  {stats.recent.map((a, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-dark-700/50 text-sm">
                      <span className="text-slate-300 truncate flex-1 mr-4">"{a.text}"</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs font-semibold capitalize ${a.result.label === 'safe' ? 'text-green-400' : 'text-red-400'}`}>
                          {a.result.label}
                        </span>
                        <span className="text-slate-600 text-xs">{new Date(a.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400 mb-4">No data yet. Start by analyzing some text.</p>
            <Link to="/demo" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold text-sm btn-glow">
              Try Live Demo →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
