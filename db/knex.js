const knex = require('knex');
const knexFile = require('../knexfile.js');

const environment = process.env.NODE_ENV || 'development';
const config = knexFile[environment];

console.log(config);
module.exports = knex(config);
