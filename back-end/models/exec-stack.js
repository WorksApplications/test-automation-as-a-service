let mongoose = require('mongoose');
let logger = require('../logger');
let Schema = mongoose.Schema;
let TestCodeModel = require('./testcode').Model;

let ExecStackEntry = {
  timestamp: Number,
  class: String,
  line: Number,
  method: String,
  classCall: String,
  lineCall: Number
};

let ExecStackSchema = new Schema({
  serial: Number,
  execStack: [ExecStackEntry],
  codes: {},
  methods: {},
  exceptions: {}
});

let execStackCache = {};
let execCodeCache = {};
let testJobBranch = {};

function initExecStack(serial) {
  if(!execStackCache[serial]) {
    execStackCache[serial] = {serial: serial, execStack: [], codes: {}, methods: {}, exceptions: {}};
  }
}

function getMethodRange(code, entry) {
  if (!code) return null;
  let calls = code.calls;
  for (let i in calls) {
    let call = calls[i];
    if (entry.class === call.callee.class
      && entry.method === call.caller.funcName
      && entry.lineCall === call.caller.line) {
      return {
        start: call.callee.start,
        end: call.callee.end
      };
    }
  }
}

async function cacheCode(serial, className) {
  let classPath = className.replace(/\./g, '/');
  if (!execStackCache[serial].codes[classPath]) {
    let classCode = await TestCodeModel.retrieve(testJobBranch[serial], className);
    if (classCode.codes[0]) {
      execCodeCache[classPath] = classCode.codes[0];
      execStackCache[serial].codes[classPath] = classCode.codes[0].code;
      return classCode.codes[0].code;
    }
  }
  return null;
}

async function cacheCodeAndMethodLine(serial, entry) {
  let codes = {};
  let methods = {};
  let classCode = await cacheCode(serial, entry.class);
  let classPath = entry.class.replace(/\./g, '/');
  if (classCode !== null) {
    codes[classPath] = classCode;
  }
  let classCallPath = '';
  if (entry.classCall !== '') {
    classCallPath = entry.classCall.replace(/\./g, '/');
    let classCallCode = await cacheCode(serial, entry.classCall);
    if (classCallCode !== null) {
      codes[classCallPath] = classCallCode;
    }
    if (!execStackCache[serial].methods[classPath]) {
      execStackCache[serial].methods[classPath] = {};
    }
    if (!execStackCache[serial].methods[classPath][entry.method]) {
      execStackCache[serial].methods[classPath][entry.method]
        = getMethodRange(execCodeCache[classCallPath], entry);
      if (!methods[classPath]) {
        methods[classPath] = {};
      }
      methods[classPath][entry.method] = execStackCache[serial].methods[classPath][entry.method];
    }
  }
  return {
    codes: codes,
    methods: methods
  };
}

ExecStackSchema.statics.recordBranch = function(serial, branch) {
  if (!testJobBranch[serial]) {
    testJobBranch[serial] = branch;
  }
};

ExecStackSchema.statics.initExecStack = initExecStack;

ExecStackSchema.statics.appendExecStack = function(serial, execStackEntry) {
  try {
    initExecStack(serial);
    execStackCache[serial].execStack.push(execStackEntry);
    return cacheCodeAndMethodLine(serial, execStackEntry);
  } catch (err) {
    logger.error('Failed to retrieve codes. ' + err);
    throw err;
  }
};

ExecStackSchema.statics.flushExecStack = async function(serial) {
  if(!execStackCache[serial]) return new global.Promise((resolve) => resolve());
  try {
    let ret = await ExecStack.create(execStackCache[serial]);
    delete execStackCache[serial];
    return ret;
  } catch (err) {
    logger.error('Failed to save execution stack. ' + err);
    throw err;
  }
};

ExecStackSchema.statics.retrieve = async function(serial, execStackSkip, execStackLimit) {
  if(execStackCache[serial]) return new global.Promise((resolve) => {
    let start = execStackSkip ? execStackSkip : 0;
    let end = execStackLimit ? start + execStackLimit : undefined;
    resolve({
      serial: serial,
      codes: execStackCache[serial].codes,
      methods: execStackCache[serial].methods,
      exceptions: execStackCache[serial].exceptions,
      execStack: execStackCache[serial].execStack.slice(start, end)
    });
  });
  try {
    let ret = await ExecStack.findOne({serial: serial})
      .select({_id: false, __v: false, 'execStack._id': false})
      .exec();
    if (!ret) {
      ret = await ExecStack.create({
        serial: serial,
        execStack: [],
        codes: {},
        methods: {},
        exceptions: {}
      });
    }
    return ret;
  } catch (err) {
    logger.error('Failed to retrieve execution stack. ' + err);
    throw err;
  }
};

ExecStackSchema.statics.recordException = function(serial, testcase, exception) {
  if (!execStackCache[serial]) return new Error(`Test job #${serial} not found.`);
  execStackCache[serial].exceptions[testcase.replace(/\./g, '/')] = exception;
  return cacheCodeAndMethodLine(serial, exception);
};

let ExecStack = mongoose.model('ExecStack', ExecStackSchema);

module.exports.Model = ExecStack;
module.exports.Schema = ExecStackSchema;
