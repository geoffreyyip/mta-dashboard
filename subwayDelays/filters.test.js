const {
  removeDuplicates,
  makeRoutesFilter,
  flattenToArray,
} = require('./filters.js');

const workBatches = require('./example.json');


describe('removeDuplicates', function() {

  let advisories;

  beforeEach(function() {
    advisories = workBatches[0].advisories;
  });

  it('should return an array of distinct values', function() {
    const unique = removeDuplicates(advisories);
    const flat = flattenToArray(unique);
    flat.length.should.equal(new Set(flat).size);
  });

});


describe('makeRoutesFilter', function() {

  let advisories;

  beforeEach(function() {
    advisories = workBatches[0].advisories;
  });

  it('should keep only the specified routes', function() {
    const routesToKeep = ['4', '5', '7', 'S'];
    const filter = makeRoutesFilter(routesToKeep);
    const result = filter(advisories);

    // result should have the specified routes and nothing more
    result.should.be.an('object').that.has.all.keys(routesToKeep);
    Object.keys(result).should.have.lengthOf(routesToKeep.length);
  });

  // TODO
  // it('should ignore non-subway routes', function() {
  // });

  // TODO
  // it('should throw an error with no argument', function() {
  // });

});
