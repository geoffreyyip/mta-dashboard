const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const { routes } = require('./constants.js');

const url =  'mongodb://heroku_q0wnv9k0:r8lguve6kh0u47vifn400950jr@ds127949.mlab.com:27949/heroku_q0wnv9k0';

module.exports = MongoClient.connect(url)
  .then((db) => {
    return db.collection('plannedWork').find({}).toArray();
  })
  .catch(console.error);
