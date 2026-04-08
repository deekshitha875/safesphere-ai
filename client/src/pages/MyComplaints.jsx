import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const STATUS = {
  pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  under_review: { label: 'Under Review', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  resolved: { label: 'Resolved', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
  dismissed: { label: 'Dismissed', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30' },
};
const SEV = {
  low: 'text-green-400', medium: 'text-yellow-400', high: 'text-orange-400', critical: 'text-red-400',
};

export default function MyComplaints() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('/api/complaints/my').then(r => setComplaints(r.data.complaints)).finally(() => setLoading(false));
  }, [user, navigate]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">My Complaints</h1>
            <p className="text-slate-400 text-sm mt-1">Track the status of your filed reports</p>
          </div>
          <Link to="/file-complaint" className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold text-sm"
            style={{ boxShadow: '0 0 15px rgba(239,68,68,0.3)' }}>
            + New Complaint
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" /></div>
        ) : complaints.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-white font-semibold mb-2">No complaints filed yet</p>
            <p className="text-slate-400 text-sm mb-6">If you've experienced cyberbullying, report it — our admins are here to help.</p>
            <Link to="/file-complaint" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold text-sm">
              File a Complaint
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((c, i) => (
              <motion.div key={c._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(selected?._id === c._id ? null : c)}
                className="glass rounded-2xl p-5 cursor-pointer hover:border-brand-500/30 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${STATUS[c.status]?.bg} ${STATUS[c.status]?.color}`}>
                        {STATUS[c.status]?.label}
                      </span>
                      <span className={`text-xs font-semibold uppercase ${SEV[c.severity]}`}>
                        {c.severity} severity
                      </span>
                      <span className="text-slate-600 text-xs">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-white font-semibold text-sm">Against: {c.offenderName} on {c.offenderPlatform}</h3>
                    <p className="text-slate-400 text-xs mt-1 line-clamp-2">{c.incidentDescription}</p>
                    {c.detectedWords?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {c.detectedWords.slice(0, 5).map(w => (
                          <span key={w} className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 text-xs">{w}</span>
                        ))}
                        {c.detectedWords.length > 5 && <span className="text-slate-500 text-xs">+{c.detectedWords.length - 5} more</span>}
                      </div>
                    )}
                  </div>
                  <span className="text-slate-500 text-sm">{selected?._id === c._id ? '▲' : '▼'}</span>
                </div>

                {/* Expanded detail */}
                {selected?._id === c._id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-white/5 space-y-3">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Harmful Content Reported:</p>
                      <p className="text-slate-300 text-sm bg-dark-700/50 rounded-lg p-3 italic">"{c.harmfulContent}"</p>
                    </div>
                    {c.adminNotes && (
                      <div className="bg-brand-500/10 border border-brand-500/20 rounded-lg p-3">
                        <p className="text-brand-400 text-xs font-semibold mb-1">📋 Admin Notes:</p>
                        <p className="text-slate-300 text-sm">{c.adminNotes}</p>
                      </div>
                    )}
                    {c.adminAction && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <p className="text-green-400 text-xs font-semibold mb-1">✅ Action Taken:</p>
                        <p className="text-slate-300 text-sm">{c.adminAction}</p>
                      </div>
                    )}
                    {c.status === 'pending' && (
                      <p className="text-yellow-400 text-xs">⏳ Awaiting admin review. You'll be notified once reviewed.</p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
