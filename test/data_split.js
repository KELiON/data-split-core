var should = require('should');


describe("DataSplit", function(){
  var fs = require('fs');
  var css = fs.readFileSync('./test/fixtures.css').toString();
  var DataSplit = require('../build/lib/data_split');

  it("Should move all data attributes to inlines", function(){
    var dataSplit = new DataSplit({
      minLength: 500
    });
    var result = dataSplit.process(css);
    result.inlines.toString().match(/url\(('|")?data/g).length.should.eql(3);
    (result.target.toString().match(/url\(('|")?data/g) === null).should.be.true;
  });

  it("Should move two data attributes to inlines", function(){
    var dataSplit = new DataSplit({
      minLength: 550
    });
    var result = dataSplit.process(css);
    result.inlines.toString().match(/url\(('|")?data/g).length.should.eql(2);
    result.target.toString().match(/url\(('|")?data/g).length.should.eql(1);
  });
});