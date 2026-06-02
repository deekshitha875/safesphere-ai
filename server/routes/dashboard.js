const router = require('express').Router();
const Analysis = require('../models/Analysis');
const Complaint = require('../models/Complaint');
const authMiddleware = require('../middleware/auth');

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
    const total = analyses.length;
    const flagged = analyses.filter(a => a.result.label !== 'safe').length;
    const safe = total - flagged;
    const byLabel = { safe: 0, toxic: 0, hate: 0, harassment: 0 };
    analyses.forEach(a => { if (byLabel[a.result.label] !== undefined) byLabel[a.result.label]++; });
    const safetyScore = total > 0 ? Math.round((safe / total) * 100) : 100;

    // Complaint stats for this user
    const complaints = await Complaint.find({ reportedBy: req.user.id }).sort({ createdAt: -1 });
    const complaintStats = {
      total: complaints.length,
      pending: complaints.filter(c => c.status === 'pending').length,
      resolved: complaints.filter(c => c.status === 'resolved').length,
      critical: complaints.filter(c => c.severity === 'critical').length,
      recent: complaints.slice(0, 5),
    };

    res.json({ total, flagged, safe, safetyScore, byLabel, recent: analyses.slice(0, 10), complaints: complaintStats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
