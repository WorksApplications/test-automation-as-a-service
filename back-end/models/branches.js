var mongoose = require('mongoose');
var logger = require('../logger');
var key = require('mongo-key-escape');
var Schema = mongoose.Schema;

var BranchSchema = new Schema({
  repo: String,
  date: Date,
  branches: Object
}, {strict: false});

BranchSchema.statics.retrieve = async function(repo, callback) {
  logger.debug('Branches schema list method is called.');
  try {
    var ret = await Branch.findOne({repo: repo}, {_id: false, __v: false});
    logger.debug(`Branches for repo ${repo} retrieved.`);
    return JSON.parse(key.unescape(JSON.stringify(ret)));
  } catch (err) {
    logger.error('Branches retrive failed. ' + err);
    throw err;
  }
};

BranchSchema.statics.modify = async function(repo, branches, callback) {
  var doc = {
    repo: repo,
    date: new Date(),
    branches: JSON.parse(key.escape(JSON.stringify(branches)))
  };
  logger.debug('Branches schema insert method is called.');
  try {
    var ret = await Branch.update({repo: repo}, doc, {new: true, upsert: true});
    logger.debug(`Branches data for repo ${repo} inserted`);
    return ret;
  } catch (err) {
    throw err;
  }
};

var Branch = mongoose.model('Branches', BranchSchema);

module.exports.Model = Branch;
