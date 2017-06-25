const { cleanSubwayData, filterByRoutes } = require('./cleanser.js')

const workBatches = require('./example.json')

describe('cleanSubwayData', function() {
  // TODO
  // it('should delete blank text nodes', function () {
  // });

  it('should prune repeats in the advisories property', function() {
    const cleaned = cleanSubwayData(workBatches)
    cleaned.forEach(workBatch => {
      const advisories = workBatch.advisories
      const messages = [].concat(Object.keys(advisories))

      messages.should.have.lengthOf(new Set(messages).size)
    })
  })
})

describe('filterByRoutes', function() {
  it('should keep the same advisories for specified routes', function() {
    const routesToKeep = ['A', 'F', 'M', 'E', 'G']
    const filtered = filterByRoutes(workBatches, routesToKeep)

    filtered.forEach((workBatch, i) => {
      const newAdvisories = workBatch.advisories
      const oldWorkBatch = workBatches[i]
      const oldAdvisories = routesToKeep.reduce((result, route) => {
        // eslint-disable-next-line no-param-reassign
        result[route] = oldWorkBatch.advisories[route]
        return result
      }, {})
      newAdvisories.should.deep.equal(oldAdvisories)
    })
  })
})
