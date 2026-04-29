const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

router.get('/login', (req, res) => res.render('auth/login', { title: 'Login' }));
router.get('/register', (req, res) => res.render('auth/register', { title: 'Register' }));

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.redirect('/auth/register?error=Email already exists');
    await User.create({ name, email, password });
    res.redirect('/auth/login');
  } catch (err) {
    res.redirect('/auth/register?error=Registration failed');
  }
});

router.post('/login', passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: false
}));

router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

module.exports = router;
