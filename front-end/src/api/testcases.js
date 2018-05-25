import { getJson, headers } from './common.js'
import fetchwrapper from './fetchapiwrapper.js'

const urlPrefix = '/api/testcases'

export const fetchAll = (branch) => {
  const branchName = branch || ''
  return fetchwrapper(urlPrefix + '/' + branchName, {
    method: 'GET',
    headers
  }).then(getJson)
}

export const fetchOne = (branch, locator) => {
  return fetchwrapper(`${urlPrefix}/${branch}/${encodeURIComponent(locator)}`, {
    method: 'GET',
    headers
  }).then(getJson)
}

export default {
  fetchAll,
  fetchOne
}
