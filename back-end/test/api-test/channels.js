var request = require('supertest');
var assert = require('assert');
var app = require('../../index');

describe('Channel scan test', function() {
  var len;

  it('GET /channels', function(done) {
    request(app).get('/channels')
                .expect(200)
                .expect(function(res) {
                  assert.equal(res.body.success, true);
                })
                .end(done);
  });

  it('PUT /channels', function(done) {
    this.timeout(30000);
    request(app).put('/channels')
                .expect(201)
                .expect(function(res) {
                  assert.equal(res.body.success, true);
                  assert.equal(res.body.info, 'Slack channels list is updated.');
                  assert.ok(new Date() - new Date(res.body.lastUpdate) < 2000);
                  assert.ok(res.body.channels && res.body.channels.length > 1000);
                  len = res.body.channels.length;
                })
                .end(done);
  });

  it('Check the channel info is updated', function(done) {
    request(app).get('/channels')
                .expect(200)
                .expect(function(res) {
                  assert.equal(res.body.success, true);
                  assert.ok(new Date() - new Date(res.body.lastUpdate) < 2000);
                  assert.ok(res.body.channels);
                  assert.equal(res.body.channels.length, len);
                })
                .end(done);
  });
});
