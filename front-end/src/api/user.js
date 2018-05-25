import { getJson, headers, paramsToString } from './common.js'
import fetchwrapper from './fetchapiwrapper.js'

const urlPrefix = '/api/auth'
const userUrlPrefix = '/api/user'

export const getUserInfo = () => {
  return fetchwrapper(urlPrefix + '/userinfo', {
    method: 'GET',
    headers
  }).then(getJson)
}

const getUsers = (params) => {
  return fetchwrapper(userUrlPrefix + paramsToString(params), {
    method: 'GET',
    headers
  }).then(getJson)
}

export const login = (username, password) => {
  return fetchwrapper(urlPrefix + '/login', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      username: username,
      password: password
    })
  }).then(getJson)
}

export const logout = () => {
  return fetchwrapper(urlPrefix + '/logout', {
    method: 'POST',
    headers
  })
}

export const generateApiToken = (username) => {
  return fetchwrapper(userUrlPrefix + '/' + username + '/api_token', {
    method: 'POST',
    headers
  }).then(getJson)
}

export const getAvatar = async username => {
  const response = await fetchwrapper(`/api/avatar/${username}`, {
    method: 'GET',
    headers
  }).then(getJson)
  if (response.success === true) {
    return response.info.avatarUrl
  }
  return '/static/avatar.png'
}

export default {
  login, logout, getUserInfo, generateApiToken, getUsers, getAvatar
}
