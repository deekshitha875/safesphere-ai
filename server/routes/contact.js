const router = require('express').Router();
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// User sends a contact message — saves to DB
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: 'All fields required' });
    const contact = await Contact.create({ name, email, message });
    res.json({ success: true, message: 'Message received. We will get back to you soon!', id: contact._id });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: get all contact messages
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const messages = await Contact.find().sort({ createdAt: -1 });
    const unread = await Contact.countDocuments({ isRead: false });
    res.json({ messages, unread });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: mark message as read
router.patch('/admin/:id/read', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: reply to a message
router.patch('/admin/:id/reply', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ message: 'Reply text required' });
    await Contact.findByIdAndUpdate(req.params.id, { adminReply: reply, repliedAt: new Date(), isRead: true });
    res.json({ success: true, message: 'Reply saved' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
