require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const connectDB = require('./config/db');
const { startScheduler } = require('./services/scheduler');
const errorHandler = require('./middleware/errorHandler');

const app = express();
connectDB();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 24 }
}));
app.use(passport.initialize());
app.use(passport.session());
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

// Health check
app.get('/health', (req, res) => res.send('OK'));

startScheduler();
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
