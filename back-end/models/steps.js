let mongoose = require('mongoose');
let logger = require('../logger');
let Schema = mongoose.Schema;

let StepEntry = {
  timestamp: Number,
  element: Object,
  action: String,
  inputValue: String
};

let StepSchema = new Schema({
  serial: Number,
  steps: [StepEntry]
});

let stepCache = {};

function initStep(serial) {
  if(!stepCache[serial]) {
    stepCache[serial] = {serial: serial, steps: []};
  }
}

StepSchema.statics.initStep = initStep;

StepSchema.statics.appendStep = function(serial, step) {
  initStep(serial);
  stepCache[serial].steps.push(step);
};

StepSchema.statics.flushSteps = async function(serial) {
  if(!stepCache[serial]) return new global.Promise((resolve) => resolve());
  try {
    let ret = await Step.create(stepCache[serial]);
    delete stepCache[serial];
    return ret;
  } catch (err) {
    logger.error('Failed to save steps. ' + err);
    throw err;
  }
};

StepSchema.statics.retrieve = async function(serial, stepSkip, stepLimit) {
  if(stepCache[serial]) return new global.Promise((resolve) => {
    let start = stepSkip ? stepSkip : 0;
    let end = stepLimit ? start + stepLimit : undefined;
    resolve({serial: serial, steps: stepCache[serial].steps.slice(start, end)});
  });
  try {
    let ret = await Step.findOne({serial: serial})
      .select({_id: false, __v: false, 'steps._id': false})
      .exec();
    return ret;
  } catch (err) {
    logger.error('Failed to retrieve steps. ' + err);
    throw err;
  }
};

StepSchema.statics.updateStepResult = function(serial, testcase, result) {
  logger.info(`Update steps for #${serial}: ${testcase} to ${result}.`);
  if(!stepCache[serial]) return null;
  for(let i = 0; i < stepCache[serial].steps.length; i++) {
    let step = stepCache[serial].steps[i];
    if(step && step.element && step.element.value === testcase) {
      stepCache[serial].steps[i].inputValue = result;
      break;
    }
  }
  return stepCache[serial];
};

let Step = mongoose.model('Step', StepSchema);

module.exports.Model = Step;
module.exports.Schema = StepSchema;
