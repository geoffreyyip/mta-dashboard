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

  it('should be an array of strings', function() {
    userSubwayRoutes.should.be.an('array');
    userSubwayRoutes.forEach((item) =>{
      item.should.be.a('string');
    });
  });

});
