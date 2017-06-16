const chai = require('chai');

const {
  canonicalSubwayRoutes,
  userSubwayRoutes,
  imgMap,
} = require('./constants');

describe('imgMap', function() {

  it('should be the same size as the canonical routes', function() {
    Object.keys(imgMap).should.have.lengthOf(canonicalSubwayRoutes.length);
  });

});

describe('userSubwayRoutes', function() {

  const canonicalOnly = ['GS', 'FS', 'H'];

  it('should be an array of strings', function() {
    userSubwayRoutes.should.be.an('array');
    userSubwayRoutes.forEach((item) =>{
      item.should.be.a('string');
    });
  });

  it('should differ from the canonical routes', function() {
    userSubwayRoutes.should.not.have.members(canonicalSubwayRoutes);
  })

  it('should not contain canonical-only routes', function() {
    userSubwayRoutes.should.be.an('array').to.not.include.members(canonicalOnly);
  })

});
