import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setProfileOpen(false); }, [location]);

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
                    Admin
                  </Link>
                )}
                <Link to="/file-complaint" className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold hover:opacity-90 transition-opacity">
                  Report
                </Link>
                {/* Profile avatar dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm hover:opacity-90 transition-opacity focus:outline-none"
                    aria-label="Profile menu"
                  >
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-44 glass-dark rounded-xl border border-white/10 shadow-xl overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-white text-sm font-medium truncate">{user.name}</p>
                          <p className="text-slate-400 text-xs truncate">{user.email}</p>
                        </div>
                        <Link to="/profile" className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                          My Profile
                        </Link>
                        <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
                    <Link to="/profile" className={`text-sm py-2 ${location.pathname === '/profile' ? 'text-white font-semibold' : 'text-slate-300'}`}>My Profile</Link>
                    <Link to="/file-complaint" className="text-sm py-2 text-red-400 font-semibold">Report Incident</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="text-sm py-2 text-red-400">Admin Panel</Link>
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
