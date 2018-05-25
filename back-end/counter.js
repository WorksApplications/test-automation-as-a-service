var CounterModel = require('./models/counter').Model;
var logger = require('./logger');

function Counter(name) {
  if(!(this instanceof Counter)) return new Counter(name);
  this.name = name;
}

Counter.prototype.next = function(callback) {
  return new global.Promise(function(resolve, reject) {
    CounterModel.getNextCount(this.name, function(err, data) {
      if(!err && data) {
        logger.debug(`Counter "${this.name}" is updated to ${data.value}.`);
        resolve(data.value);
      } else {
        reject(err);
      }
    }.bind(this));
  }.bind(this));
};

Counter.prototype.current = function() {
  return new global.Promise(function(resolve, reject) {
    CounterModel.getCount(this.name, function(err, data) {
      if(err) {
        reject(err);
      } else {
        logger.debug(`Counter "${this.name}" = ${data.value}.`);
        resolve(data.value);
      }
    }.bind(this));
  }.bind(this));
};

Counter.prototype.destroy = function() {
  return new global.Promise(function(resolve, reject) {
    CounterModel.destroy(this.name, function(err) {
      if(!err) resolve();
      else reject(err);
    }.bind(this));
  }.bind(this));
};

module.exports = Counter;
