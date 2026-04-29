const cron = require('node-cron');
const ScheduledPost = require('../models/ScheduledPost');
const { postToFacebook, postToInstagram, postToTikTok } = require('./socialMedia');

function startScheduler() {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const duePosts = await ScheduledPost.find({ scheduledFor: { $lte: now }, status: 'pending' });
    for (const post of duePosts) {
      try {
        if (post.platform === 'facebook') await postToFacebook(post.message, post.imageUrl);
        else if (post.platform === 'instagram') await postToInstagram(post.message, post.imageUrl);
        else if (post.platform === 'tiktok') await postToTikTok(post.message, post.imageUrl);
        post.status = 'completed';
      } catch (err) {
        post.status = 'failed';
        post.error = err.message;
      }
      await post.save();
    }
  });
}

module.exports = { startScheduler };
