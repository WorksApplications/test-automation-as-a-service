var request = require('supertest');
var assert = require('assert');
var app = require('../../index');

describe('Branches scan test', function() {
  var serial;

  it('PUT /branches', function(done) {
    request(app).put('/branches')
                .expect(201)
                .expect(function(res) {
                  assert.equal(res.body.success, true);
                  assert.equal(res.body.info, 'A job for listing branches is triggered.');
                  serial = res.body.serial;
                })
                .end(done);
  });

  it('Wait for the branch scanning job to finish', function(done) {
    process.stdout.write('      Wait for finish');
    this.timeout(21000);
    var count = 20;
    var handle = setInterval(function() {
      process.stdout.write('.');
      count--;
      if(count === 0) clearInterval(handle);
      request(app).get(`/testjobs/${serial}`)
                  .expect(200)
                  .expect(function(res) {
                    if(res.body.testjobs.status === 'Error') {
                      clearInterval(handle);
                      done(new Error('The branch scan job end with an ERROR status'));
                    }
                    if(res.body.testjobs.status === 'Finished') {
                      // Success
                      process.stdout.write('\n');
                      clearInterval(handle);
                      done();
                    }
                  })
                  .end(function() {});
    }, 1000);
  });

  it('Check the groups info is updated', function(done) {
    request(app).get('/branches')
                .expect(200)
                .expect(function(res) {
                  assert.equal(res.body.success, true);
                  assert.ok(new Date() - new Date(res.body.lastUpdate) < 5000);
                })
                .end(done);
  });

  it('PUT another /branches', function(done) {
    request(app).put('/branches')
                .expect(201)
                .expect(function(res) {
                  assert.equal(res.body.success, true);
                  assert.equal(res.body.info, 'A job for listing branches is triggered.');
                  serial = res.body.serial;
                })
                .end(function() { setTimeout(done, 1000); });
  });

  it('Cancel the scan job', function(done) {
    request(app).delete('/testjobs/' + serial)
                .expect(200)
                .expect(function(res) {
                  assert.equal(res.body.success, true);
                  assert.equal(res.body.info, 'Test job canceled.');
                })
                .end(done);
  });

  it('Check the job is canceled', function(done) {
    request(app).get('/testjobs/' + serial)
                .expect(200)
                .expect(function(res) {
                  assert.equal(res.body.success, true);
                  assert.equal(res.body.info, 'OK');
                  assert.equal(res.body.testjobs.status, 'Canceled');
                })
                .end(done);
  });
});
