var mongoose = require('mongoose');
var logger = require('../logger');
var Schema = mongoose.Schema;

var TestcodeSchema = new Schema({
  branch: String,
  date: Date,
  codes: Object
}, {strict: false});

TestcodeSchema.statics.retrieve = async function (branch, className) {
  logger.debug(`Testcode schema list method is called, branch=${branch}, className=${className}`);
  try {
    let ret;
    if (className) {
      ret = await Testcode.findOne({branch: branch}, {_id: false, branch: true, date: true, codes: { $elemMatch: {class: className}}});
    } else {
      ret = await Testcode.findOne({branch: branch}, {_id: false, __v: false});
    }
    if (ret) {
      logger.debug(`Testcode for branch ${branch} retrieved.`);
      ret = JSON.parse(JSON.stringify(ret));
    } else {
      logger.error('Testcode not found.');
    }
    return ret;
  } catch (err) {
    logger.error('Testcode retrive failed. ' + err);
    throw err;
  }
};

TestcodeSchema.statics.modify = async function (branch, codes) {
  var doc = {
    branch: branch,
    date: new Date(),
    codes: JSON.parse(JSON.stringify(codes))
  };
  logger.debug('Testcode schema insert method is called.');
  try {
    var ret = await Testcode.update({branch: branch}, doc, {new: true, upsert: true});
    logger.debug(`Testcode data for branch ${branch} inserted`);
    return ret;
  } catch (err) {
    throw err;
  }
};

TestcodeSchema.statics.delete = async function (branch) {
  try {
    var ret = await Testcode.findOneAndRemove({branch: branch});
    logger.debug(`Testcode data for branch ${branch} deleted`);
    return ret;
  } catch (err) {
    logger.error(`Failed to delete groups for branch ${branch}. ` + err);
    throw err;
  }
};

var Testcode = mongoose.model('Testcode', TestcodeSchema);

module.exports.Model = Testcode;
