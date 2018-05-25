var mongoose = require('mongoose');
var logger = require('../logger');
var key = require('mongo-key-escape');
var Schema = mongoose.Schema;

var ChannelSchema = new Schema({
  date: Date,
  channels: Object
}, {strict: false});

ChannelSchema.statics.retrieve = function(callback) {
  logger.debug('Channels schema list method is called.');
  return Channel.findOne({}, {_id: false, __v: false}, function(err, data) {
    if(!err && data) {
      logger.debug('Channels retrieved.');
      data = JSON.parse(key.unescape(JSON.stringify(data)));
    } else {
      if(err) logger.error('Channels retrive failed. ' + err);
      else logger.error('Channels not found.');
    }
    if(callback) callback(err, data);
  });
};

ChannelSchema.statics.modify = function(channels, callback) {
  var doc = {
    date: new Date(),
    channels: JSON.parse(key.escape(JSON.stringify(channels)))
  };
  logger.debug('Channels schema insert method is called.');
  return Channel.findOneAndUpdate({}, doc, {new: true, upsert: true}, function(err, data) {
    logger.debug('Channels data inserted');
    if(callback) callback(err, data);
  });
};

var Channel = mongoose.model('Channel', ChannelSchema);

module.exports.Model = Channel;
