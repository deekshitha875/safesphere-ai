import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PIE_COLORS = { safe: '#10b981', toxic: '#f59e0b', hate: '#ef4444', harassment: '#8b5cf6' };

const STATUS_COLORS = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  resolved: 'text-green-400 bg-green-400/10 border-green-400/20',
  rejected: 'text-red-400 bg-red-400/10 border-red-400/20',
  'under review': 'text-brand-400 bg-brand-400/10 border-brand-400/20',
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

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
            <p className="text-slate-400 text-sm mt-1">Here is your safety overview</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/demo" className="px-4 py-2 rounded-xl glass border border-white/10 text-white text-sm hover:border-brand-500/50 transition-all">
              + Analyze Text
            </Link>
            <Link to="/file-complaint" className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              🚨 Report
            </Link>
            {/* Profile dropdown */}
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm hover:opacity-90 transition-opacity">
                {user.name?.charAt(0).toUpperCase()}
              </button>
              {showMenu && (
                <div className="absolute right-0 top-11 w-44 glass-dark rounded-xl border border-white/10 py-1 z-50 shadow-xl">
                  <div className="px-4 py-2 border-b border-white/5">
                    <p className="text-white text-xs font-semibold truncate">{user.name}</p>
                    <p className="text-slate-500 text-xs truncate">{user.email}</p>
                  </div>
                  <Link to="/my-complaints" onClick={() => setShowMenu(false)}
                    className="block px-4 py-2 text-slate-300 hover:text-white text-sm transition-colors">
                    My Reports
                  </Link>
                  <button onClick={() => { setShowMenu(false); logout(); navigate('/login'); }}
                    className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 text-sm transition-colors">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="glass rounded-2xl p-5 animate-pulse">
                  <div className="w-8 h-8 bg-white/5 rounded-lg mb-3" />
                  <div className="w-16 h-8 bg-white/5 rounded mb-2" />
                  <div className="w-20 h-3 bg-white/5 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* Analysis Stats cards - row 1 */}
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

            {/* Complaint Stats cards - row 2 */}
            {stats.complaints && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'My Complaints', value: stats.complaints.total, icon: '📋', color: 'text-brand-400' },
                  { label: 'Pending', value: stats.complaints.pending, icon: '⏳', color: 'text-yellow-400' },
                  { label: 'Resolved', value: stats.complaints.resolved, icon: '✅', color: 'text-green-400' },
                ].map(s => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl p-5">
                    <div className="text-2xl mb-2">{s.icon}</div>
                    <div className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-slate-500 text-xs mt-1">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            )}

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
                  <div className="h-40 flex flex-col items-center justify-center gap-3">
                    <p className="text-slate-500 text-sm">No analysis data yet.</p>
                    <Link to="/demo" className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white text-xs font-semibold">
                      Try Live Demo
                    </Link>
                  </div>
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
                  <div className="h-40 flex flex-col items-center justify-center gap-3">
                    <p className="text-slate-500 text-sm">No analyses yet</p>
                    <Link to="/demo" className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white text-xs font-semibold">
                      Start Analyzing
                    </Link>
                  </div>
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

            {/* Recent Complaints */}
            {stats.complaints?.recent?.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-sm">Recent Complaints</h3>
                  <Link to="/my-complaints" className="text-brand-400 hover:text-brand-300 text-xs transition-colors">
                    View all →
                  </Link>
                </div>
                <div className="space-y-2">
                  {stats.complaints.recent.map((c, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-dark-700/50 text-sm">
                      <div className="flex-1 mr-4 min-w-0">
                        <p className="text-slate-300 truncate font-medium">{c.title || c.type || 'Complaint'}</p>
                        <p className="text-slate-500 text-xs mt-0.5 truncate">{c.description?.slice(0, 60)}{c.description?.length > 60 ? '…' : ''}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full border ${STATUS_COLORS[c.status] || 'text-slate-400 bg-white/5 border-white/10'}`}>
                          {c.status}
                        </span>
                        <span className="text-slate-600 text-xs">{new Date(c.createdAt).toLocaleDateString()}</span>
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
              Try Live Demo
            </Link>
          </div>
        )}
      </div>
      {/* Close menu on outside click */}
      {showMenu && <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />}
    </div>
  );
}
