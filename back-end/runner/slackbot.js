var logger = require('../logger');
var config = require('../config');
var messageUtil = require('./messageUtil');
var WebClient = require('@slack/client').WebClient;
var slack = new WebClient(config.slackbot.token, {logger: function(level, message) { logger.error(`Slack service: [${level}] ${message}`); }});

/**
 * Read a given Allure JSON report and send it to a given Slack channel
 *
 * @param {string} report_dir Directory of report files
 * @param {string} json_file Path to an Allure JSON report file
 * @param {number} seq_number Sequence number of a test job (Optional)
 * @param {string} channel A Slack channel which the report should be sent to
 * @param {string} testjobUrl URL of the test job
 * @param {string} target URL of the target under test
 * @param {string} groups Enabled TestNG test groups
 */
module.exports.sendReport = async function(report_dir, json_string, seq_number, channel, testjobUrl, target) {
  logger.info('Communicating with the Slack service...');
  try {
    var message = await messageUtil.createSlackReport(report_dir, json_string, seq_number, testjobUrl, target,
      config.slackbot.name,
      config.slackbot.enabledStatus,
      config.slackbot.avatar,
      config.slackbot.footerIcon
    );
    try {
      await slack.chat.postMessage(channel, ' ', message);
      logger.info('A Slack report is sent.');
    } catch (err) {
      logger.error(`Failed to communicate with the Slack service: ${err}`);
    }
  } catch (error) {
    logger.error(error);
  }
};

module.exports.listChannels = function(callback) {
  slack.channels.list({exclude_archived: true, exclude_members: true}, function(err, res) {
    if(err) {
      logger.error('Failed to retrieve channels list from the Slack service.');
      if(callback) callback(err, res);
    } else {
      logger.info(`${res.channels.length} Slack channels retrieved.`);
      if(callback) callback(err, res.channels.map(ele => {
        return {
          name: ele.name,
          id: ele.id
        };
      }));
    }
  });
};
