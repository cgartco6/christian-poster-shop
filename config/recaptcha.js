const axios = require('axios');

const verifyRecaptcha = async (token) => {
  if (!token) return false;
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: { secret, response: token }
    });
    return response.data.success;
  } catch (err) {
    console.error('reCAPTCHA error:', err);
    return false;
  }
};

module.exports = { verifyRecaptcha };
