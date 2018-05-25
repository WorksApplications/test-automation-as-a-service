var fs = require('fs-extra');
var logger = require('../logger');

var attTemplates = {
  title: {title_link: undefined},
  failed: {title: 'Failed cases', color: '#fd5a3e', text: ''},
  broken: {title: 'Broken cases', color: '#ffd050', text: ''},
  canceled: {title: 'Canceled cases', color: '#836180', text: ''},
  pending: {title: 'Pending cases', color: '#3aa3e3', text: ''},
  passed: {title: 'Passed cases', color: '#97cc64', text: ''},
  footer: {title: '', text: '_Check out our <http://taas.internal.worksap.com/|TaaS Test Automation Platform>! Ask <#C36QE6JLE|team_shanghai_qe>._', mrkdwn_in: ['text'], footer: 'TaaS Test Automation Platform, Shanghai QE Team', footer_icon: undefined, ts: 0}

};
var localConfig = {target: '', seqNumber: '', enabledStatus: []};

function mergeStatistic(report) {
  var stat = {};
  var i, j;
  if(!report.testSuites) return {};
  for(i = 0; i < report.testSuites.length; i++) {
    for(j in report.testSuites[i].statistic) {
      stat[j] = stat[j] || 0;
      stat[j] += report.testSuites[i].statistic[j];
    }
  }
  return stat;
}

function makeStatistic(report) {
  var stat = mergeStatistic(report);
  var target = localConfig.target ? ('A test was running on ' + localConfig.target + '. \n') : '';
  var cases = '';
  for (var i in stat) {
    if (i === 'total') continue;
    var num = parseInt(stat[i]);
    if(num) {
      cases += stat[i] + '/' + stat.total + ' ' + i.toUpperCase() + ', ';
    }
  }
  if (cases === '') {
    cases = '0 test cases, ';
  }
  return target + cases.substr(0, cases.length - 2) + '. ' + makeConclusion(report) + '\n';
}

async function getDescription(report_dir, uid) {
  var testcasePath = `${report_dir}/data/${uid}-testcase.json`.replace('//','/');
  try {
    var content = await fs.readFile(testcasePath);
    var testcase = JSON.parse(content.toString());
    return testcase.description.value;
  } catch (err) {
    logger.error('Failed to get description of testcase. ' + err);
    return undefined;
  }
}

async function makeCases(report_dir, report, filter, bullet) {
  var MAX_LINES = 10;
  var item_count = 0;
  var ret = '';
  var cases;
  //var product;
  var i, j;
  var stat = mergeStatistic(report);

  for(i = 0; i < report.testSuites.length; i++) {
    //product = report.testSuites[i].name.split(' : ')[1];
    cases = report.testSuites[i].testCases;
    for(j = 0; j < cases.length; j++) {
      if(cases[j].status === filter.toUpperCase()) {
        item_count++;
        var description = await getDescription(report_dir, cases[j].uid);
        var item = bullet + ' ' + description + (item_count !== stat[filter] ? '\n' : '');
        if(item_count === MAX_LINES && stat[filter] !== MAX_LINES) {
          ret += bullet + ' And ' + (stat[filter] - MAX_LINES + 1).toString() + ' more...';
          return ret;
        }
        ret += item;
      }
    }
  }
  return ret;
}

function makeTitle() {
  return 'Test Report' + (localConfig.seqNumber ? ' #' + localConfig.seqNumber : '');
}

function makeColor(report) {
  var stat = mergeStatistic(report);
  var red = stat.failed + stat.canceled;
  var yellow = stat.broken;
  var green = stat.passed === stat.total && stat.total !== 0;
  if(red) return '#fd5a3e';
  if(yellow) return '#ffd050';
  if(green) return '#97cc64';
  return '#aaaaaa';
}

function makeConclusion(report) {
  var stat = mergeStatistic(report);
  var red = stat.failed + stat.canceled;
  var yellow = stat.broken;
  var green = stat.pending;
  if(stat.passed === stat.total && stat.total > 0) return ':heavy_check_mark:';
  if(red) return ':x:';
  if(yellow) return ':question:';
  if(green) return ':arrows_clockwise:';
  return ':sleeping:';
}

async function getAttachments(report_dir, json_string) {
  var report = JSON.parse(json_string.toString());
  var stat = mergeStatistic(report);
  attTemplates['title'].title = makeTitle();
  attTemplates['title'].text = makeStatistic(report);
  attTemplates['title'].color = makeColor(report);
  attTemplates['footer'].ts = parseInt(report.time.stop) / 1000;
  // Push attachments into array `att`
  var att = [];
  att.push(attTemplates['title']);
  for(var idx in localConfig.enabledStatus) {
    var status = localConfig.enabledStatus[idx];
    if(stat[status] !== 0) {
      attTemplates[status].text += await makeCases(report_dir, report, status,  '• ');
      att.push(attTemplates[status]);
    }
  }
  att.push(attTemplates['footer']);
  return att;
}

/**
 * Create a Slack message string from a Allure report (JSON string)
 *
 * @param {string} report_dir Directory of report files
 * @param {string} json_string A Allure JSON report in a string
 * @param {string} seq_number Sequence number of a test
 * @param {string} testjobUrl URL of the test job
 * @param {string} target URL of the target under test
 * @param {string} groups Enabled test groups (product names) in a string
 * @param {string} bot_name Display name of the Slack rebot
 * @param {Array<string>} enabled_status Test cases which ends with a status in this list will be shown in the Slack report. Available status: PASSED, FAILED, BROKEN, CANCELED, PENDING
 * @param {string} avatar URL of the Slackbot's avatar
 * @param {string} footer_icon URL of the footer icon
 * @returns A Slack message object
 */
module.exports.createSlackReport = async function(report_dir, json_string, seq_number, testjobUrl, target, bot_name, enabled_status, avatar, footer_icon) {
  for(var key in attTemplates) {
    if(key === 'footer') continue;
    if(attTemplates[key].text) attTemplates[key].text = '';
  }
  attTemplates.title.title_link = testjobUrl;
  attTemplates.footer.footer_icon = footer_icon;
  localConfig.seqNumber = seq_number;
  localConfig.target = target;
  localConfig.enabledStatus = enabled_status;
  return {username: bot_name, icon_url: avatar, parse: 'none', attachments: await getAttachments(report_dir, json_string)};
};
module.exports.mergeStatistic = mergeStatistic;
