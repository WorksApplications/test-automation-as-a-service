import { getJson, headers, paramsToString } from './common.js'
import fetchwrapper from './fetchapiwrapper'
import { EventBus } from '@/utils/eventBus'

const urlPrefix = '/api/testplans'

const createTestPlan = (testPlan) => {
  return fetchwrapper(urlPrefix, {
    method: 'POST',
    headers,
    body: JSON.stringify(testPlan)
  }).then(getJson)
}

const saveTestPlan = (testPlan, confirmApply = false) => {
  let serial = testPlan.serial
  let url = `${urlPrefix}/${serial}`
  if (confirmApply) {
    url += '?confirmApply=true'
  }
  return fetchwrapper(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(testPlan)
  }).then(getJson).then((json) => {
    EventBus.$emit('add-collaborator')
    return json
  })
}

const getOneTestPlan = (serial) => {
  return fetchwrapper(`${urlPrefix}/${serial}`, {
    method: 'GET',
    headers
  }).then(getJson)
}
/**
 * get test plans paginated
 *
 * @param {*} pageNumber starts from 1
 * @param {*} pageSize default 10
 */
const getTestPlanPaginated = (pageNumber = 1, pageSize = 10) => {
  let skip = (pageNumber - 1) * pageSize
  let limit = pageSize
  return fetchwrapper(urlPrefix + paramsToString({ skip, limit }), {
    method: 'GET',
    headers
  }).then(getJson)
}

const createTask = (task, testPlanSerial) => {
  return fetchwrapper(`${urlPrefix}/${testPlanSerial}/tasks`, {
    method: 'POST',
    headers,
    body: JSON.stringify(task)
  }).then(getJson).then((json) => {
    EventBus.$emit('add-collaborator')
    return json
  })
}

const getTask = (testPlanSerial, taskSerial) => {
  return fetchwrapper(`${urlPrefix}/${testPlanSerial}/tasks/${taskSerial}`, {
    method: 'GET',
    headers
  }).then(getJson)
}

const saveTask = (testPlanSerial, task, confirmApply = false) => {
  let taskSerial = task.serial
  let url = `${urlPrefix}/${testPlanSerial}/tasks/${taskSerial}`
  if (confirmApply) {
    url += '?confirmApply=true'
  }
  return fetchwrapper(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(task)
  }).then(getJson).then((json) => {
    EventBus.$emit('add-collaborator')
    return json
  })
}

const updateTaskState = (testPlanSerial, taskSerial, state) => {
  return fetchwrapper(`${urlPrefix}/${testPlanSerial}/tasks/${taskSerial}/state`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      state: state
    })
  }).then(getJson).then((json) => {
    EventBus.$emit('add-collaborator')
    return json
  })
}

const getTasks = (testPlanSerial, params = {}) => {
  return fetchwrapper(`${urlPrefix}/${testPlanSerial}/tasks` + paramsToString(params), {
    method: 'GET',
    headers
  }).then(getJson)
}

const getAllTasksName = (testPlanSerial) => {
  return fetchwrapper(`${urlPrefix}/${testPlanSerial}/tasks_name`, {
    method: 'GET',
    headers
  }).then(getJson)
}

const recordAttachmentActivity = (testPlanSerial, taskSerial, taskName, attachments, isUpload) => {
  return fetchwrapper(`${urlPrefix}/${testPlanSerial}/attachment`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      taskSerial: taskSerial,
      taskName: taskName,
      attachments: attachments,
      isUpload: isUpload
    })
  }).then(getJson).then((json) => {
    EventBus.$emit('add-collaborator')
    return json
  })
}

const submitComment = (serail, content) => {
  return fetchwrapper(`${urlPrefix}/${serail}/comments`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      content: content
    })
  }).then(getJson).then((json) => {
    EventBus.$emit('add-collaborator')
    return json
  })
}

const updateComment = (serail, id, content) => {
  return fetchwrapper(`${urlPrefix}/${serail}/comments/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      content: content
    })
  }).then(getJson).then((json) => {
    EventBus.$emit('add-collaborator')
    return json
  })
}

export default {
  createTestPlan,
  saveTestPlan,
  getOneTestPlan,
  getTestPlanPaginated,
  createTask,
  getTask,
  saveTask,
  updateTaskState,
  getTasks,
  getAllTasksName,
  recordAttachmentActivity,
  submitComment,
  updateComment
}
