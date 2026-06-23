// app.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('./db/queries');
const authRouter = require('./routes/authRouter');
const messageRouter = require('./routes/messageRouter');

require('dotenv').config();

const app = express();

// Set up directory locations matching target template files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Parse incoming HTTP payload body objects safely
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup tracking session cookies
app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: false 
}));

// Connect local instance configurations to active passport runtime engines
app.use(passport.initialize());
app.use(passport.session());

// Passport Strategy to authorize profile match attempts within database
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const [user] = await db.getUserByUsername(username);

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

// Instruct passport on tracking active entity primary key parameters inside the cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Rehydrate detailed record data properties using reference keys derived from tracking cookies
passport.deserializeUser(async (id, done) => {
  try {
    const [user] = await db.getUserById(id);
    done(null, user);
  } catch(err) {
    done(err);
  }
});

// Global state middleware ensuring user contexts remain visible within template variables
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Bind endpoint routers to execution chains
app.use('/', authRouter);
app.use('/', messageRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Exclusive Clubhouse processing on port ${PORT}!`));
