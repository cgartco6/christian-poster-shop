const axios = require('axios');

async function verifyRecaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`);
  return response.data.success;
}

module.exports = { verifyRecaptcha };
