var should = require('chai').should();

var sep = require('path').sep;
var libFolder = __dirname + sep + 'lib' + sep;

describe('end to end test', function() {

  var loadIntervalPtr;
   var loadInterval = 1;

  before(function(){

    loadIntervalPtr = setInterval(function(){
      var randomOpResult = ((Math.random() * Math.random()) * 100) % 10;
    }, loadInterval);

  });

  after(function(){
    clearInterval(loadIntervalPtr);
  });

   it('gets just the memory usage', function(done) {

    this.timeout(10000);
   
    var procStats = require('../index.js');

    memoryUsage = procStats.getMemoryUsage();

    console.log(memoryUsage);

    done();

  });

  it('gets process stats passing in parameters', function(done) {

    this.timeout(10000);
   
    var procStats = require('../index.js');

    procStats.stats({}, function(e, result){

      if (e) return done(e);

      console.log(result);

      done();

    });

  });

  it('gets process stats, without passing in parameters', function(done) {

    this.timeout(10000);
   
    var procStats = require('../index.js');

    procStats.stats(function(e, result){

      if (e) return done(e);

      console.log(result);

      done();

    });

  });

   it('emits stats, n times', function(done) {

    this.timeout(40000);
    var procStats = require('../index.js');
    var runAmounts = 0;

    var interval = setInterval(function(){

      procStats.stats(function(e, result){

        if (e){
          clearInterval(interval);
          return done(e);
        }

        console.log(result);
        runAmounts++;

        if (runAmounts >= 10){
          clearInterval(interval);
          done();
        }

      });

    }, 1000)
    
  });

});
