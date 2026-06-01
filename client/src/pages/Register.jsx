import { useState } from 'react';
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
