const mongoose = require('mongoose');
const logger = require('../logger');
const Schema = mongoose.Schema;
var countAndFind = require('mongoose-count-and-find');

const State = {
  NEW: 'new',
  IN_PROGRESS: 'in progress',
  DESTRUCTED: 'destructed',
  FINISHED: 'finished'
};

const Type = {
  AUTO: 'Auto',
  MANUAL: 'Manual'
};

var urlValidationFun = function(str) {
  return new RegExp(/^(http|https):\/\/\S{1,200}$/i).test(str);
};

var requiredByType = function() {
  return this.type === 'Auto';
};

var requiredByPlatform = function() {
  return this.platform === 'android' || this.platform === 'ios';
};

var EnvSchema = new Schema({
  url: {
    type: String,
    validate: urlValidationFun,
    default: ''
  },
  username: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  inherit: {
    type: Boolean,
    default: false
  }
});

var ChannelSchema = new Schema({
  name: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  inherit: {
    type: Boolean,
    default: false
  }
});

var TaskSchema = new Schema({
  serial: {
    type: Number,
    required: true
  },
  testPlanId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  state: {
    type: String, // new / in progress, finished
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  creator: {
    type: String, // username
    required: true
  },
  assignee: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  description: String,
  branch: {
    type: String,
    required: requiredByType
  },
  platform: {
    type: String,
    required: requiredByType
  },
  testcases: {
    type: Array,
    required: requiredByType
  },
  appUrl: {
    type: String,
    validate: urlValidationFun,
    required: requiredByPlatform
  },
  environment: {
    type: EnvSchema,
    required: requiredByType
  },
  channel: {
    type: ChannelSchema,
    required: requiredByType
  },
  params: {
    type: [Object],
    default: []
  },
  verdict: {
    result: {
      type: String,
      default: ''
    },
    reason: {
      type: String,
      default: ''
    }
  },
  lastUpdatedAt: {
    type: Date,
    default: new Date()
  },
  lastUpdatedBy: {
    type: String,
    default: null
  }
});

TaskSchema.plugin(countAndFind);

TaskSchema.statics.createTask = async (doc) => {
  try {
    return await TaskModel.create(doc);
  } catch (err) {
    logger.error(`Failed to create a task. ${err}`);
    throw err;
  }
};

TaskSchema.statics.findTaskBySerial = async (serial, testPlanId) => {
  try {
    return await TaskModel.findOne({serial: serial, testPlanId: testPlanId});
  } catch (err) {
    logger.error(`Failed to find a task. ${err}`);
    throw err;
  }
};

TaskSchema.statics.updateTaskBySerial = async (serial, testPlanId, taskObject) => {
  try {
    return await TaskModel.findOneAndUpdate({serial: serial, testPlanId: testPlanId}, taskObject, {new: true});
  } catch (err) {
    logger.error(`Failed to update a task. ${err}`);
    throw err;
  }
};

TaskSchema.statics.listTasks = (testPlanId, skip, limit) => {
  return new global.Promise(function(resolve, reject) {
    var receiveResultSet = function(err, data, count) {
      if(err) {
        logger.error('Failed to list tasks from the DB. ' + err);
        reject(err);
      } else {
        resolve({data: data, count: count});
      }
    };
    TaskModel.countAndFind({testPlanId: testPlanId})
      .skip(skip)
      .limit(limit)
      .sort({serial: 'desc'})
      .exec(receiveResultSet);
  });
};

TaskSchema.statics.updateState = async function(serial, testPlanId, state) {
  try {
    var ret = await TaskModel.findOneAndUpdate({serial: serial, testPlanId: testPlanId}, {$set: {state: state}}, {new: true});
    return ret;
  } catch (err) {
    logger.error('Failed to update the state of task in the DB. ' + err);
    throw err;
  }
};

var TaskModel = mongoose.model('Task', TaskSchema);

module.exports.Model = TaskModel;
module.exports.Schema = TaskSchema;
module.exports.State = State;
module.exports.Type = Type;