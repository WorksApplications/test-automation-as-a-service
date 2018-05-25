import { getJson, headers } from './common.js'

const urlPrefix = '/files/api/resource'

const fetchApkList = function () {
  return fetch(`${urlPrefix}/apk`, {
    method: 'GET',
    headers
  })
    .then(getJson)
    .then(json => json.items)
}

const uploadApk = function (file) {
  return fetch(`${urlPrefix}/apk/${file.name}`, {
    method: 'POST',
    body: file
  })
}

const fetchAttachmentList = function (testPlanSerial, taskSerial) {
  let url = `${urlPrefix}/attachment`
  if (testPlanSerial) {
    url += `/${testPlanSerial}`
    if (taskSerial) {
      url += `/${taskSerial}`
    }
  }
  return fetch(url, {
    method: 'GET',
    headers
  })
    .then(getJson)
    .then(json => json.items)
}

const uploadAttachment = function (file, testPlanSerial, taskSerial) {
  let url = `${urlPrefix}/attachment`
  if (testPlanSerial) {
    url += `/${testPlanSerial}`
    if (taskSerial) {
      url += `/${taskSerial}`
    }
  }
  url += `/${file.name}`
  return fetch(url, {
    method: 'POST',
    body: file
  })
}

const removeAttachment = function (fileName, testPlanSerial, taskSerial) {
  let url = `${urlPrefix}/attachment`
  if (testPlanSerial) {
    url += `/${testPlanSerial}`
    if (taskSerial) {
      url += `/${taskSerial}`
    }
  }
  url += `/${fileName}`
  return fetch(url, {
    method: 'DELETE'
  })
}

export default {
  fetchApkList,
  uploadApk,
  fetchAttachmentList,
  uploadAttachment,
  removeAttachment
}
