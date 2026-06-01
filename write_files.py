import os

# ── Login.jsx ──────────────────────────────────────────────────────────────
login = r"""import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

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
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com" required className={inp} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-slate-400 text-xs font-medium">Password</label>
              <span className="text-xs text-brand-400 cursor-pointer hover:text-brand-300 transition-colors">Forgot password?</span>
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
            🛡️ Login as Admin
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
"""

# ── Register.jsx ───────────────────────────────────────────────────────────
register = r"""import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const res = await register(form.name, form.email, form.password);
    if (res.success) navigate('/dashboard');
    else setErrors({ general: res.message });
  };

  const inp = "w-full px-4 py-3 rounded-xl bg-dark-700 border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 bg-dark-900">
      <div className="absolute inset-0 bg-gradient-radial from-purple-600/8 via-transparent to-transparent" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="font-display font-bold text-lg text-white">SafeSphere <span className="gradient-text">AI</span></span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-slate-400 text-sm">Start protecting your digital world today</p>
        </div>
        <form onSubmit={handleSubmit} className="glass-dark rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Full Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name" required
              className={inp + (errors.name ? " border-red-500/50" : " border-white/10 focus:border-brand-500")} />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com" required
              className={inp + (errors.email ? " border-red-500/50" : " border-white/10 focus:border-brand-500")} />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters" required
                className={inp + " pr-16" + (errors.password ? " border-red-500/50" : " border-white/10 focus:border-brand-500")} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white transition-colors font-medium select-none">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Confirm Password</label>
            <div className="relative">
              <input type={showConfirm ? "text" : "password"} value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                placeholder="Re-enter password" required
                className={inp + " pr-16" + (errors.confirm ? " border-red-500/50" : " border-white/10 focus:border-brand-500")} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white transition-colors font-medium select-none">
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
          </div>
          {errors.general && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{errors.general}</p>
          )}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity btn-glow disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
          <p className="text-center text-slate-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
"""

# ── NotFound.jsx ───────────────────────────────────────────────────────────
notfound = r"""import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-900">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md">
        <div className="text-8xl font-display font-bold gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-slate-400 mb-8">The page you are looking for does not exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold text-sm btn-glow">
            Go Home
          </Link>
          <Link to="/dashboard" className="px-6 py-3 rounded-xl glass border border-white/10 text-white font-semibold text-sm hover:border-brand-500/50 transition-all">
            Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
"""

# ── App.jsx ────────────────────────────────────────────────────────────────
app = r"""import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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
    <AuthProvider>
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
        <Route path="/" element={<UserLayout><Home /></UserLayout>} />
        <Route path="/login" element={<UserLayout><Login /></UserLayout>} />
        <Route path="/register" element={<UserLayout><Register /></UserLayout>} />
        <Route path="/demo" element={<UserLayout><Demo /></UserLayout>} />
        <Route path="/blog" element={<UserLayout><Blog /></UserLayout>} />
        <Route path="/file-complaint" element={<UserLayout><FileComplaint /></UserLayout>} />
        <Route path="/dashboard" element={<ProtectedRoute><UserLayout><Dashboard /></UserLayout></ProtectedRoute>} />
        <Route path="/my-complaints" element={<ProtectedRoute><UserLayout><MyComplaints /></UserLayout></ProtectedRoute>} />
        <Route path="*" element={<UserLayout><NotFound /></UserLayout>} />
      </Routes>
    </AuthProvider>
  );
}
"""

files = {
    'client/src/pages/Login.jsx': login,
    'client/src/pages/Register.jsx': register,
    'client/src/pages/NotFound.jsx': notfound,
    'client/src/App.jsx': app,
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    print(f'Written: {path}')

print('Done batch 1')
