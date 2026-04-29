// routes/marketing.js
const express = require('express');
const router = express.Router();
const { campaigns, MarketingCampaign } = require('../models/MarketingCampaign');
const socialService = require('../services/socialMedia');
const marketingAlgo = require('../services/marketingAlgo');

// Dashboard
router.get('/dashboard', (req, res) => {
  const recommendations = marketingAlgo.getPostingRecommendations();
  const platformStatus = marketingAlgo.checkPlatformStatus();
  
  res.render('marketing/dashboard', {
    title: 'Marketing Dashboard',
    campaigns,
    recommendations,
    platformStatus
  });
});

// Campaign management
router.get('/campaigns', (req, res) => {
  res.render('marketing/campaigns', { title: 'Campaign Manager', campaigns });
});

router.post('/campaigns/create', (req, res) => {
  const { name, type, content, mediaUrl, targetPlatforms, scheduledDate } = req.body;
  const campaign = new MarketingCampaign({
    name,
    type,
    content,
    mediaUrl,
    targetPlatforms: targetPlatforms ? targetPlatforms.split(',') : [],
    scheduledDate: scheduledDate || null
  });
  campaigns.push(campaign);
  res.redirect('/marketing/campaigns');
});

// Social Media Poster
router.get('/social-poster', (req, res) => {
  const connectedPlatforms = socialService.getConnectedPlatforms();
  const bestTimes = marketingAlgo.getBestPostingTimes();
  res.render('marketing/social-poster', {
    title: 'Social Media Poster',
    connectedPlatforms,
    bestTimes
  });
});

router.post('/social-poster/post', async (req, res) => {
  const { platforms, message, mediaUrl, scheduledTime } = req.body;
  const platformList = Array.isArray(platforms) ? platforms : [platforms];
  
  const result = await socialService.postToPlatforms(platformList, message, mediaUrl);
  
  if (result.success) {
    const campaign = new MarketingCampaign({
      name: `Social Post ${new Date().toLocaleString()}`,
      type: 'social_post',
      content: message,
      mediaUrl,
      targetPlatforms: platformList,
      status: scheduledTime ? 'scheduled' : 'published',
      scheduledDate: scheduledTime || null
    });
    campaigns.push(campaign);
  }
  
  res.json(result);
});

// Landing Page Builder
router.get('/landing-builder', (req, res) => {
  res.render('marketing/landing-builder', { title: 'Landing Page Builder' });
});

router.post('/landing-builder/create', (req, res) => {
  const { title, subtitle, ctaText, ctaLink, imageUrl, colorScheme } = req.body;
  const landingPageId = Date.now();
  
  // Store landing page configuration (in memory for demo)
  const landingPages = req.session.landingPages || [];
  landingPages.push({ id: landingPageId, title, subtitle, ctaText, ctaLink, imageUrl, colorScheme });
  req.session.landingPages = landingPages;
  
  res.json({
    success: true,
    url: `/landing/${landingPageId}`,
    embedCode: `<iframe src="/landing/${landingPageId}" width="100%" height="600"></iframe>`
  });
});

// View landing page
router.get('/landing/:id', (req, res) => {
  const landingPages = req.session.landingPages || [];
  const page = landingPages.find(p => p.id === parseInt(req.params.id));
  if (!page) return res.status(404).send('Landing page not found');
  
  res.render('marketing/landing-view', { title: page.title, page });
});

// Analytics and insights
router.get('/analytics', (req, res) => {
  const insights = marketingAlgo.getPerformanceInsights(campaigns);
  res.render('marketing/analytics', { title: 'Analytics', insights, campaigns });
});

// Auto-post scheduler API
router.post('/scheduler/schedule', (req, res) => {
  const { platform, message, time, repeat } = req.body;
  const scheduled = socialService.schedulePost(platform, message, time, repeat);
  res.json({ success: true, scheduled });
});

module.exports = router;
