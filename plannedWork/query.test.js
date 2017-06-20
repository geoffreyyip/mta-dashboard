var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();

const assert = require('assert');
const query = require('./query.js');

describe('query', function() {
  it('should fulfill', function() {
    return query.should.be.fulfilled;
  });

  it('should return an array of objects', function() {
    return query.should.eventually.be.an.instanceof(Array);
  });
});
