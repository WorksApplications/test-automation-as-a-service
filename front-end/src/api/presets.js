import { getJson, headers } from './common.js'
import fetchwrapper from './fetchapiwrapper.js'

const urlPrefix = '/api/presets'

const createOne = function (job) {
  return fetchwrapper(urlPrefix, {
    method: 'POST',
    headers,
    body: JSON.stringify(job)
  }).then(getJson)
}

const getList = function () {
  return fetchwrapper(urlPrefix, {
    method: 'GET',
    headers
  })
    .then(getJson)
    .then(json => json.presets)
}

const updateOne = function (job) {
  return fetchwrapper(urlPrefix + '/' + job._id, {
    method: 'PUT',
    headers,
    body: JSON.stringify(job)
  }).then(getJson)
}

const deleteOne = function (id) {
  return fetchwrapper(urlPrefix + '/' + id, {
    method: 'DELETE',
    headers
  }).then(getJson)
}

export default {
  createOne, getList, updateOne, deleteOne
}

export {
  createOne, getList, updateOne, deleteOne
}
