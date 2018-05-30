require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');

const auth0Strategy = require(`${__dirname}/strategy`);

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(auth0Strategy);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get(
  '/login',
  passport.authenticate('auth0', {
    successRedirect: '/me',
    failureRedirect: '/login',
    failureFlash: true
  })
);

app.get('/me', (req, res) => {
  if (!req.user) res.status(403).json('Not Logged In');
  else res.status(200).json(req.user);
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});