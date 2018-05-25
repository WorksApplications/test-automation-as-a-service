var mongoose = require('mongoose');
var logger = require('../logger');
var Schema = mongoose.Schema;

var CounterSchema = Schema({
  name: String,
  value: Number
});

CounterSchema.statics.getCount = function(name, callback) {
  Counter.findOne({name: name}, function(err, data) {
    if(err) logger.error('Failed to read counter ' + name + '. ' + err);
    if(!err && !data) {
      logger.info(`Counter "${name}" does not exist.`);
      Counter.create({name: name, value: 0}, function(err, data) {
        if(!err) logger.info(`Counter "${name}" is created.`);
        if(callback) callback(err, data);
      });
    } else {
      callback(err, data);
    }
  });
};

CounterSchema.statics.getNextCount = function(name, callback) {
  Counter.findOneAndUpdate({name: name}, {$inc: {value: 1}}, {new: true, upsert: true}, function(err, data) {
    if(err) logger.error('Failed to update counter ' + name + '. ' + err);
    if(callback) callback(err, data);
  });
};

CounterSchema.statics.destroy = function(name, callback) {
  Counter.findOneAndRemove({name: name}, function(err, data) {
    if(err) logger.error('Failed to remove counter ' + name + '. ' + err);
    if(callback) callback(err, data);
  });
};

var Counter = mongoose.model('Counter', CounterSchema);

module.exports.Model = Counter;
module.exports.Schema = CounterSchema;
