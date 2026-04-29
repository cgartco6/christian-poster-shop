// services/marketingAlgo.js
const moment = require('moment');

class MarketingAlgorithm {
  constructor() {
    // Engagement patterns based on platform research
    this.platformPatterns = {
      facebook: {
        bestDays: [2, 3, 4], // Tuesday, Wednesday, Thursday
        bestHours: [9, 10, 11, 14, 15], // 9-11 AM, 2-3 PM
        frequency: '1-2 posts/day',
        contentTypes: ['images', 'videos', 'links']
      },
      instagram: {
        bestDays: [1, 2, 3, 4, 5], // Weekdays
        bestHours: [11, 12, 13, 18, 19, 20], // 11 AM-1 PM, 6-8 PM
        frequency: '1-3 posts/day',
        contentTypes: ['images', 'reels', 'stories']
      },
      tiktok: {
        bestDays: [0, 1, 2, 3, 4, 5, 6], // Any day
        bestHours: [6, 7, 8, 9, 18, 19, 20, 21, 22], // Morning and evening peak
        frequency: '1-4 posts/day',
        contentTypes: ['videos', 'duets']
      }
    };
  }

  getBestPostingTimes(platform = null) {
    if (platform && this.platformPatterns[platform]) {
      const pattern = this.platformPatterns[platform];
      return {
        platform,
        bestDays: pattern.bestDays.map(d => moment().day(d).format('dddd')),
        bestHours: pattern.bestHours,
        frequency: pattern.frequency
      };
    }
    
    // Return all platforms recommendations
    const recommendations = {};
    for (const [plat, pattern] of Object.entries(this.platformPatterns)) {
      recommendations[plat] = {
        bestDays: pattern.bestDays.map(d => moment().day(d).format('dddd')),
        bestHours: pattern.bestHours,
        nextOptimalTime: this.getNextOptimalTime(plat)
      };
    }
    return recommendations;
  }

  getNextOptimalTime(platform) {
    const pattern = this.platformPatterns[platform];
    if (!pattern) return null;
    
    const now = moment();
    let nextTime = null;
    
    for (let i = 0; i < 7; i++) {
      const checkDay = now.clone().add(i, 'days');
      if (pattern.bestDays.includes(checkDay.day())) {
        for (const hour of pattern.bestHours) {
          const candidate = checkDay.clone().hour(hour).minute(0).second(0);
          if (candidate.isAfter(now)) {
            nextTime = candidate;
            break;
          }
        }
        if (nextTime) break;
      }
    }
    
    return nextTime ? nextTime.format('YYYY-MM-DD HH:mm:ss') : null;
  }

  checkPlatformStatus() {
    // Simulate platform API health checks
    const status = {
      facebook: { online: true, apiVersion: 'v18.0', rateLimit: 85, lastSync: new Date() },
      instagram: { online: true, apiVersion: 'v18.0', rateLimit: 92, lastSync: new Date() },
      tiktok: { online: true, apiVersion: 'v1.3', rateLimit: 78, lastSync: new Date() }
    };
    
    // Advanced algorithm to determine best posting strategy
    const recommendations = {};
    for (const [platform, data] of Object.entries(status)) {
      const pattern = this.platformPatterns[platform];
      recommendations[platform] = {
        shouldPost: data.rateLimit > 30,
        optimalTime: this.getNextOptimalTime(platform),
        suggestedContent: pattern.contentTypes[Math.floor(Math.random() * pattern.contentTypes.length)],
        estimatedReach: Math.floor(Math.random() * 5000) + 500
      };
    }
    
    return { platformStatus: status, recommendations };
  }

  getPerformanceInsights(campaigns) {
    const totalCampaigns = campaigns.length;
    const published = campaigns.filter(c => c.status === 'published').length;
    const scheduled = campaigns.filter(c => c.status === 'scheduled').length;
    const drafts = campaigns.filter(c => c.status === 'draft').length;
    
    // Calculate engagement trends
    const engagementByPlatform = {
      facebook: { total: 0, posts: 0 },
      instagram: { total: 0, posts: 0 },
      tiktok: { total: 0, posts: 0 }
    };
    
    campaigns.forEach(campaign => {
      campaign.targetPlatforms?.forEach(platform => {
        if (engagementByPlatform[platform]) {
          engagementByPlatform[platform].total += campaign.performance.engagement;
          engagementByPlatform[platform].posts++;
        }
      });
    });
    
    return {
      summary: { totalCampaigns, published, scheduled, drafts },
      engagementByPlatform,
      recommendations: this.getPostingRecommendations(),
      nextBestTime: this.getNextOptimalTime('facebook')
    };
  }

  getPostingRecommendations() {
    return {
      facebook: "Post between 9-11 AM or 2-3 PM on Tuesday-Thursday. Use inspirational images with Bible verses.",
      instagram: "Best engagement at 11 AM-1 PM or 6-8 PM on weekdays. Use high-quality poster previews with relevant hashtags.",
      tiktok: "Post at 6-9 AM or 6-10 PM any day. Create short 15-30 second videos showing the posters.",
      crossPlatform: "Share same content across platforms but optimize format: carousel for Instagram, link preview for Facebook, trending audio for TikTok."
    };
  }
}

module.exports = new MarketingAlgorithm();
