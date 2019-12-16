const express = require('express');
const knex = require("../db/client");
const TimeAgo = require("javascript-time-ago");
const en = require("javascript-time-ago/locale/en");

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo('en-US');

const router = express.Router();

const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

router.get('/sign_in', (req, res) => {
  if (!req.cookies.username) {
    res.locals.signedInUser = '';
    res.render('sign_in');
  } else {
    res.redirect('/');
  };
});

router.post('/sign_in', (req, res) => {
  const { username } = req.body;
  if (!username && !req.cookies.username) {
    res.redirect('/sign_in');
  }
  else {
    if (!username) {
      username = req.cookies.username;
    };
    res.cookie('username', username, { maxAge: ONE_WEEK });
    res.redirect('/');
  };
});

router.get('/sign_out', (req, res) => {
  res.clearCookie('username');
  res.redirect('/');
});

router.get('/clucks', (req, res) => {
  res.redirect('/');
});

router.get('/', (req, res) => {
  knex('clucks')
    .select('*')
    .orderBy('created_at', 'DESC')
  .then( clucks => {
    clucks.forEach(cluck => {
      cluck['time_ago'] = timeAgo.format(cluck.created_at);
    });
    res.locals.clucks = clucks;
    res.render("index");
  });
});

module.exports = router;
