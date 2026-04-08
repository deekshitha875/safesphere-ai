const router = require('express').Router();
const Analysis = require('../models/Analysis');
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
    res.json({ total, flagged, safe, safetyScore, byLabel, recent: analyses.slice(0, 10) });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
