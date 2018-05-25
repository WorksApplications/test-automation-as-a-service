/*
 *  Created by Samuel Tang on 2018.01.31
 *  Description:
 *     This utility module is to provide methods for various URL formats.
 */

import _ from 'lodash'

const getFullUrl = (path, query, hash) => {
  let href = window.location.href
  let prefix = href.substring(0, href.indexOf('#') + 1)
  let relativeUrl = getRelativeUrl(path, query, hash)
  return `${prefix}${relativeUrl}`
}

const getRelativeUrl = (path, query, hash) => {
  if (_.isEmpty(query)) {
    return `${path}${hash}`
  } else {
    let queryString = Object.keys(query)
      .map(key => {
        const encodedKey = encodeURIComponent(key)
        const encodedVar = encodeURIComponent(query[key])
        return `${encodedKey}=${encodedVar}`
      })
      .join('&')
    return `${path}?${queryString}${hash}`
  }
}

export default { getFullUrl, getRelativeUrl }
