import os

# Toast component
toast_content = r"""import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const colors = {
    success: 'border-green-500/40 text-green-400',
    error: 'border-red-500/40 text-red-400',
    info: 'border-brand-500/40 text-brand-400',
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id}
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}
              className={`px-4 py-3 rounded-xl glass-dark border text-sm font-medium shadow-xl pointer-events-auto ${colors[t.type] || colors.info}`}>
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
"""

os.makedirs('client/src/components', exist_ok=True)
with open('client/src/components/Toast.jsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(toast_content)
print('Toast.jsx written')

# ForgotPassword page
forgot_content = r"""import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const navigate = useNavigate();

  const inp = 'w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors';

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setInfo('OTP sent! Check your email inbox.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/auth/reset-password', { email, otp, newPassword });
      navigate('/login', { state: { successMessage: 'Password reset successful! Please sign in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 bg-dark-900">
      <div className="absolute inset-0 bg-gradient-radial from-brand-600/8 via-transparent to-transparent" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="font-display font-bold text-lg text-white">SafeSphere <span className="gradient-text">AI</span></span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white mb-2">
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </h1>
          <p className="text-slate-400 text-sm">
            {step === 1 ? 'Enter your email to receive a one-time password' : 'Enter the OTP sent to ' + email}
          </p>
        </div>

        <div className="glass-dark rounded-2xl p-6 space-y-4">
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" required className={inp} />
              </div>
              {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity btn-glow disabled:opacity-50">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
              <p className="text-center text-slate-400 text-sm">
                Remember your password?{' '}
                <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {info && <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">{info}</p>}
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">OTP Code</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value)}
                  placeholder="6-digit OTP" required maxLength={6} className={inp} />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters" required className={inp} />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password" required className={inp} />
              </div>
              {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity btn-glow disabled:opacity-50">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
              <button type="button" onClick={() => { setStep(1); setError(''); setOtp(''); setNewPassword(''); setConfirmPassword(''); }}
                className="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors">
                &larr; Back to email
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
"""

os.makedirs('client/src/pages', exist_ok=True)
with open('client/src/pages/ForgotPassword.jsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(forgot_content)
print('ForgotPassword.jsx written')

# Profile page
profile_content = r"""import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Profile() {
  const { user, token } = useAuth();
  const { addToast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [nameLoading, setNameLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const inp = 'w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors';

  const planColors = {
    free: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    pro: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
    enterprise: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setNameLoading(true);
    try {
      const { data } = await axios.put('/api/auth/profile', { name });
      localStorage.setItem('ss_user', JSON.stringify(data.user));
      addToast('Name updated successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update name', 'error');
    } finally {
      setNameLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }
    setPwLoading(true);
    try {
      await axios.put('/api/auth/profile', { oldPassword, newPassword });
      addToast('Password changed successfully!', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 pt-24 pb-16 bg-dark-900">
      <div className="absolute inset-0 bg-gradient-radial from-brand-600/8 via-transparent to-transparent" />
      <div className="relative max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-slate-400 text-sm">Manage your account settings</p>
          </div>

          {/* Account Info Card */}
          <div className="glass-dark rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">{user?.name}</h2>
                <p className="text-slate-400 text-sm">{user?.email}</p>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${planColors[user?.plan] || planColors.free}`}>
                  {user?.plan || 'free'} plan
                </span>
              </div>
            </div>
          </div>

          {/* Update Name */}
          <div className="glass-dark rounded-2xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Update Display Name</h3>
            <form onSubmit={handleUpdateName} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your name" required className={inp} />
              </div>
              <button type="submit" disabled={nameLoading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                {nameLoading ? 'Saving...' : 'Save Name'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="glass-dark rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">Current Password</label>
                <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)}
                  placeholder="Your current password" required className={inp} />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters" required className={inp} />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password" required className={inp} />
              </div>
              <button type="submit" disabled={pwLoading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                {pwLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
"""

with open('client/src/pages/Profile.jsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(profile_content)
print('Profile.jsx written')

# Updated App.jsx
app_content = r"""import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import AnimatedBg from "./components/AnimatedBg";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Demo from "./pages/Demo";
import Blog from "./pages/Blog";
import FileComplaint from "./pages/FileComplaint";
import MyComplaints from "./pages/MyComplaints";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";

function UserLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBg />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Chatbot />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/" element={<UserLayout><Home /></UserLayout>} />
          <Route path="/login" element={<UserLayout><Login /></UserLayout>} />
          <Route path="/register" element={<UserLayout><Register /></UserLayout>} />
          <Route path="/forgot-password" element={<UserLayout><ForgotPassword /></UserLayout>} />
          <Route path="/demo" element={<UserLayout><Demo /></UserLayout>} />
          <Route path="/blog" element={<UserLayout><Blog /></UserLayout>} />
          <Route path="/file-complaint" element={<UserLayout><FileComplaint /></UserLayout>} />
          <Route path="/dashboard" element={<ProtectedRoute><UserLayout><Dashboard /></UserLayout></ProtectedRoute>} />
          <Route path="/my-complaints" element={<ProtectedRoute><UserLayout><MyComplaints /></UserLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserLayout><Profile /></UserLayout></ProtectedRoute>} />
          <Route path="*" element={<UserLayout><NotFound /></UserLayout>} />
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}
"""

with open('client/src/App.jsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(app_content)
print('App.jsx written')

# Updated Login.jsx - make "Forgot password?" a real link
login_content = r"""import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMsg(location.state.successMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(form.email, form.password);
    if (res.success) {
      if (res.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } else setError(res.message);
  };

  const inp = "w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 bg-dark-900">
      <div className="absolute inset-0 bg-gradient-radial from-brand-600/8 via-transparent to-transparent" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="font-display font-bold text-lg text-white">SafeSphere <span className="gradient-text">AI</span></span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-400 text-sm">Sign in to your SafeSphere account</p>
        </div>
        <form onSubmit={handleSubmit} className="glass-dark rounded-2xl p-6 space-y-4">
          {successMsg && (
            <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">{successMsg}</p>
          )}
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com" required className={inp} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-slate-400 text-xs font-medium">Password</label>
              <Link to="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">Forgot password?</Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" required
                className={inp + " pr-16"} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white transition-colors font-medium select-none">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity btn-glow disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <p className="text-center text-slate-400 text-sm">
            Do not have an account?{" "}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">Sign up free</Link>
          </p>
        </form>
        <div className="mt-6 text-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-600 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <p className="text-slate-500 text-xs mb-3">Are you an administrator?</p>
          <Link to="/admin-login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}>
            Shield Login as Admin
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
"""

with open('client/src/pages/Login.jsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(login_content)
print('Login.jsx written')

# Updated Navbar.jsx - add Profile link in user dropdown
navbar_content = r"""import { useState, useEffect } from 'react';
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
"""

with open('client/src/components/Navbar.jsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(navbar_content)
print('Navbar.jsx written')

print('All client files done!')
