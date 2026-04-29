const axios = require('axios');

async function postToFacebook(message, imageUrl) {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;
  let postData = { message, access_token: accessToken };
  if (imageUrl) postData = { message, url: imageUrl, access_token: accessToken, published: true };
  const response = await axios.post(`https://graph.facebook.com/v18.0/${pageId}/feed`, postData);
  return response.data;
}

async function postToInstagram(message, imageUrl) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const igUserId = process.env.INSTAGRAM_USER_ID;
  // First create media container
  const container = await axios.post(`https://graph.facebook.com/v18.0/${igUserId}/media`, {
    image_url: imageUrl,
    caption: message,
    access_token: accessToken
  });
  // Then publish
  const publish = await axios.post(`https://graph.facebook.com/v18.0/${igUserId}/media_publish`, {
    creation_id: container.data.id,
    access_token: accessToken
  });
  return publish.data;
}

async function postToTikTok(message, videoUrl) {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  // TikTok Business API requires video upload – simplified mock for brevity
  console.log('TikTok post', message);
  return { success: true };
}

module.exports = { postToFacebook, postToInstagram, postToTikTok };
