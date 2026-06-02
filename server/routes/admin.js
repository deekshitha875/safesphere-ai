const router = require('express').Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Admin-only middleware
const adminOnly = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

// Seed 3 default admins (run once)
router.get('/seed', async (req, res) => {
  try {
    const admins = [
      { name: 'Admin Arjun', email: 'admin1@safesphere.ai', password: 'Admin@123', role: 'admin', plan: 'enterprise' },
      { name: 'Admin Priya', email: 'admin2@safesphere.ai', password: 'Admin@123', role: 'admin', plan: 'enterprise' },
      { name: 'Admin Rahul', email: 'admin3@safesphere.ai', password: 'Admin@123', role: 'admin', plan: 'enterprise' },
    ];
    for (const a of admins) {
      const exists = await User.findOne({ email: a.email });
      if (!exists) await User.create(a);
    }
    res.json({ message: '3 admins seeded successfully', credentials: admins.map(a => ({ email: a.email, password: a.password })) });
  } catch (err) {
    res.status(500).json({ message: 'Seed failed', error: err.message });
  }
});

// Get all complaints (admin)
router.get('/complaints', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status, severity, page = 1 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .populate('reportedBy', 'name email')
      .populate('assignedAdmin', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * 20).limit(20);
    res.json({ complaints, total, pages: Math.ceil(total / 20) });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single complaint
router.get('/complaints/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('assignedAdmin', 'name email');
    if (!complaint) return res.status(404).json({ message: 'Not found' });
    res.json({ complaint });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update complaint status (admin action)
router.patch('/complaints/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status, adminNotes, adminAction } = req.body;
    const update = { status, adminNotes, adminAction, updatedAt: new Date() };
    if (status === 'resolved') update.resolvedAt = new Date();
    await Complaint.findByIdAndUpdate(req.params.id, update, { new: true });

    // Get the full complaint with reporter email
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const updated = await Complaint.findById(req.params.id).populate('reportedBy', 'email name');
    const reporterEmail = updated?.reportedBy?.email || updated?.reportedByEmail;

    if (reporterEmail && status) {
      const statusLabels = { pending: 'Pending', under_review: 'Under Review', resolved: 'Resolved ✅', dismissed: 'Dismissed' };
      try {
        await resend.emails.send({
          from: 'SafeSphere AI <onboarding@resend.dev>',
          to: reporterEmail,
          subject: `SafeSphere AI - Your complaint has been ${statusLabels[status] || status}`,
          html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:40px auto;background:#1e293b;border-radius:16px;overflow:hidden">
            <div style="background:linear-gradient(135deg,#6366f1,#9333ea);padding:24px;text-align:center">
              <h1 style="color:#fff;margin:0;font-size:20px">SafeSphere AI</h1>
              <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px">Complaint Status Update</p>
            </div>
            <div style="padding:24px">
              <p style="color:#94a3b8;font-size:14px">Your complaint against <strong style="color:#f87171">${updated.offenderName}</strong> on ${updated.offenderPlatform} has been updated.</p>
              <div style="background:#0f172a;border:2px solid #6366f1;border-radius:12px;padding:16px;text-align:center;margin:20px 0">
                <div style="font-size:22px;font-weight:800;color:#818cf8">${statusLabels[status] || status}</div>
              </div>
              ${adminAction ? `<p style="color:#94a3b8;font-size:13px"><strong style="color:#4ade80">Action Taken:</strong> ${adminAction}</p>` : ''}
              ${adminNotes ? `<p style="color:#94a3b8;font-size:13px"><strong style="color:#818cf8">Admin Notes:</strong> ${adminNotes}</p>` : ''}
              <p style="color:#64748b;font-size:12px">Login to SafeSphere AI to view full details.</p>
            </div>
          </div>`,
        });
      } catch(emailErr) { console.error('Email notification error:', emailErr.message); }
    }

    res.json({ complaint: updated, message: 'Complaint updated successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin dashboard stats
router.get('/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'pending' });
    const under_review = await Complaint.countDocuments({ status: 'under_review' });
    const resolved = await Complaint.countDocuments({ status: 'resolved' });
    const critical = await Complaint.countDocuments({ severity: 'critical' });
    const high = await Complaint.countDocuments({ severity: 'high' });
    const recent = await Complaint.find().sort({ createdAt: -1 }).limit(5).populate('reportedBy', 'name');
    const admins = await User.find({ role: 'admin' }, 'name email');
    const Contact = require('../models/Contact');
    const unreadMessages = await Contact.countDocuments({ isRead: false });
    res.json({ total, pending, under_review, resolved, critical, high, recent, admins, unreadMessages });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
