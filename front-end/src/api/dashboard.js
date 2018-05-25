import { getJson, headers } from './common.js'
import fetchwrapper from './fetchapiwrapper.js'

const urlPrefix = '/api/dashboard'

const getDashboard = (branch) => {
  return fetchwrapper(`${urlPrefix}/${branch}`, {
    method: 'GET',
    headers
  }).then(getJson)
}

export default {
  getDashboard
}
