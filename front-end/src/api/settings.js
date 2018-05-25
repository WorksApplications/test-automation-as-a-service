import { getJson, headers } from './common.js'
import fetchwrapper from './fetchapiwrapper.js'

const urlPrefix = '/api/settings'

const getTestcases = () => {
  return fetchwrapper(`${urlPrefix}/testcases`, {
    method: 'GET',
    headers
  }).then(getJson)
}

const updateTestcases = (testcases) => {
  return fetchwrapper(`${urlPrefix}/testcases`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(testcases)
  }).then(getJson)
}

export default {
  getTestcases,
  updateTestcases
}
