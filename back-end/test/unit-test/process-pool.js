var assert = require('assert');
var processPool = require('../../runner/process-pool');

describe('Process Pool Module Test', function() {
  this.timeout(10000);
  it('Run a process and wait for termination', function(done) {
    var options = {
      stdio: 'pipe',
      detached: false,
      shell: false
    };
    processPool.spawn(0, 'ping', ['127.0.0.1', '-c', '2'], options, function(log, serial, src) {
      console.log(`${src.toUpperCase()}:   ${log}`);
    }).then(function(ret) {
      assert.strictEqual(ret.code, 0);
      done();
    });
    processPool.spawn(0, '', []).then(function() {
      assert.fail('Duplicated serial should not be allowed');
    }).catch(function(err) {
      if(!err) assert.fail('Error expected');
    });
  });

  it('Run a process with invalid arguments', function(done) {
    var options = {
      stdio: 'pipe',
      detached: false,
      shell: false
    };
    processPool.spawn(0, 'ping', ['-123'], options, function(log, serial, src) {
      console.log(`${src.toUpperCase()}:   ${log}`);
    }).then(function(ret) {
      assert.notStrictEqual(ret.code, 0);
      done();
    });
  });

  it('Run a non-exist process', function(done) {
    var options = {
      stdio: 'pipe',
      detached: false,
      shell: false
    };
    processPool.spawn(0, 'this-is-not-exist', [], options, function(log, serial, src) {
      console.log(`${src.toUpperCase()}:   ${log}`);
    }).then(function(code) {
      assert.fail('Promise should not be resolved. (Start a non-exist process)');
    }).catch(function(err) {
      assert.ok(err);
      done();
    });
  });

  it('Run a process and send SIGTERM', function(done) {
    var options = {
      stdio: 'pipe',
      detached: false,
      shell: false
    };
    processPool.spawn(0, 'ping', ['127.0.0.1'], options, function(log, serial, src) {
      console.log(`${src.toUpperCase()}:   ${log}`);
    }).then(function(ret) {
      assert.equal(ret.signal === 'SIGTERM', true);
      done();
    });
    setTimeout(function() {
      processPool.terminate(0);
    }, 2000);
  });

  it('Run a process and send SIGTERM then SIGKILL', function(done) {
    var options = {
      stdio: 'pipe',
      detached: false,
      shell: false
    };
    processPool.spawn(0, 'node', ['-i', '-e', 'console.log("Node is running"); process.on("SIGTERM", () => console.log("SIGTERM ignored"))'], options, function(log, serial, src) {
      console.log(`${src.toUpperCase()}:   ${log}`);
    }).then(function(ret) {
      assert.equal(ret.signal === 'SIGKILL', true);
      done();
    });
    setTimeout(function() {
      processPool.terminate(0, 1000);
    }, 1000);
  });

  it('Run a process and send SIGKILL without wait', function(done) {
    var options = {
      stdio: 'pipe',
      detached: false,
      shell: false
    };
    processPool.spawn(0, 'node', ['-i', '-e', 'console.log("Node is running"); process.on("SIGTERM", () => console.log("SIGTERM ignored"))'], options, function(log, serial, src) {
      console.log(`${src.toUpperCase()}:   ${log}`);
    }).then(function(ret) {
      assert.equal(ret.signal === 'SIGKILL', true);
      done();
    });
    setTimeout(function() {
      processPool.terminate(0, 0);
    }, 1000);
  });

  it('Terminate a non-exist process', function(done) {
    processPool.terminate('123456').then(function() {
      assert.fail('Promise should not be resolved. (Kill a non-exist process)');
    }).catch(function(err) {
      assert.ok(err);
      done();
    });
  });
});
