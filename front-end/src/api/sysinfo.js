import { getJson, headers } from './common.js'
import fetchwrapper from './fetchapiwrapper.js'

const urlPrefix = '/api/sysinfo'
const apiLiveUrls = urlPrefix + '/liveurls'

export const fetchAll = () =>
  fetchwrapper(urlPrefix, {
    method: 'GET',
    headers
  })
    .then(getJson)

export const fetchLiveUrls = () => {
  return fetchwrapper(apiLiveUrls, {
    method: 'GET',
    headers
  })
    .then(getJson)
}

export default {
  fetchAll, fetchLiveUrls
}
