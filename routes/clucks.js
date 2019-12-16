var express = require('express');
var router = express.Router();

const knex = require('../db/client');

router.get('/', (req, res) => {
    res.redirect('../');
});

router.get('/new', (req, res) => {
    if (!req.cookies.username) {
      res.locals.signedInUser = '';
      res.redirect('../sign_in');
    } else {
      res.render('clucks/new');
    };
});

router.post('/', (req, res) => {
    const content = req.body.content;
    const image_url = req.body.image_url;
    const username = req.cookies.username;
  
    if (content.length > 0 || image_url.length > 0) {
      knex('clucks')
        .insert({
          username: username,
          content: content,
          image_url: image_url,
        })
        .returning('*')
        .then(cluck => {
          res.redirect('../');
        });
    } else {
      res.redirect('clucks/new');
    };
});

module.exports = router;
