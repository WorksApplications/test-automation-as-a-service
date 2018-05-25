import { getJson, headers } from './common.js'
import fetchwrapper from './fetchapiwrapper.js'

const urlPrefix = '/api/testcode'

export const fetchCode = (branch, className) => {
  const branchName = branch || ''
  let url = urlPrefix + '/' + branchName
  if (className) {
    url += '?class=' + className
  }
  return fetchwrapper(url, {
    method: 'GET',
    headers
  }).then(getJson)
}

export default {
  fetchCode
}
