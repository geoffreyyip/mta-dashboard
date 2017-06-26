const getWorkBatches = require('./crawler.js')

describe('getWorkBatches', function() {
  it('should have at least one advisory message in each batch (slow)', async function() {
    this.timeout(30000)
    const workBatches = await getWorkBatches()

    workBatches.forEach(batch => {
      const routes = Object.keys(batch.advisories)
      const mssgCount = routes.reduce(
        (num, route) => num + batch.advisories[route].length,
        0
      )

      mssgCount.should.be.above(0)
    })
  })
})
