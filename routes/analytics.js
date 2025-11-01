const express = require('express');
const router = express.Router();

// Analytics data storage (production'da MongoDB'ye kaydedilmeli)
const analyticsData = [];

router.post('/', (req, res) => {
  try {
    const data = req.body;
    analyticsData.push({
      ...data,
      receivedAt: new Date()
    });
    
    // Keep only last 10000 entries in memory
    if (analyticsData.length > 10000) {
      analyticsData.splice(0, analyticsData.length - 10000);
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Analytics save failed' });
  }
});

// Analytics dashboard (admin only)
router.get('/dashboard', (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.redirect('/auth/login');
  }
  
  // Calculate stats
  const stats = {
    totalSessions: new Set(analyticsData.map(d => d.sessionId)).size,
    totalEvents: analyticsData.reduce((sum, d) => sum + d.events.length, 0),
    topPages: {},
    eventsByCategory: {}
  };
  
  analyticsData.forEach(session => {
    session.events.forEach(event => {
      // Count pages
      stats.topPages[event.page] = (stats.topPages[event.page] || 0) + 1;
      
      // Count event categories
      stats.eventsByCategory[event.category] = (stats.eventsByCategory[event.category] || 0) + 1;
    });
  });
  
  res.render('analytics/dashboard', { stats });
});

module.exports = router;
