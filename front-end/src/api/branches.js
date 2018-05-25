import { getJson, headers } from './common.js'
import fetchwrapper from './fetchapiwrapper.js'

const urlPrefix = '/api/branches'

export const fetchAll = function () {
  return fetchwrapper(urlPrefix, {
    method: 'GET',
    headers
  })
    .then(getJson)
}

export const refresh = () => {
  return fetchwrapper(urlPrefix, {
    method: 'PUT',
    headers
  })
    .then(getJson)
}

export default {
  fetchAll, refresh
}
