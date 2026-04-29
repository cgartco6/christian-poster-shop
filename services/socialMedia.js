const axios = require('axios');

async function postToFacebook(message, imageUrl) {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const url = `https://graph.facebook.com/v18.0/${pageId}/feed`;
  const res = await axios.post(url, { message, access_token: accessToken });
  return res.data;
}

async function postToInstagram(message, imageUrl) {
  // Instagram Graph API requires media container first
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const igUserId = process.env.INSTAGRAM_USER_ID;
  // ... full implementation
  return { id: 'mock' };
}

async function postToTikTok(message, videoUrl) {
  // TikTok Business API
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  // ...
}

module.exports = { postToFacebook, postToInstagram, postToTikTok };
