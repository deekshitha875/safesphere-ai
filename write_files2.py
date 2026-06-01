import os

# ── FileComplaint.jsx — fix: use /api/complaints (auth) when logged in ─────
file_complaint = r"""import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const PLATFORMS = ["Instagram","Facebook","WhatsApp","Twitter/X","Snapchat","TikTok","YouTube","Discord","Telegram","Reddit","Email","SMS","School Portal","Workplace Chat","Other"];
const SEV_CFG = {
  low:      { color: "text-green-400",  bg: "bg-green-500/10 border-green-500/30",  label: "Low Risk" },
  medium:   { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", label: "Medium Risk" },
  high:     { color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30", label: "High Risk" },
  critical: { color: "text-red-400",    bg: "bg-red-500/10 border-red-500/30",       label: "Critical" },
};

export default function FileComplaint() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    offenderName: "", offenderPlatform: "", incidentDescription: "", harmfulContent: "",
    reporterName: user?.name || "", reporterEmail: user?.email || "",
  });
  const [detection, setDetection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!form.harmfulContent.trim()) { setDetection(null); return; }
    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.post("/api/complaints/detect", { text: form.harmfulContent });
        setDetection(data);
      } catch {}
    }, 500);
    return () => clearTimeout(timer);
  }, [form.harmfulContent]);

  const handleSubmit = async () => {
    setLoading(true); setError(""); setShowConfirm(false);
    try {
      // Use authenticated route if logged in so complaint links to user account
      if (user) {
        await axios.post("/api/complaints", {
          ...form,
          reporterName: user.name,
          reporterEmail: user.email,
        });
      } else {
        await axios.post("/api/complaints/guest", { ...form });
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors";

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="glass-dark rounded-2xl p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="font-display text-2xl font-bold text-white mb-3">Complaint Filed!</h2>
        <p className="text-slate-400 mb-2">Your complaint has been submitted and assigned to an administrator.</p>
        <p className="text-slate-500 text-sm mb-6">Our team typically responds within 24 hours.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          {user && <Link to="/my-complaints" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold text-sm">View My Complaints</Link>}
          <Link to="/" className="px-5 py-2.5 rounded-xl glass border border-white/10 text-white font-semibold text-sm">Go Home</Link>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-red-500/30 text-xs text-red-400 font-medium mb-4">
            Report Cyberbullying
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">File a Complaint</h1>
          <p className="text-slate-400">Your report will be reviewed by one of our certified administrators within 24 hours.</p>
          {!user && (
            <p className="text-yellow-400 text-xs mt-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2 inline-block">
              Tip: <Link to="/login" className="underline">Sign in</Link> to track your complaint status in My Reports
            </p>
          )}
        </motion.div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-3">
              <div className={"w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all " + (step > s ? "bg-green-500 text-white" : step === s ? "bg-brand-500 text-white" : "bg-dark-700 text-slate-500")}>
                {step > s ? "✓" : s}
              </div>
              {s < 3 && <div className={"w-12 h-0.5 " + (step > s ? "bg-green-500" : "bg-dark-700")} />}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-16 mb-8 text-xs text-slate-500">
          <span className={step >= 1 ? "text-white" : ""}>Your Info</span>
          <span className={step >= 2 ? "text-white" : ""}>Incident</span>
          <span className={step >= 3 ? "text-white" : ""}>Evidence</span>
        </div>

        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="glass-dark rounded-2xl p-6 space-y-4">

          {step === 1 && (
            <>
              <h3 className="text-white font-semibold text-lg mb-4">Your Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1.5">Your Name</label>
                  <input value={form.reporterName} onChange={e => setForm({ ...form, reporterName: e.target.value })}
                    placeholder="Full name" className={inp} disabled={!!user} />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1.5">Your Email</label>
                  <input type="email" value={form.reporterEmail} onChange={e => setForm({ ...form, reporterEmail: e.target.value })}
                    placeholder="your@email.com" className={inp} disabled={!!user} />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">Offender Name / Username</label>
                <input value={form.offenderName} onChange={e => setForm({ ...form, offenderName: e.target.value })}
                  placeholder="Name or username of the bully" className={inp} />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">Platform Where It Happened</label>
                <select value={form.offenderPlatform} onChange={e => setForm({ ...form, offenderPlatform: e.target.value })} className={inp}>
                  <option value="">Select platform...</option>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <button onClick={() => { if (!form.offenderName || !form.offenderPlatform) return; setStep(2); }}
                disabled={!form.offenderName || !form.offenderPlatform}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold text-sm disabled:opacity-40">
                Next: Describe Incident
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="text-white font-semibold text-lg mb-4">Describe the Incident</h3>
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">What happened?</label>
                <textarea value={form.incidentDescription} onChange={e => setForm({ ...form, incidentDescription: e.target.value })}
                  placeholder="Describe the cyberbullying incident in detail..." rows={5}
                  className={inp + " resize-none"} />
                <p className="text-slate-600 text-xs mt-1 text-right">{form.incidentDescription.length} characters</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl glass border border-white/10 text-white font-semibold text-sm">Back</button>
                <button onClick={() => { if (!form.incidentDescription.trim()) return; setStep(3); }}
                  disabled={!form.incidentDescription.trim()}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold text-sm disabled:opacity-40">
                  Next: Add Evidence
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="text-white font-semibold text-lg mb-4">Paste Harmful Content</h3>
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">
                  Copy and paste the exact harmful messages
                  <span className="text-slate-600 ml-1">(helps AI detect severity)</span>
                </label>
                <textarea value={form.harmfulContent} onChange={e => setForm({ ...form, harmfulContent: e.target.value })}
                  placeholder="Paste the exact messages or posts that were harmful..." rows={5}
                  className={inp + " resize-none"} />
                <p className="text-slate-600 text-xs mt-1 text-right">{form.harmfulContent.length} characters</p>
              </div>

              <AnimatePresence>
                {detection && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className={"rounded-xl p-4 border " + (SEV_CFG[detection.severity]?.bg || "")}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold text-sm">AI Detection Result</span>
                      <span className={"text-xs font-bold " + (SEV_CFG[detection.severity]?.color || "")}>{SEV_CFG[detection.severity]?.label}</span>
                    </div>
                    {detection.detected?.length > 0 ? (
                      <>
                        <p className="text-slate-400 text-xs mb-2">{detection.count} harmful word{detection.count > 1 ? "s" : ""} detected:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {detection.detected.map(w => (
                            <span key={w} className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-medium">{w}</span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-green-400 text-xs">No explicit harmful words detected, but context will be reviewed by admin.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

              {/* Confirm dialog */}
              {showConfirm && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl p-4 bg-dark-700 border border-white/10">
                  <p className="text-white font-semibold text-sm mb-1">Confirm Submission</p>
                  <p className="text-slate-400 text-xs mb-3">Are you sure you want to submit this complaint? This action cannot be undone.</p>
                  <div className="flex gap-2">
                    <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 rounded-lg glass border border-white/10 text-white text-sm">Cancel</button>
                    <button onClick={handleSubmit} disabled={loading}
                      className="flex-1 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-40"
                      style={{ background: "linear-gradient(135deg,#ef4444,#be123c)" }}>
                      {loading ? "Submitting..." : "Yes, Submit"}
                    </button>
                  </div>
                </motion.div>
              )}

              {!showConfirm && (
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="px-5 py-3 rounded-xl glass border border-white/10 text-white font-semibold text-sm">Back</button>
                  <button onClick={() => setShowConfirm(true)} disabled={!form.harmfulContent.trim()}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm text-white disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg,#ef4444,#be123c)", boxShadow: "0 0 20px rgba(239,68,68,0.3)" }}>
                    Submit Complaint
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
        <p className="text-center text-slate-600 text-xs mt-4">Your complaint is confidential and will only be seen by our certified administrators.</p>
      </div>
    </div>
  );
}
"""

