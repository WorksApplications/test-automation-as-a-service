var mongoose = require('mongoose');
var logger = require('../logger');
var Schema = mongoose.Schema;

var NodeSchema = new Schema({
  name: String,
  platform: String,
  order: Number,
  driverUrl: String,
  liveUrl: String,
  vncHost: String,
  vncPort: String,
  vncPassword: String,
  width: Number,
  height: Number
});

NodeSchema.statics.retrieve = async function(platform) {
  try {
    var ret = await NodeModel.find({platform: platform})
      .select({__v: false})
      .sort({order: 'asc'})
      .exec();
    return ret;
  } catch (err) {
    logger.error('Failed to retrieve browser node.' + err);
    throw err;
  }
};

NodeSchema.statics.listLiveUrls = async function() {
  try {
    var ret = await NodeModel.find({})
      .sort({order: 'asc'})
      .exec();
    return ret;
  } catch (err) {
    logger.error('Failed to retrieve browser nodes.' + err);
    throw err;
  }
};

var NodeModel = mongoose.model('Node', NodeSchema);

module.exports.Model = NodeModel;
module.exports.Schema = NodeSchema;
