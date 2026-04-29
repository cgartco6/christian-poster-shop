require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const passport = require('passport');
const cron = require('node-cron');
const path = require('path');
const { startScheduler } = require('./services/scheduler');

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Session store in MongoDB
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 1000*60*60*24 }
}));

// Passport init
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Other middleware...
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./routes/web'));
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));
app.use('/payment', require('./routes/payment'));
app.use('/marketing', require('./routes/marketing'));
app.use('/webhooks', require('./routes/webhooks'));

// Start cron jobs for scheduled social posts
startScheduler();

app.listen(process.env.PORT, () => console.log(`Server on port ${process.env.PORT}`));
