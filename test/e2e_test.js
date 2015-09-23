var should = require('chai').should();

var sep = require('path').sep;
var libFolder = __dirname + sep + 'lib' + sep;
var async = require('async');

describe('end to end test', function() {

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

    this.timeout(20000);
    var procStats = require('../index.js');
    var runAmounts = 0;

    var interval = setInterval(function(){

      procStats.stats(function(e, result){

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
