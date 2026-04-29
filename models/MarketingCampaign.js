// models/MarketingCampaign.js
class MarketingCampaign {
  constructor(data) {
    this.id = Date.now();
    this.name = data.name;
    this.type = data.type; // 'ad', 'social_post', 'email'
    this.content = data.content;
    this.mediaUrl = data.mediaUrl;
    this.targetPlatforms = data.targetPlatforms || [];
    this.scheduledDate = data.scheduledDate || null;
    this.status = data.status || 'draft';
    this.createdAt = new Date();
    this.postedAt = null;
    this.performance = {
      impressions: 0,
      clicks: 0,
      engagement: 0
    };
  }
}

const campaigns = [];

module.exports = { MarketingCampaign, campaigns };
