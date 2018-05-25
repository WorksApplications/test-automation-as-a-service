var mongoose = require('mongoose');
var logger = require('../logger');
var key = require('mongo-key-escape');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
  branch: String,
  date: Date,
  groups: Object
}, {strict: false});

GroupSchema.statics.retrieve = async function(branch) {
  logger.debug('Group schema list method is called.');
  try {
    var ret = await Group.findOne({branch: branch}, {_id: false, __v: false});
    if(ret) {
      logger.debug(`Groups for branch ${branch} retrieved.`);
      ret = JSON.parse(key.unescape(JSON.stringify(ret)));
    } else  {
      logger.error('Groups not found.');
    }
    return ret;
  } catch (err) {
    logger.error('Groups retrive failed. ' + err);
    throw err;
  }
};

GroupSchema.statics.modify = async function(branch, groups) {
  var doc = {
    branch: branch,
    date: new Date(),
    groups: JSON.parse(key.escape(JSON.stringify(groups)))
  };
  logger.debug('Group schema insert method is called.');
  try {
    var ret = await Group.update({branch: branch}, doc, {new: true, upsert: true});
    logger.debug(`Groups data for branch ${branch} inserted`);
    return ret;
  } catch (err) {
    throw err;
  }
};

GroupSchema.statics.delete = async function(branch) {
  try {
    var ret = await Group.findOneAndRemove({branch: branch});
    logger.debug(`Groups data for branch ${branch} deleted`);
    return ret;
  } catch (err) {
    logger.error(`Failed to delete groups for branch ${branch}. ` + err);
    throw err;
  }
};

var Group = mongoose.model('Group', GroupSchema);

module.exports.Model = Group;
