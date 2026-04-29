const cron = require('node-cron');
const ScheduledPost = require('../models/ScheduledPost');
const { postToFacebook, postToInstagram } = require('./socialMedia');

function startScheduler() {
  // Every minute check for due posts
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const duePosts = await ScheduledPost.find({ scheduledFor: { $lte: now }, status: 'pending' });
    for (const post of duePosts) {
      try {
        if (post.platform === 'facebook') await postToFacebook(post.message, post.imageUrl);
        post.status = 'completed';
      } catch (err) {
        post.status = 'failed';
        post.error = err.message;
      }
      await post.save();
    }
  });
}
