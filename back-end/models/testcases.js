var mongoose = require('mongoose');
var logger = require('../logger');
var key = require('mongo-key-escape');
var Schema = mongoose.Schema;

var TestcaseSchema = new Schema({
  branch: String,
  date: Date,
  testcases: Object
}, {strict: false});

TestcaseSchema.statics.retrieve = async function(branch) {
  logger.debug('Testcases schema list method is called.');
  try {
    var ret = await Testcases.findOne({branch: branch}, {_id: false, __v: false});
    if(ret) {
      logger.debug(`Testcases for branch ${branch} retrieved.`);
      ret = JSON.parse(key.unescape(JSON.stringify(ret)));
    } else {
      logger.error('Testcases not found.');
    }
    return ret;
  } catch (err) {
    logger.error('Testcases retrive failed. ' + err);
    throw err;
  }
};

TestcaseSchema.statics.modify = async function(branch, testcases) {
  var doc = {
    branch: branch,
    date: new Date(),
    testcases: JSON.parse(key.escape(JSON.stringify(testcases)))
  };
  logger.debug('Testcases schema insert method is called.');
  try {
    var ret = await Testcases.update({branch: branch}, doc, {new: true, upsert: true});
    logger.debug(`Testcases data for branch ${branch} inserted`);
    return ret;
  } catch (err) {
    throw err;
  }
};

TestcaseSchema.statics.delete = async function(branch) {
  try {
    var ret = await Testcases.findOneAndRemove({branch: branch});
    logger.debug(`Testcases data for branch ${branch} deleted`);
    return ret;
  } catch (err) {
    logger.error(`Failed to delete groups for branch ${branch}. ` + err);
    throw err;
  }
};


var Testcases = mongoose.model('Testcases', TestcaseSchema);

module.exports.Model = Testcases;
