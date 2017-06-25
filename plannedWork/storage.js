const MongoClient = require('mongodb').MongoClient

const { dbURL } = require('./constants.js')
const getWorkBatches = require('./crawler.js')

const plannedWork = getWorkBatches()

MongoClient.connect(dbURL)
  .then(db => {
    // clear old data
    db.collection('plannedWork').deleteMany({})
    return Promise.all([db, plannedWork])
  })
  .then(foobar => {
    // insert new data
    const [db, data] = foobar
    db.collection('plannedWork').insertMany(data)
    db.close()
  })
  .catch(console.error)
