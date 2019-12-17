const express = require('express');
const knex = require('../db/client');

const router = express.Router();

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

function createHashTags(newHashTags, res) {
  if (newHashTags && newHashTags.length > 0) {
    knex('hash_tags')
      .insert({
        hash_tag: newHashTags[0],
        count: 1
      })
      .returning('*')
    .then(hashTagCount => {
      if (newHashTags.length > 1) {
        return createHashTags(newHashTags.slice(1), res);
      } else {
        res.redirect('../');
      };
    });
  } else {
    res.redirect('../');
  };
};

function updateHashTagsCounts(hashTagsCounts, newHashTags, res) {
  if (hashTagsCounts && hashTagsCounts.length > 0) {
    knex('hash_tags')
      .where({id: hashTagsCounts[0].id})
      .update({count: hashTagsCounts[0].count+1})
      .returning('*')
    .then(hashTagCount => {
      if (hashTagsCounts.length > 1) {
        return updateHashTagsCounts(hashTagsCounts.slice(1), newHashTags, res);
      } else {
        return createHashTags(newHashTags, res);
      };
    });
  } else {
    return createHashTags(newHashTags, res);
  };
};

function processHashTags(hashTags, res) {  
  knex('hash_tags')
    .select('*')
    .whereIn('hash_tag', hashTags)
  .then(hashTagsCounts => {
    const uniqueHashTags = hashTags.reduce((x,y) => x.includes(y) ? x : [...x,y], []);
    const newHashTags = [];

    const existingHashTags = hashTagsCounts && hashTagsCounts.length > 0 ? hashTagsCounts.map (hashTagCount => hashTagCount.hash_tag) : [];
    if (uniqueHashTags) {
      uniqueHashTags.map (hashTag => {
        if (!existingHashTags.includes(hashTag)) {
          newHashTags.push(hashTag);
        };
      });
    };
    updateHashTagsCounts(hashTagsCounts, newHashTags, res);
  });
};

router.post('/', (req, res) => {
  const content = req.body.content;
  const image_url = req.body.image_url;
  const username = req.cookies.username;

  if (content.length > 0 || image_url.length > 0) {
    knex('clucks')
      .insert({
        username: username,
        content: content,
        image_url: image_url
      })
      .returning('*')
    .then(cluck => {
      // regex for hashtags
      const re = /(^|)(#[a-z\d-]+)/ig;
      const hashTags = [];
      cluck[0].content.split(re).forEach( element => {
        if (element.length > 1 && element.startsWith('#')) {
          hashTags.push(element.slice(1).toLowerCase());
        };
      });
      if (hashTags.length > 0) {
        processHashTags(hashTags, res);
      } else {
        res.redirect('../');
      };
    });
  } else {
    res.redirect('clucks/new');
  };
});

module.exports = router;
