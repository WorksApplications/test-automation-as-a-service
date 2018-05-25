// New Code
import fetchWrapper from './fetchWrapper'

// Old Code
import { getJson, headers, paramsToString } from './common.js'
import { formatTestjob } from './format'
import fetchwrapper from './fetchapiwrapper'

// New Code
const urlPrefix = '/api/testjobs'

export const query = async (params = {}) => {
  return fetchWrapper(urlPrefix, {
    params,
    method: 'GET'
  })
}

// Old Code
export const run = function (form) {
  return fetchwrapper(urlPrefix, {
    method: 'POST',
    headers,
    body: JSON.stringify(form)
  }).then(getJson)
}
export const getList = function (params = { scheduleid: undefined, testPlanId: undefined, taskId: undefined }) {
  return fetchwrapper(urlPrefix + paramsToString(params), {
    method: 'GET',
    headers
  })
    .then(getJson)
}

export const getCount = function (params = { scheduleid: undefined, testPlanId: undefined, taskId: undefined, limit: 15 }) {
  return fetchwrapper(urlPrefix + paramsToString(params), {
    method: 'GET',
    headers
  })
    .then(getJson)
}

export const getOne = function (id) {
  return fetchwrapper(`${urlPrefix}/${id}`, {
    method: 'GET',
    credentials: 'same-origin',
    headers
  })
    .then(getJson)
    .then(json => json.testjobs)
    .then(formatTestjob)
}

export const getAllByBranchAndLocator = function (branch, locator) {
  return fetchwrapper(urlPrefix + paramsToString({ branch, locator }), {
    method: 'GET',
    credentials: 'same-origin',
    headers
  })
    .then(getJson)
    .then(json => json.testjobs)
    .then(formatTestjob)
}

export const stopOne = function (id) {
  return fetchwrapper(`${urlPrefix}/${id}`, {
    method: 'DELETE',
    headers
  }).then(getJson)
}

export const getLog = (id) => {
  return fetch(`${urlPrefix}/${id}/logs`, {
    method: 'GET',
    headers
  }).then(getJson)
}

export const getSteps = (id) => {
  return fetch(`${urlPrefix}/${id}/steps`, {
    method: 'GET',
    headers
  }).then(getJson)
}

export const getExecStack = (id) => {
  return fetch(`${urlPrefix}/${id}/exec_stack`, {
    method: 'GET',
    headers
  }).then(getJson)
}

export const updateResolve = (id, resolve) => {
  return fetchwrapper(`${urlPrefix}/${id}/resolve`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(resolve)
  }).then(getJson)
}

export default {
  run, getList, getCount, getOne, stopOne, getLog, getSteps, getExecStack, updateResolve, query, getAllByBranchAndLocator
}
