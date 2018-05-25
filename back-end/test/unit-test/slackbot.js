var assert = require('assert');
var messageUtil = require('../../runner/messageUtil');
var slackbot = require('../../runner/slackbot');
var fs = require('fs-extra');
var glob = require('glob');
var testChannel = 'kuang_qi_test';

describe('Slackbot Test', function() {

  describe('Message Utility Test', function() {
    var filenames = glob.sync(__dirname + '/data/msgutil-*.json');
    filenames.forEach(function(filename) {
      var inFilename = filename.split('/').slice(-1)[0];
      var outFilename = filename.split('/').slice(-1)[0].split('.')[0] + '.out';
      it('Use ' + inFilename, async function() {
        var content = fs.readFileSync(filename);
        var message = await messageUtil.createSlackReport(__dirname + '/data',
                                                    content,
                                                    '123',
                                                    'http://amber/#/testjobs/details/123',
                                                    'http://jillg-develop.hue.worksap.com/',
                                                    'Testing Cat',
                                                    [],
                                                    'https://pbs.twimg.com/profile_images/543118466/Garfield3_normal.jpg',
                                                    'http://www.worksap.co.jp/hue/images/contact_logo.png');

        //fs.writeFileSync(__dirname + '/data/' + outFilename, JSON.stringify(message));
        var expected = JSON.parse(fs.readFileSync(__dirname + '/data/' + outFilename, 'utf8'));
        assert.deepStrictEqual(message, expected);
      });
    });
  });

  describe('Slack Messaging Test', function() {
    it('Send a normal report', async function() {
      this.timeout(5000);
      await slackbot.sendReport(__dirname + '/data', fs.readFileSync(__dirname + '/data/msgutil-success.json'), 123, testChannel, 'http://amber/#/testjobs/details/123', 'http://jillg-develop.hue.worksap.com/', ['HueCommon']);
    });

    it('Send to a non-exist channel', async function() {
      this.timeout(5000);
      slackbot.sendReport(__dirname + '/data', fs.readFileSync(__dirname + '/data/msgutil-success.json'), 123, 'this-in-a-non-exist-channel', 'http://amber/#/testjobs/details/123', 'http://jillg-develop.hue.worksap.com/', ['HueCommon']);
    });

    it('Send a report without SN', async function() {
      this.timeout(5000);
      slackbot.sendReport(__dirname + '/data', fs.readFileSync(__dirname + '/data/msgutil-success.json'), undefined, testChannel, 'http://amber/#/testjobs/details/123', 'http://jillg-develop.hue.worksap.com/', ['HueCommon']);
    });

    it('Send a report without test job URL', async function() {
      this.timeout(5000);
      await slackbot.sendReport(__dirname + '/data', fs.readFileSync(__dirname + '/data/msgutil-success.json'), 123, testChannel, undefined, 'http://jillg-develop.hue.worksap.com/', ['HueCommon']);
    });

    it('Send a report without target URL', async function() {
      this.timeout(5000);
      await slackbot.sendReport(__dirname + '/data', fs.readFileSync(__dirname + '/data/msgutil-success.json'), 123, testChannel, 'http://amber/#/testjobs/details/123', undefined, ['HueCommon']);
    });
  });
});
