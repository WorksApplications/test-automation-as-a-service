var request = require('supertest');
var assert = require('assert');
var app = require('../../index');

describe('Presets Test', function() {

  var presetID;
  var body = {
    name: 'Mocha test',
    branch: 'develop',
    url: 'https://jillg-develop.hue.worksap.com/',
    channel: 'kuang_qi_test',
    groups: ['HueCommon']
  };

  // Test create a preset
  describe('POST /presets', function() {

    it('Create a normal preset', function(done) {
      request(app).post('/presets')
                  .send(body)
                  .expect(201)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.name, 'Mocha test');
                    assert.equal(res.body.info, 'Preset created.');
                    assert.equal(res.body.id.length, 24);
                    presetID = res.body.id;
                  })
                  .end(done);
    });

    var badDicts = [{
      branch: 'space in branch',
      url: 'http:this-is-not-valid',
      channel: 'space in channel',
    },
    {
      name: '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012',
      branch: '123456789012345678901234567890123456789012345678901234567890',
      url: 'http://1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012',
      channel: '123456789012345678901234567890123456789012345678901234567890',
    },
    {
      name: '',
      branch: ''
    }];
    badDicts.forEach(function(badDict) {
      Object.keys(badDict).forEach(function(key) {
        it(`Create a bad preset (bad ${key}, len=${badDict[key].length})`, function(done) {
          var badBody = JSON.parse(JSON.stringify(body));
          badBody[key] = badDict[key];
          request(app).post('/presets')
                      .send(badBody)
                      .expect(400)
                      .expect(function(res) {
                        assert.equal(res.body.success, false);
                        assert.equal(res.body.info.indexOf('Create failed. ValidationError'), 0);
                      })
                      .end(done);
        });
      });
    });
  });

  describe('GET /presets', function() {
    it('Get all presets', function(done) {
      request(app).get('/presets')
                  .expect(200)
                  .expect(function(res) {
                    assert.equal(res.body.success,true);
                    assert.equal(res.body.info, 'OK');
                    var arr = res.body.presets.map(function(ele) {return ele._id;});
                    assert.notEqual(arr.indexOf(presetID), -1);
                  })
                  .end(done);
    });

    it('Get a specific preset', function(done) {
      request(app).get('/presets/' + presetID)
                  .expect(200)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.info, 'OK');
                    assert.equal(res.body.preset.name, 'Mocha test');
                    assert.equal(res.body.preset.branch, 'develop');
                    assert.equal(res.body.preset.url, 'https://jillg-develop.hue.worksap.com/');
                    assert.equal(res.body.preset.channel, 'kuang_qi_test');
                    assert.equal(res.body.preset._id, presetID);
                    assert.equal(res.body.preset.groups.length, 1);
                    assert.equal(res.body.preset.groups[0], 'HueCommon');
                  })
                  .end(done);
    });

    it('Get a non-exist preset', function(done) {
      request(app).get('/presets/666666666666666666666666')
                  .expect(404)
                  .expect(function(res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.info, 'Document not found');
                  })
                  .end(done);
    });
  });

  describe('PUT /presets', function() {
    it('Update a preset\'s name', function(done) {
      request(app).put('/presets/' + presetID)
                  .send({
                    name: 'Mocha test 2',
                    branch: 'develop2',
                    url: 'https://jillf-develop.hue.worksap.com/',
                    channel: 'kuang_qi_test2',
                    groups: ['HueEss', 'HueTimeline']
                  })
                  .expect(200)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.info, 'OK');
                    assert.equal(res.body.preset.name, 'Mocha test 2');
                    assert.equal(res.body.preset.branch, 'develop2');
                    assert.equal(res.body.preset.url, 'https://jillf-develop.hue.worksap.com/');
                    assert.equal(res.body.preset.channel, 'kuang_qi_test2');
                    assert.equal(res.body.preset._id, presetID);
                    assert.equal(res.body.preset.groups.length, 2);
                    assert.equal(res.body.preset.groups[0], 'HueEss');
                    assert.equal(res.body.preset.groups[1], 'HueTimeline');
                  })
                  .end(done);
    });

    it('Update a non-exist preset', function(done) {
      request(app).put('/presets/666666666666666666666666')
                  .send(body)
                  .expect(404)
                  .expect(function(res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.info, 'Document not found');
                  })
                  .end(done);
    });
  });

  describe('DELETE /presets', function() {
    it('Delete invalid ID', function(done) {
      request(app).del('/presets/0')
                  .expect(400)
                  .expect(function(res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.info, 'Invalid ID.');
                  })
                  .end(done);
    });

    it('Delete a specific preset', function(done) {
      request(app).del('/presets/' + presetID)
                  .expect(200)
                  .expect(function(res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.id, presetID);
                    assert.equal(res.body.info, 'Preset deleted.');
                  })
                  .end(done);
    });

    it('Delete a non-exist preset', function(done) {
      request(app).del('/presets/' + presetID)
                  .expect(404)
                  .expect(function(res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.id, presetID);
                    assert.equal(res.body.info, 'Preset not exists.');
                  })
                  .end(done);
    });

  });

});
