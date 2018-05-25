import { getJson, headers } from './common.js'
import fetchwrapper from './fetchapiwrapper.js'

const urlPrefix = '/api/accessibility'

export const check = function (url) {
  return fetchwrapper(urlPrefix + '/?url=' + url, {
    method: 'GET',
    headers
  })
    .then(getJson)
}

export default {
  check
}
