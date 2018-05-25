//var assert = require('assert');
var recorder = require('../../runner/recorder-agent');

describe('VNC Video Recorder Test', function() {
  it('Start record', async function() {
    this.timeout(10000);
    await recorder.startRecord(1234, '172.26.142.202', '5900', '111111');
  });

  it('Stop record', async function() {
    await recorder.stopRecord(1234);
  });
});
