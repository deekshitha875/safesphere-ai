import { useState } from 'react';
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
