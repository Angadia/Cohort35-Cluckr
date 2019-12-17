const knexDevelopmentConfig = require('../knexfile').development;
const knex = require('knex');

module.exports = knex(knexDevelopmentConfig);
