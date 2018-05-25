var request = require('supertest');
var assert = require('assert');
var app = require('../../index');

describe('Groups Test', function() {
  describe('GET /groups', function() {
    it('List all groups', function(done) {
      request(app).get('/groups')
                  .expect(function(res) {
                    if(res.status === 404) {
                      assert.equal(res.body.success, false);
                      assert.equal(typeof res.body.groups, 'object');
                    } else if (res.status === 200) {
                      assert.equal(res.body.success, true);
                      assert.equal(typeof res.body.groups, 'object');
                    } else {
                      assert.ok(false);
                    }
                  })
                  .end(done);
    });

    var serial;
    it('Trigger a code scanning job', function(done) {
      request(app).put('/groups/develop')
                  .expect(200)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.info, 'Scan job created.');
                    serial = res.body.serial;
                  })
                  .end(done);
    });

    it('Wait for the scanning job to finish', function(done) {
      process.stdout.write('        Wait for finish');
      this.timeout(31000);
      var count = 30;
      var handle = setInterval(function() {
        process.stdout.write('.');
        count--;
        if(count === 0) clearInterval(handle);
        request(app).get(`/testjobs/${serial}`)
                    .expect(200)
                    .expect(function(res) {
                      if(res.body.testjobs.status === 'Error') {
                        clearInterval(handle);
                        done(new Error('The test job end with an ERROR status'));
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
      request(app).get('/groups/develop')
                  .expect(200)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.branch, 'develop');
                    assert.ok(new Date() - new Date(res.body.lastUpdate) < 5000);
                  })
                  .end(done);
    });

    it('Check if the dashboard is updated', function(done) {
      request(app).get('/dashboard/develop')
                  .expect(200)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.dashboard.branch, 'develop');
                    assert.ok(new Date() - new Date(res.body.dashboard.date) < 5000);
                  })
                  .end(done);
    });
  });
});
