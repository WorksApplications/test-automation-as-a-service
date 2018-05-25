var request = require('supertest');
var assert = require('assert');
var app = require('../../index');

describe('Test Job Test', function() {

  var jobSerial = [];
  var body = {
    name: 'Mocha job',
    branch: 'develop',
    url: 'https://jillj-develop.hue.worksap.com/',
    username: 'hue-root',
    password: 'hue-r00t',
    platform: 'chrome',
    channel: 'kuang_qi_test',
    channelId: 'C3NNDSEE4',
    testcases: ['qa.qe.MultiBrowserSampleTest#HueLoginAndLogoutTest'],
    params: [],
    groups: []
  };
  var order = ['the first', 'the second', 'the third', 'the 4th', 'mis-configured'];

  var bodyForResolveFeature = {
    name: 'Resolve Feature Test',
    branch: 'test-resolve-feature',
    url: 'https://jillj-develop.hue.worksap.com/',
    username: 'hue-root',
    password: 'hue-r00t',
    platform: 'chrome',
    channel: 'kuang_qi_test',
    channelId: 'C3NNDSEE4',
    testcases: [],
    params: [],
    groups: []
  };
  var resolveFeatureTestcases = {
    passed: 'qa.qe.ResolveFeatureTest#PassedTest',
    failed: 'qa.qe.ResolveFeatureTest#FailedTest'
  };
  var resolveFeatureJobSerial = {
    passed: 0,
    failed: 0
  };

  describe('POST, GET, DELETE /testjobs', function() {
    [0, 1, 2, 3].forEach(function(idx) {
      it(`Trigger a normal test job (${order[idx]})`, function(done) {
        request(app).post('/testjobs')
                    .send(body)
                    .expect(201)
                    .expect(function(res) {
                      assert.equal(res.body.success, true);
                      assert.equal(res.body.info, 'A test job is triggered.');
                      jobSerial[idx] = res.body.serial;
                    })
                    .end(done);
      });
    });

    it('Trigger a test job with non-exist git branch', function(done) {
      request(app).post('/testjobs')
                  .send({
                    name: 'Mocha job',
                    branch: 'this-git-branch-does-not-exist-at-all',
                    url: 'https://jillg-develop.hue.worksap.com/',
                    channel: 'kuang_qi_test',
                    platform: 'chrome',
                    testcases: ['qa.qe.MultiBrowserSampleTest#HueLoginTest'],
                    groups: []
                  })
                  .expect(201)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.info, 'A test job is triggered.');
                    jobSerial[4] = res.body.serial;
                  })
                  .end(done);
    });

    [0, 1, 2, 3].forEach(function(idx) {
      it(`Check the test job is created (${order[idx]})`, function(done) {
        request(app).get(`/testjobs/${jobSerial[idx]}`)
                    .expect(200)
                    .expect(function(res) {
                      assert.equal(res.body.success, true);
                      assert.equal(res.body.info, 'OK');
                      if(idx >= 3) assert.equal(res.body.testjobs.status, 'Pending');
                      assert.ok(new Date() - new Date(res.body.testjobs.create) < 5000);
                      assert.equal(res.body.testjobs.params.name, body.name);
                      assert.equal(res.body.testjobs.params.branch, body.branch);
                      assert.equal(res.body.testjobs.params.url, body.url);
                      assert.equal(res.body.testjobs.params.channel, body.channel);
                      for(var i = 0; i < res.body.testjobs.params.groups.length; i++) {
                        assert.equal(res.body.testjobs.params.groups[i], body.groups[i]);
                      }
                    })
                    .end(done);
      });
    });

    it('Cancel a pending job', function(done) {
      request(app).delete(`/testjobs/${jobSerial[3]}`)
                  .expect(200)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.info, 'Test job canceled.');
                  })
                  .end(done);
    });

    it('Wait for the first test job to start', function(done) {
      process.stdout.write('        Wait for start');
      this.timeout(31000);
      var count = 30;
      var handle = setInterval(function() {
        process.stdout.write('.');
        count--;
        if(count === 0) clearInterval(handle);
        request(app).get(`/testjobs/${jobSerial[0]}`)
                    .expect(200)
                    .expect(function(res) {
                      if(res.body.testjobs.status === 'Error') {
                        clearInterval(handle);
                        done(new Error('The test job end with an ERROR status'));
                      }
                      if(res.body.testjobs.status === 'Running' || res.body.testjobs.status === 'Finished') {
                        // Success
                        process.stdout.write('\n');
                        clearInterval(handle);
                        done();
                      }
                    })
                    .end(function() {});
      }, 1000);
    });

    it('Cancel the first running job', function(done) {
      request(app).delete(`/testjobs/${jobSerial[0]}`)
                  .expect(200)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.info, 'Test job canceled.');
                  })
                  .end(done);
    });

    it('Retrieve execution stack of a canceled job', function(done) {
      request(app).get(`/testjobs/${jobSerial[0]}/exec_stack`)
                  .expect(200)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.info, 'OK');
                  })
                  .end(done);
    });

    it('Wait for the second test job to start', function(done) {
      process.stdout.write('        Wait for start');
      this.timeout(31000);
      var count = 30;
      var handle = setInterval(function() {
        process.stdout.write('.');
        count--;
        if(count === 0) clearInterval(handle);
        request(app).get(`/testjobs/${jobSerial[1]}`)
                    .expect(200)
                    .expect(function(res) {
                      if(res.body.testjobs.status === 'Error') {
                        clearInterval(handle);
                        done(new Error('The test job end with an ERROR status'));
                      }
                      if(res.body.testjobs.status === 'Running' || res.body.testjobs.status === 'Finished') {
                        // Success
                        process.stdout.write('\n');
                        clearInterval(handle);
                        done();
                      }
                    })
                    .end(function() {});
      }, 1000);
    });

    it('Wait for the third test job to start', function(done) {
      process.stdout.write('        Wait for start');
      this.timeout(31000);
      var count = 30;
      var handle = setInterval(function() {
        process.stdout.write('.');
        count--;
        if(count === 0) clearInterval(handle);
        request(app).get(`/testjobs/${jobSerial[2]}`)
                    .expect(200)
                    .expect(function(res) {
                      if(res.body.testjobs.status === 'Error') {
                        clearInterval(handle);
                        done(new Error('The test job end with an ERROR status'));
                      }
                      if(res.body.testjobs.status === 'Running' || res.body.testjobs.status === 'Finished') {
                        // Success
                        process.stdout.write('\n');
                        clearInterval(handle);
                        done();
                      }
                    })
                    .end(function() {});
      }, 1000);
    });

    [0, 1, 2, 3, 4].forEach(function(idx) {
      it(`Check the status of test job (${order[idx]})`, function(done) {
        request(app).get(`/testjobs/${jobSerial[idx]}`)
                    .expect(200)
                    .expect(function(res) {
                      if(idx === 0 || idx === 3) assert.equal(res.body.testjobs.status, 'Canceled');
                      if(idx === 1 || idx === 2 || idx === 4) assert.equal(res.body.testjobs.status, 'Running');
                    })
                    .end(done);
      });
    });

    it('List test jobs without params', function(done) {
      request(app).get('/testjobs')
                  .expect(200)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.info, 'OK');
                    var serials = res.body.testjobs.map((ele) => ele.serial);
                    assert.notEqual(serials.indexOf(jobSerial[1]), -1);
                    assert.notEqual(serials.indexOf(jobSerial[2]), -1);
                  })
                  .end(done);
    });

    it('List test jobs with limit', function(done) {
      request(app).get('/testjobs?limit=4')
                  .expect(200)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.info, 'OK');
                    var serials = res.body.testjobs.map((ele) => ele.serial);
                    assert.notEqual(serials.indexOf(jobSerial[1]), -1);
                    assert.notEqual(serials.indexOf(jobSerial[2]), -1);
                    assert.equal(res.body.testjobs.length, 4);
                  })
                  .end(done);
    });

    it('List test jobs with limit and skip', function(done) {
      request(app).get('/testjobs?limit=5&skip=2')
                  .expect(200)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.info, 'OK');
                    assert.equal(res.body.testjobs.map((ele) => ele.serial).indexOf(jobSerial[3]), -1);
                  })
                  .end(done);
    });

    it('Retrieve execution stack of a running job', function(done) {
      request(app).get(`/testjobs/${jobSerial[1]}/exec_stack`)
                  .expect(200)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.info, 'OK');
                  })
                  .end(done);
    });

    it('Wait for the second running job to finish', function(done) {
      process.stdout.write('        Wait for finish');
      this.timeout(301000);
      var count = 300;
      var handle = setInterval(function() {
        process.stdout.write('.');
        count--;
        if(count === 0) clearInterval(handle);
        request(app).get(`/testjobs/${jobSerial[1]}`)
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

    it('Retrieve execution stack of a finished job', function(done) {
      request(app).get(`/testjobs/${jobSerial[1]}/exec_stack`)
                  .expect(200)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.info, 'OK');
                  })
                  .end(done);
    });

    it('Wait for the third running job to finish', function(done) {
      process.stdout.write('        Wait for finish');
      this.timeout(301000);
      var count = 300;
      var handle = setInterval(function() {
        process.stdout.write('.');
        count--;
        if(count === 0) clearInterval(handle);
        request(app).get(`/testjobs/${jobSerial[2]}`)
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

    it('Wait for the mis-configured job to fail', function(done) {
      process.stdout.write('        Wait for finish');
      this.timeout(51000);
      var count = 50;
      var handle = setInterval(function() {
        process.stdout.write('.');
        count--;
        if(count === 0) clearInterval(handle);
        request(app).get(`/testjobs/${jobSerial[4]}`)
                    .expect(200)
                    .expect(function(res) {
                      if(res.body.testjobs.status === 'Finished') {
                        clearInterval(handle);
                        done(new Error('The test job doesn\'t fail as expected'));
                      }
                      if(res.body.testjobs.status === 'Error') {
                        // Success
                        process.stdout.write('\n');
                        clearInterval(handle);
                        done();
                      }
                    })
                    .end(function() {});
      }, 1000);
    });

    it('Retrieve test logs', function(done) {
      request(app).get(`/testjobs/${jobSerial[2]}/logs`)
                  .expect(200)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.info, 'OK');
                    assert.notEqual(res.body.log[0].message.indexOf('Cloning into'), -1);
                  })
                  .end(done);
    });

    it('Retrieve a non-exist test job', function(done) {
      request(app).get('/testjobs/0')
                  .expect(404)
                  .expect(function(res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.info, 'Test job #0 is not found.');
                  })
                  .end(done);
    });

    it('Cancel a non-exist test job', function(done) {
      request(app).delete('/testjobs/0')
                  .expect(400)
                  .expect(function(res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.info, 'Failed to cancel a test job. Error: Job not found.');
                  })
                  .end(done);
    });

    it('Cancel an already finish test job', function(done) {
      request(app).delete('/testjobs/' + jobSerial[2])
                  .expect(400)
                  .expect(function(res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.info, 'Failed to cancel a test job. Error: Job was completed.');
                  })
                  .end(done);
    });

  });


  describe('PUT testjob/', function() {
    it('Trigger a passed test job', function(done) {
      bodyForResolveFeature.testcases[0] = resolveFeatureTestcases.passed;
      request(app).post('/testjobs')
                  .send(bodyForResolveFeature)
                  .expect(201)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.info, 'A test job is triggered.');
                    resolveFeatureJobSerial.passed = res.body.serial;
                  })
                  .end(done);
    });

    it('Should not resolve a running test job', function(done) {
      request(app).put('/testjobs/' + resolveFeatureJobSerial.passed + '/resolve')
                  .send({
                    resolved: true,
                    reason: 'Test resolve reason',
                    comment: 'Test resolve comment'
                  })
                  .expect(400)
                  .expect(function(res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.info,
                      'Failed to update a resolve. ' +
                      'Error: Test job status should be finished and test cases should not be all-passed.');
                  })
                  .end(done);
    });

    it('Trigger a failed test job', function(done) {
      bodyForResolveFeature.testcases[0] = resolveFeatureTestcases.failed;
      request(app).post('/testjobs')
                  .send(bodyForResolveFeature)
                  .expect(201)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.info, 'A test job is triggered.');
                    resolveFeatureJobSerial.failed = res.body.serial;
                  })
                  .end(done);
    });

    it('Wait for the running(passed) job to finish', function(done) {
      process.stdout.write('        Wait for finish');
      this.timeout(301000);
      var count = 300;
      var handle = setInterval(function() {
        process.stdout.write('.');
        count--;
        if(count === 0) clearInterval(handle);
        request(app).get(`/testjobs/${resolveFeatureJobSerial.passed}`)
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

    it('Wait for the running(failed) job to finish', function(done) {
      process.stdout.write('        Wait for finish');
      this.timeout(301000);
      var count = 300;
      var handle = setInterval(function() {
        process.stdout.write('.');
        count--;
        if(count === 0) clearInterval(handle);
        request(app).get(`/testjobs/${resolveFeatureJobSerial.failed}`)
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

    it('Should not resolve an all-passed test job', function(done) {
      request(app).put(`/testjobs/${resolveFeatureJobSerial.passed}/resolve`)
                  .send({
                    resolved: true,
                    reason: 'Test resolve reason',
                    comment: 'Test resolve comment'
                  })
                  .expect(400)
                  .expect(function(res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.info, 'Failed to update a resolve. ' +
                      'Error: Test job status should be finished and test cases should not be all-passed.');
                  })
                  .end(done);
    });

    it('Should not resolve a failed test job without reason', function(done) {
      request(app).put(`/testjobs/${resolveFeatureJobSerial.failed}/resolve`)
                  .send({
                    resolved: true,
                    reason: '',
                    comment: ''
                  })
                  .expect(400)
                  .expect(function(res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.info, 'Failed to update a resolve. ' +
                      'Error: Test job cannot be resolved without reason.');
                  })
                  .end(done);
    });

    it('Resolve reason and comment should less than 100 and 300 characters respectively', function(done) {
      request(app).put(`/testjobs/${resolveFeatureJobSerial.failed}/resolve`)
                  .send({
                    resolved: true,
                    reason: 'Test resolve reason, Test resolve reason, Test resolve reason, Test resolve reason, Test resolve reason',
                    comment: 'Test resolve comment, Test resolve comment, Test resolve comment, Test resolve comment, Test resolve comment, \
                              Test resolve comment, Test resolve comment, Test resolve comment, Test resolve comment, Test resolve comment, \
                              Test resolve comment, Test resolve comment, Test resolve comment, Test resolve comment, Test resolve comment'
                  })
                  .expect(400)
                  .expect(function(res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.info, 'Failed to update a resolve. ' +
                      'Error: Resolve reason and comment should less than 100 and 300 characters respectively.');
                  })
                  .end(done);
    });

    it('Resolve a failed test job', function(done) {
      request(app).put(`/testjobs/${resolveFeatureJobSerial.failed}/resolve`)
                  .send({
                    resolved: true,
                    reason: 'Test resolve reason',
                    comment: 'Test resolve comment'
                  })
                  .expect(200)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.info, 'Resolve updated.');
                  })
                  .end(done);
    });

    it('Verify the resolve info in DB', function(done) {
      request(app).get(`/testjobs/${resolveFeatureJobSerial.failed}`)
                  .expect(200)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.info, 'OK');
                    assert.equal(res.body.testjobs.resolve.resolved, true);
                    assert.equal(res.body.testjobs.resolve.reason, 'Test resolve reason');
                    assert.equal(res.body.testjobs.resolve.comment, 'Test resolve comment');
                  })
                  .end(done);
    });

    it('Should not unresolve a resolved test job with reason and comment', function(done) {
      request(app).put(`/testjobs/${resolveFeatureJobSerial.failed}/resolve`)
                  .send({
                    resolved: false,
                    reason: 'Test resolve reason',
                    comment: 'Test resolve comment'
                  })
                  .expect(400)
                  .expect(function(res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.info, 'Failed to update a resolve. ' +
                      'Error: Test job cannot be unresolved with reason or comment.');
                  })
                  .end(done);
    });

    it('Unresolve a resolved test job', function(done) {
      request(app).put(`/testjobs/${resolveFeatureJobSerial.failed}/resolve`)
                  .send({
                    resolved: false,
                    reason: '',
                    comment: ''
                  })
                  .expect(200)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.info, 'Resolve updated.');
                  })
                  .end(done);
    });

  });

});
