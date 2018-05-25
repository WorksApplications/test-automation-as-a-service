import { getJson, headers, paramsToString } from './common.js'
import { formatSchedule } from './format'
import fetchwrapper from './fetchapiwrapper.js'

const urlPrefix = '/api/schedules'

export const createOne = (schedule) =>
  fetchwrapper(urlPrefix, {
    method: 'POST',
    headers,
    body: JSON.stringify(schedule)
  }).then(getJson)

export const fetchAll = () =>
  fetchwrapper(urlPrefix, {
    method: 'GET',
    headers
  })
    .then(getJson)
    .then(json => json.schedules)
    .then(schedules => schedules.map(formatSchedule))

export const fetchOne = (id) =>
  fetchwrapper(urlPrefix + '/' + id, {
    method: 'GET',
    headers
  })
    .then(getJson)
    .then(json => json.schedules)
    .then(formatSchedule)

export const deleteOne = (id) => {
  return fetchwrapper(urlPrefix + '/' + id, {
    method: 'DELETE',
    headers
  })
    .then(getJson)
}

export const updateOne = (id, schedule) => {
  return fetchwrapper(urlPrefix + '/' + id, {
    method: 'PUT',
    headers,
    body: JSON.stringify(schedule)
  }).then(getJson)
}

export const getList = (params = {}) =>
  fetchwrapper(urlPrefix + paramsToString(params), {
    method: 'GET',
    headers
  })
    .then(getJson)

export const getCount = (params = { limit: 15 }) =>
  fetchwrapper(urlPrefix + paramsToString(params), {
    method: 'GET',
    headers
  })
    .then(getJson)

export default {
  createOne,
  fetchOne,
  fetchAll,
  deleteOne,
  updateOne,
  getList,
  getCount
}
