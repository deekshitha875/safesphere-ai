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
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ complaint, message: 'Complaint updated successfully' });
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
