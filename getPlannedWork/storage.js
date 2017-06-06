const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const { routes } = require('./constants.js');
const getWorkBatches = require('./crawler.js');
const plannedWork = getWorkBatches();

const url =  'mongodb://heroku_q0wnv9k0:r8lguve6kh0u47vifn400950jr@ds127949.mlab.com:27949/heroku_q0wnv9k0';

MongoClient.connect(url)
  .then((db) => {
    // clear old data
    db.collection('plannedWork').deleteMany({});
    return Promise.all([db, plannedWork])
  })
  .then((foobar) => {
    // insert new data
    const [db, data] = foobar;
    db.collection('plannedWork').insertMany(data);
    db.close();
  })
  .catch(console.error);
