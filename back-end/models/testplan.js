const mongoose = require('mongoose');
const logger = require('../logger');
const Schema = mongoose.Schema;
const TestPlanSerial = require('../counter')('testPlanSerial');

const State = {
  NEW: 'new',
  IN_PROGRESS: 'in progress',
  DESTRUCTED: 'destructed',
  FINISHED: 'finished'
};

const ActivityType = {
  EDIT: 'Edit',
  OPERATE: 'Operate'
};

const ActivityEntry = new Schema({
  user: String,
  type: String,
  date: Date,
  edits: Array,
  operation: String
});

const CommentEntry = new Schema({
  creator: String,
  create: Date,
  editor: String,
  edit: Date,
  content: String
});

const TestPlanSchema = new Schema({
  serial: {
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
  collaborators: {
    type: [String],
    default: []
  },
  objective: {
    type: String, // objective
    required: true
  },
  branch: String,
  platforms: Array,
  testcases: Array,
  environment: {
    url: {
      type: String,
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
  },
  channel: {
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
  },
  description: String, // detailed description markdown supported text
  target: String, // target environment to test e.g. jilli
  targetBaseURL: String,
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
  },
  taskCounter: Number,
  activities: [ActivityEntry],
  comments: [CommentEntry]
});

TestPlanSchema.statics.createTestPlan = async (doc) => {
  let serial = await TestPlanSerial.next();
  doc.serial = serial;
  doc.state = 'new';
  try {
    return await TestPlanModel.create(doc);
  } catch (err) {
    logger.error(`Failed to create a test plan. ${err}`);
    throw err;
  }
};

TestPlanSchema.statics.findTestPlanBySerial = async (serial) => {
  try {
    let testPlan = await TestPlanModel.findOne({serial: serial});
    if (testPlan) {
      testPlan = testPlan.toObject();
    }
    return testPlan;
  } catch (err) {
    logger.error(`Failed to find test plan by serial. ${err}`);
    throw err;
  }
};

TestPlanSchema.statics.getNextTaskSerial = async (serial) => {
  try {
    var ret = await TestPlanModel.findOneAndUpdate({serial: serial}, {$inc: {taskCounter: 1}}, {new: true});
    if (ret) {
      return ret.taskCounter;
    } else {
      logger.error('Failed to update task serial');
    }
  } catch (err) {
    logger.error(`Failed to get next task serial. ${err}`);
    throw err;
  }
};

TestPlanSchema.statics.updateState = async function(serial, state) {
  try {
    var ret = await TestPlanModel.findOneAndUpdate({serial: serial}, {$set: {state: state}}, {new: true});
    return ret;
  } catch (err) {
    logger.error('Failed to update the state of test plan in the DB. ' + err);
    throw err;
  }
};

TestPlanSchema.statics.recordActivity = async function(serial, activity) {
  try {
    var ret = await TestPlanModel.findOneAndUpdate({serial: serial}, {$push: {activities: activity}}, {new: true});
    return ret;
  } catch (err) {
    logger.error('Failed to record acitivity of test plan in the DB. ' + err);
    throw err;
  }
};

TestPlanSchema.statics.createComment = async function(serial, comment) {
  try {
    var ret = await TestPlanModel.findOneAndUpdate({serial: serial}, {$push: {comments: comment}}, {new: true});
    return ret;
  } catch (err) {
    logger.error('Failed to create comment of test plan in the DB. ' + err);
    throw err;
  }
};

TestPlanSchema.statics.updateComment = async function(serial, _id, editor, content) {
  try {
    var ret = await TestPlanModel.findOneAndUpdate(
      {serial: serial, 'comments._id': _id},
      {$set: {
        'comments.$.editor': editor,
        'comments.$.edit': new Date(),
        'comments.$.content': content
      }}, {new: true});
    return ret;
  } catch (err) {
    logger.error('Failed to update comment of test plan in the DB. ' + err);
    throw err;
  }
};

const TestPlanModel = mongoose.model('TestPlan', TestPlanSchema);
module.exports.Model = TestPlanModel;
module.exports.State = State;
module.exports.ActivityType = ActivityType;
