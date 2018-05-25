import { getJson, headers, paramsToString } from './common.js'
import fetchwrapper from './fetchapiwrapper'

const urlPrefix = '/api/testresults'

export const getRecentTestResults = function (branch, locator, platform, limit = 5) {
  let tmp = urlPrefix + paramsToString({
    branch, locator, platform, limit
  })
  return fetchwrapper(tmp, {
    method: 'GET',
    headers
  }).then(getJson)
}

export const getTestResultForJob = function (branch, locator, platform, jobId) {
  let tmp = urlPrefix + paramsToString({
    branch, locator, platform, jobId
  })
  return fetchwrapper(tmp, {
    method: 'GET',
    headers
  }).then(getJson)
}

export const getTestResultsForJob = function (jobId) {
  let tmp = urlPrefix + paramsToString({
    jobId
  })
  return fetchwrapper(tmp, {
    method: 'GET',
    headers
  }).then(getJson)
}

export const getTestResultsForLocatorAndBranch = function (branch, locator) {
  const url = urlPrefix + paramsToString({
    branch, locator
  })
  return fetchwrapper(url, {
    method: 'GET',
    headers
  }).then(getJson)
}

export default {
  getRecentTestResults,
  getTestResultForJob,
  getTestResultsForJob,
  getTestResultsForLocatorAndBranch
}
