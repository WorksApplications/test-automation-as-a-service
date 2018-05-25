var counter = require('../../counter');
var assert = require('assert');

var NAME = 'mocha-test-counter';
var EventEmitter = require('events');
class RunnerEmitter extends EventEmitter {}
var emitter = new RunnerEmitter();
emitter.setMaxListeners(11000);

describe('Universal counter test', function() {
  var mochaCounter;
  it('Init counter', async function() {
    mochaCounter = counter(NAME);
    var val = await mochaCounter.current();
    assert.equal(val, 0);
  });

  it('Test counter', function(done) {
    this.timeout(30000);
    var MAX = 10000;
    var sum = 0;
    var i;
    var promiseArr = [];

    for(i = 1; i <= MAX; i++) {
      emitter.on('count', function() {
        var p = mochaCounter.next();
        promiseArr.push(p);
        p.then(function(val) { sum += val; });
      });
    }
    emitter.emit('count');
    global.Promise.all(promiseArr).then(function() {
      assert.equal(sum, MAX * (MAX + 1) / 2);
      done();
    });
  });

  it('Destroy counter', function(done) {
    mochaCounter.destroy().then(function(err) {
      if(err) done(err);
      else done();
    });
  });
});
