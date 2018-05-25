var request = require('supertest');
var assert = require('assert');
var app = require('../../index');

describe('Schedule Test', function() {
  var scheduleSerial;
  var body = {
    name: 'Mocha',
    cron: '59 23 * * 6',
    timezone: 'Asia/Shanghai',
    params: {
      branch: 'develop',
      url: 'https://jillg-develop.hue.worksap.com/',
      channel: 'kuang_qi_test',
      channelId: 'C3NNDSEE4',
      testcases: ['qa.qe.MultiBrowserSampleTest#HueLoginTest'],
      username: 'hue-root',
      password: 'hue-r00t',
      platform: 'chrome',
      params: [],
      groups: []
    }
  };

  it('Create a normal schedule', function(done) {
    request(app).post('/schedules')
                .send(body)
                .expect(201)
                .expect(function(res) {
                  assert.equal(res.body.success, true);
                  assert.equal(res.body.info, 'Schedule is created.');
                  scheduleSerial = res.body.serial;
                })
                .end(done);
  });

  it('Get all schedules', function(done) {
    request(app).get('/schedules')
                .expect(200)
                .expect(function(res) {
                  assert.equal(res.body.success, true);
                  assert.equal(res.body.info, 'OK');
                  assert.ok(res.body.count >= 1);
                  assert.notEqual(res.body.schedules.map((ele) => ele.serial).indexOf(scheduleSerial), -1);
                })
                .end(done);
  });

  it('Get a specific schedule', function(done) {
    request(app).get('/schedules/' + scheduleSerial)
                .expect(200)
                .expect(function(res) {
                  assert.equal(res.body.success, true);
                  assert.equal(res.body.info, 'OK');
                  assert.equal(res.body.schedules.serial, scheduleSerial);
                })
                .end(done);
  });

  it('Update a schedule\'s name', function(done) {
    body.name = 'Mocha2';
    request(app).put('/schedules/' + scheduleSerial)
                .send({name: 'Mocha2'})
                .expect(200)
                .expect(function(res) {
                  assert.equal(res.body.success, true);
                  assert.equal(res.body.info, 'Schedule updated.');
                })
                .end(done);
  });

  it('Check the name is changed', function(done) {
    request(app).get('/schedules/' + scheduleSerial)
                .expect(200)
                .expect(function(res) {
                  assert.equal(res.body.success, true);
                  assert.equal(res.body.info, 'OK');
                  assert.equal(res.body.schedules.serial, scheduleSerial);
                  assert.equal(res.body.schedules.name, 'Mocha2');
                })
                .end(done);
  });

  it('Reschedule to run after 5 sec.', function(done) {
    body.name = 'Mocha2';
    var targetDate = new Date(Date.now() + 5000);
    request(app).put('/schedules/' + scheduleSerial)
                .send({cron: `${targetDate.getUTCSeconds()} ${targetDate.getUTCMinutes()} ${targetDate.getUTCHours()} ${targetDate.getUTCDate()} ${targetDate.getUTCMonth() + 1} *`, timezone: 'UTC'})
                .expect(200)
                .expect(function(res) {
                  assert.equal(res.body.success, true);
                  assert.equal(res.body.info, 'Schedule updated.');
                })
                .end(done);
  });

  it('Disable a schedule', function(done) {
    body.name = 'Mocha2';
    request(app).put('/schedules/' + scheduleSerial)
                .send({enabled: false})
                .expect(200)
                .expect(function(res) {
                  assert.equal(res.body.success, true);
                  assert.equal(res.body.info, 'Schedule updated.');
                })
                .end(done);
  });

  it('Enable a schedule', function(done) {
    body.name = 'Mocha2';
    request(app).put('/schedules/' + scheduleSerial)
                .send({enabled: true})
                .expect(200)
                .expect(function(res) {
                  assert.equal(res.body.success, true);
                  assert.equal(res.body.info, 'Schedule updated.');
                })
                .end(done);
  });

  it('Wait for a test job to be created automatically', function(done) {
    process.stdout.write('      Wait for a job to be created');
    this.timeout(12000);
    var count = 10;
    var handle = setInterval(function() {
      process.stdout.write('.');
      count--;
      if(count === 0) clearInterval(handle);
      request(app).get('/testjobs?limit=1')
                  .expect(200)
                  .expect(function(res) {
                    var name = res.body.testjobs[0].params.name;
                    var time = res.body.testjobs[0].create;
                    if(name.indexOf('Mocha2 (Executed ') === 0 && (new Date() - new Date(time) < 3000)) {
                      // Success
                      process.stdout.write('\n');
                      clearInterval(handle);

                      setTimeout(function() {
                        request(app).delete('/testjobs/' + res.body.testjobs[0].serial)
                                    .expect(200)
                                    .expect(function(res) {
                                      done();
                                    })
                                    .end(function() {});
                      }, 1000);
                    }
                  })
                  .end(function() {});
    }, 1000);
  });

  it('Delete a schedule', function(done) {
    request(app).delete('/schedules/' + scheduleSerial)
                .expect(200)
                .expect(function(res) {
                  assert.equal(res.body.success, true);
                  assert.equal(res.body.info, 'Schedule removed.');
                })
                .end(done);
  });

  it('Delete a non-exist schedule', function(done) {
    request(app).delete('/schedules/' + scheduleSerial)
                .expect(404)
                .expect(function(res) {
                  assert.equal(res.body.success, false);
                  assert.equal(res.body.info, 'Schedule not found.');
                })
                .end(done);
  });

  it('Update a non-exist schedule', function(done) {
    request(app).put('/schedules/' + scheduleSerial)
                .expect(404)
                .expect(function(res) {
                  assert.equal(res.body.success, false);
                  assert.equal(res.body.info, 'Schedule not found.');
                })
                .end(done);
  });

  it('Retrieve a non-exist schedule', function(done) {
    request(app).get('/schedules/' + scheduleSerial)
                .expect(404)
                .expect(function(res) {
                  assert.equal(res.body.success, false);
                  assert.equal(res.body.info, 'Schedule not found.');
                })
                .end(done);
  });

});
