import { getJson, headers } from './common.js'
import { formatGroups } from './format'
import fetchwrapper from './fetchapiwrapper.js'

const urlPrefix = '/api/groups'

export const getList = function (branch) {
  const branchName = branch || ''
  return fetchwrapper(urlPrefix + '/' + branchName, {
    method: 'GET',
    headers
  })
    .then(getJson)
    .then(formatGroups)
}

export const refreshGroups = (branchName) => {
  return fetchwrapper(urlPrefix + '/' + branchName, {
    method: 'PUT',
    headers
  })
    .then(getJson)
}

export default {
  getList, refreshGroups
}
