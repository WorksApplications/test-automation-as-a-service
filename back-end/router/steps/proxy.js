let express = require('express');
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let logger = require('../../logger');
let StepModel = require('../../models/steps').Model;
let elements = require('./elements');
let recorder = require('../../runner/recorder-agent');
let grid = require('../../router/steps/elements');
let getNode = require('../../runner/runner').getNode;
let SocketService = require('../../service/socket-service');

let api = express.Router();

api.post('/session', jsonParser, function(req, res, next) {
  (async () => {
    let serial = req.hub.serial;
    let node = getNode(serial);
    if(node) {
      await recorder.startRecord(serial, node.vncHost, node.vncPort, node.vncPassword);
      grid.createSession(serial);
    }
  })().then(() => next())
    .catch(err => {
      logger.debug(err.message);
      next();
    });
});

api.post('/session/:uuid/window/current/size', jsonParser, function(req, res, next) {
  let serial = req.hub.serial;
  let step = {
    timestamp: elements.diffTime(serial),
    element: {using: 'plain', value: 'screen resolution'},
    action: 'Set',
    inputValue: `${req.body.width} x ${req.body.height}`
  };
  StepModel.appendStep(serial, step);
  SocketService.broadcastToTestJobUserOrGroups('step', serial, {forceToAllUsers: true}, step);
  next();
});

api.post('/session/:uuid/url', jsonParser, function(req, res, next) {
  let serial = req.hub.serial;
  let step = {
    timestamp: elements.diffTime(serial),
    element: {using: 'plain', value: 'URL'},
    action: 'Open',
    inputValue: req.body.url
  };
  StepModel.appendStep(serial, step);
  SocketService.broadcastToTestJobUserOrGroups('step', serial, {forceToAllUsers: true}, step);
  next();
});

/**
 * Find element:
 *
 * [Request] POST /testjobs/123/hub/session/96905e37-dded-4c23-8acb-074d96034a83/element
 * {
 *   "using": "css selector",
 *   "value": "#password"
 * }
 * [Response] 200 OK
 * {
 *   "state": "success",
 *   "sessionId": "96905e37-dded-4c23-8acb-074d96034a83",
 *   "hCode": 322714832,
 *   "value": {
 *     "ELEMENT": "0"
 *   },
 *   "class": "org.openqa.selenium.remote.Response",
 *   "status": 0
 * }
 */
api.post('/session/:uuid/element', function(req, res, next) {
  try {
    let serial = req.hub.serial;
    let reqBody = req.body;
    let resBody = req.hub.hubBody;
    const id = resBody.value.ELEMENT;

    elements.pushElement(serial, id, reqBody);
  } catch (e) {
    logger.error(e);
    logger.error(JSON.stringify(req.hub));
  } finally {
    next();
  }
});

/**
 * Find element with id:
 *
 * [Request] POST /testjobs/123/hub/session/96905e37-dded-4c23-8acb-074d96034a83/element/11/element
 * {
 *   "id": "11",
 *   "using": "css selector",
 *   "value": "#timeline-menu-icon"
 * }
 * [Response] 200 OK
 * {
 *   "state": "success",
 *   "sessionId": "96905e37-dded-4c23-8acb-074d96034a83",
 *   "hCode": 642585807,
 *   "value": {
 *     "ELEMENT": "34"
 *   },
 *   "class": "org.openqa.selenium.remote.Response",
 *   "status": 0
 * }
 */
api.post('/session/:uuid/element/:id/element', function(req, res, next) {
  try {
    let serial = req.hub.serial;
    let reqBody = req.body;
    let resBody = req.hub.hubBody;
    const id = resBody.value.ELEMENT;

    elements.pushElement(serial, id, reqBody);
  } catch (e) {
    logger.error(e);
    logger.error(JSON.stringify(req.hub));
  } finally {
    next();
  }
});

/**
 * Click
 *
 * [Request] POST /testjobs/123/hub/session/96905e37-dded-4c23-8acb-074d96034a83/element/1/click
 * {
 *   "id": "1"
 * }
 */
api.post('/session/:uuid/element/:elementId/click', function(req, res, next) {
  let serial = req.hub.serial;
  let elementId = req.params.elementId;
  let element = elements.getElement(serial, elementId);

  let step = {
    timestamp: elements.diffTime(serial),
    element: element,
    action: 'Click',
    inputValue: ''
  };
  StepModel.appendStep(serial, step);
  SocketService.broadcastToTestJobUserOrGroups('step', serial, {forceToAllUsers: true}, step);
  next();
});

/**
 * Input
 *
 * [Request] POST /testjobs/123/hub/session/96905e37-dded-4c23-8acb-074d96034a83/element/0/value
 * {
 *   "id": "0",
 *   "value": [
 *     "dummy"
 *   ]
 * }
 */
api.post('/session/:uuid/element/:elementId/value', function(req, res, next) {
  let serial = req.hub.serial;
  let elementId = req.params.elementId;
  let element = elements.getElement(serial, elementId);
  let reqBody = req.body;
  const value = reqBody.value;

  let step = {
    timestamp: elements.diffTime(serial),
    element: element,
    action: 'Input',
    inputValue: value
  };
  StepModel.appendStep(serial, step);
  SocketService.broadcastToTestJobUserOrGroups('step', serial, {forceToAllUsers: true}, step);
  next();
});



module.exports = api;
