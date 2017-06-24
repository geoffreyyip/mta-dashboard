const MongoClient = require('mongodb').MongoClient

const { dbURL } = require('./constants.js')

module.exports = MongoClient.connect(dbURL)
  .then(db => {
    return db.collection('plannedWork').find({}).toArray()
  })
  .catch(console.error)