# ── MyComplaints.jsx — add search/filter, complaint ID, better UX ──────────
my_complaints = r"""import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const STATUS = {
  pending:      { label: 'Pending',      color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  under_review: { label: 'Under Review', color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/30' },
  resolved:     { label: 'Resolved',     color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/30' },
  dismissed:    { label: 'Dismissed',    color: 'text-slate-400',  bg: 'bg-slate-500/10 border-slate-500/30' },
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
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('/api/complaints/my')
      .then(r => setComplaints(r.data.complaints))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const filtered = complaints.filter(c => {
    const matchSearch = !search || c.offenderName?.toLowerCase().includes(search.toLowerCase()) || c.incidentDescription?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

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

        {/* Search & Filter */}
        {complaints.length > 0 && (
          <div className="flex gap-3 mb-6 flex-wrap">
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by offender or description..."
              className="flex-1 min-w-48 px-4 py-2.5 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors" />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-dark-700 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-500 transition-colors">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
            {(search || filterStatus) && (
              <button onClick={() => { setSearch(''); setFilterStatus(''); }}
                className="px-4 py-2.5 rounded-xl glass border border-white/10 text-slate-400 hover:text-white text-sm transition-colors">
                Clear
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
          </div>
        ) : complaints.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-white font-semibold mb-2">No complaints filed yet</p>
            <p className="text-slate-400 text-sm mb-6">If you have experienced cyberbullying, report it — our admins are here to help.</p>
            <Link to="/file-complaint" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold text-sm">
              File a Complaint
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-slate-400">No complaints match your search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-slate-500 text-xs">{filtered.length} complaint{filtered.length !== 1 ? 's' : ''}</p>
            {filtered.map((c, i) => (
              <motion.div key={c._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5 hover:border-brand-500/30 transition-all border border-white/5">
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
                      <span className="text-slate-700 text-xs font-mono">#{c._id.slice(-6).toUpperCase()}</span>
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
                  <button
                    onClick={() => setSelected(selected?._id === c._id ? null : c)}
                    className="text-xs text-brand-400 hover:text-brand-300 transition-colors shrink-0 font-medium">
                    {selected?._id === c._id ? 'Hide Details ▲' : 'View Details ▼'}
                  </button>
                </div>

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
                      <p className="text-yellow-400 text-xs">⏳ Awaiting admin review. You will be notified once reviewed.</p>
                    )}
                    <p className="text-slate-700 text-xs">Complaint ID: {c._id}</p>
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
"""

files = {
    'client/src/pages/FileComplaint.jsx': file_complaint,
    'client/src/pages/MyComplaints.jsx': my_complaints,
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    print(f'Written: {path}')

print('Done batch 2')
