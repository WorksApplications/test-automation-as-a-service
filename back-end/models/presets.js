var mongoose = require('mongoose');
var logger = require('../logger');
var Schema = mongoose.Schema;

var urlValidationFun = function(str) {
  return new RegExp(/^(http|https):\/\/\S{1,200}$/i).test(str);
};

var PresetSchema = new Schema({
  name: {type: String, validate: /^\S.{0,100}$/}, // Start with a non-space char and followed by 0 or more chars
  branch:{type: String, validate: /^\S{1,50}$/}, // Contains one or more non-space char
  url: {type: String, validate: urlValidationFun}, // Start with http:// or https:// then followed by one or more non-space chars
  appUrl: {type: String, validate: urlValidationFun}, // Start with http:// or https:// then followed by one or more non-space chars
  channel: {type: String, validate: /^\S{0,50}$/}, // Contains zero or more non-space chars
  channelId: {type: String, validate: /^\S{0,50}$/}, // Contains zero or more non-space chars
  username: String,
  password: String,
  platform: String,
  groups: [String],
  testcases: [String],
  params: Object
});

PresetSchema.statics.insert = function(doc, callback) {
  logger.debug('Preset schema create method is called.');
  return Preset.create(doc, function(err, data) {
    logger.debug(`Object created: ${JSON.stringify(data)}`);
    if(callback) callback(err, data);
  });
};

PresetSchema.statics.delete = function(id, callback) {
  logger.debug('Preset schema delete method is called.');
  return Preset.findByIdAndRemove(id, function(err, data) {
    logger.debug(`Object deleted: ${JSON.stringify(data)}`);
    if(callback) callback(err, data);
  });
};

PresetSchema.statics.list = function(callback) {
  logger.debug('Preset schema list method is called.');
  return Preset.find(function(err, data) {
    logger.debug(`${data.length} object(s) retrieved.`);
    if(callback) callback(err, data);
  });
};

PresetSchema.statics.retrieve = function(id, callback) {
  logger.debug('Preset schema list method is called.');
  return Preset.findById(id, function(err, data) {
    if(!err && data) {
      logger.debug('Object retrieved.');
    } else {
      if(err) logger.error('Retrive failed. ' + err);
      else logger.error(`Document with id = ${id} is not found.`);
    }
    if(callback) callback(err, data);
  });
};

PresetSchema.statics.modify = function(id, doc, callback) {
  logger.debug('Preset schema update method is called.');
  return Preset.findByIdAndUpdate(id, doc, {new: true}, function(err, data) {
    if(!err && data) {
      logger.debug(`Object updated: ${JSON.stringify(data)}`);
    } else {
      if(err) logger.error('Update failed. ' + err);
      else logger.error(`Document with id = ${id} is not found.`);
    }
    if(callback) callback(err, data);
  });
};

var Preset = mongoose.model('Preset', PresetSchema);

module.exports.Model = Preset;
module.exports.Schema = PresetSchema;
