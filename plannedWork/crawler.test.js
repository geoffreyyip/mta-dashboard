const getWorkBatches = require('./crawler.js')

describe('getWorkBatches', function() {
  let workBatches
  before(async function() {
    this.timeout(30000)
    workBatches = await getWorkBatches()
  })

  it('should return an array of objects (slow)', function() {
    workBatches.should.be.an('array').that.has.a.lengthOf(3)
  })

  it('should have the specified properties (slow)', function() {
    const foo = workBatches[1]

    foo.should.have.all.keys('type', 'start', 'end', 'advisories')
  })

  it('should have at least one advisory message in each batch (slow)', function() {
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
