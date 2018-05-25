var assert = require('assert');
var recorder = require('../../runner/recorder');
var fs = require('fs-extra');
var procPool = require('../../runner/process-pool');

describe('VNC Video Recorder Test', function() {
  function sleep(ms) {
    return new global.Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
  it('Start 2 record', async function() {
    var options = {
      fps: 15,
      keyframe: 150,
      //noMouse: true,
      //encoding: 'raw',
      blockSize: 32,
      clipping: '1920x1080+0-0',
      //debug: true
    };
    await recorder.startRecord(123, 'taas-develop.internal.worksap.com', 25901, __dirname + '/123.flv', options);
    await recorder.startRecord(456, 'taas-develop.internal.worksap.com', 25901, __dirname + '/456.flv', options);
  });

  it('Start a record with password', async function() {
    var options = {
      fps: 15,
      keyframe: 150,
      password: '111111',
      blockSize: 32,
      clipping: '1920x1080+0-0',
      //debug: true
    };
    await recorder.startRecord(789, '172.26.142.202', 5900, __dirname + '/789.flv', options);
  });

  it('Keep record for 10 seconds', async function() {
    this.timeout(12000);
    await sleep(10000);
    assert.ok(procPool.hasJob('REC-123'));
    assert.ok(procPool.hasJob('REC-456'));
    assert.ok(procPool.hasJob('REC-789'));
  });

  it('Test stop record', async function() {
    await recorder.stopRecord(123);
    assert.ok(fs.existsSync(__dirname + '/123.flv'));
    assert.ok(fs.statSync(__dirname + '/123.flv').size > 1024 * 1024);
    fs.remove(__dirname + '/123.flv');
  });

  it('Test if record with password is successed', async function() {
    await recorder.stopRecord(789);
    assert.ok(fs.existsSync(__dirname + '/789.flv'));
    assert.ok(fs.statSync(__dirname + '/789.flv').size > 1024 * 1024);
    fs.remove(__dirname + '/789.flv');
  });

  it('Test cancel record', async function() {
    assert.ok(fs.existsSync(__dirname + '/456.flv'));
    await recorder.cancelRecord(456);
    assert.ok(!fs.existsSync(__dirname + '/456.flv'));
  });

  it('Test cancel non-exist record', async function() {
    await recorder.cancelRecord(456);
  });

  it('Create a record with wrong parameters', async function() {
    this.timeout(4000);
    await recorder.startRecord(123, 'localhost', 12345, __dirname + '/123.flv');
    await sleep(3500);
    await recorder.cancelRecord(123);
    fs.remove(__dirname + '/123.flv');
  });
});
