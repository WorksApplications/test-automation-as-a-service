var request = require('supertest');
var app = require('../../index');
var assert = require('assert');

describe('System info test', function() {
  it('GET /sysinfo', function(done) {
    request(app).get('/sysinfo')
                .expect(200)
                .expect(function(res) {
                  console.log('      Commit: ' + res.body.commit);
                })
                .end(done);
  });

  it('GET /sysinfo/liveurls', function(done) {
    request(app).get('/sysinfo/liveurls')
                .expect(200)
                .expect(function(res) {
                  assert.ok(res.body.length > 0);
                })
                .end(done);
  });
});
