import { useState } from 'react';
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
