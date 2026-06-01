import os

# ── Dashboard.jsx — fix logout placement, better empty states ─────────────
dashboard = r"""import { useEffect, useState } from 'react';
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
            {/* Skeleton loaders */}
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
"""

# ── Navbar.jsx — active link highlight, mobile my-complaints link ──────────
navbar = r"""import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const links = [
    { to: '/#features', label: 'Features' },
    { to: '/#how-it-works', label: 'How It Works' },
    { to: '/demo', label: 'Live Demo' },
    { to: '/#pricing', label: 'Pricing' },
    { to: '/blog', label: 'Blog' },
  ];

  const isActive = (to) => {
    if (to.startsWith('/#')) return location.pathname === '/';
    return location.pathname === to;
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-dark shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-brand-500/40 transition-shadow">
              S
            </div>
            <span className="font-display font-bold text-lg text-white">
              SafeSphere <span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <a key={l.to} href={l.to}
                className={`text-sm font-medium transition-colors duration-200 ${isActive(l.to) ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard"
                  className={`text-sm transition-colors ${location.pathname === '/dashboard' ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'}`}>
                  Dashboard
                </Link>
                <Link to="/my-complaints"
                  className={`text-sm transition-colors ${location.pathname === '/my-complaints' ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'}`}>
                  My Reports
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all font-medium">
                    🛡️ Admin
                  </Link>
                )}
                <Link to="/file-complaint" className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold hover:opacity-90 transition-opacity">
                  🚨 Report
                </Link>
              </>
            ) : (
              <>
                <Link to="/login"
                  className={`text-sm transition-colors ${location.pathname === '/login' ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'}`}>
                  Login
                </Link>
                <Link to="/register" className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity btn-glow">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-slate-400 hover:text-white" aria-label="Menu">
            <div className="w-5 space-y-1">
              <span className={`block h-0.5 bg-current transition-all ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dark border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-3">
              {links.map(l => (
                <a key={l.to} href={l.to}
                  className={`block py-2 text-sm font-medium ${isActive(l.to) ? 'text-white' : 'text-slate-300 hover:text-white'}`}>
                  {l.label}
                </a>
              ))}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link to="/dashboard" className={`text-sm py-2 ${location.pathname === '/dashboard' ? 'text-white font-semibold' : 'text-slate-300'}`}>Dashboard</Link>
                    <Link to="/my-complaints" className={`text-sm py-2 ${location.pathname === '/my-complaints' ? 'text-white font-semibold' : 'text-slate-300'}`}>My Reports</Link>
                    <Link to="/file-complaint" className="text-sm py-2 text-red-400 font-semibold">🚨 Report Incident</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="text-sm py-2 text-red-400">🛡️ Admin Panel</Link>
                    )}
                    <button onClick={logout} className="text-sm text-left text-slate-400 py-2">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-sm text-slate-300 py-2">Login</Link>
                    <Link to="/register" className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold text-center">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
"""

files = {
    'client/src/pages/Dashboard.jsx': dashboard,
    'client/src/components/Navbar.jsx': navbar,
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    print(f'Written: {path}')

print('Done batch 3')
