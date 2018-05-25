const getJsonBody = response => {
  if (response.ok) {
    return response.json()
  } else {
    throw response
  }
}

export const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache'
}

export const getJson = response => {
  return getJsonBody(response)
}

export const paramsToString = (params) => {
  let res = ''

  Object.keys(params).forEach((p) => {
    if (params[p] === null ||
        params[p] === undefined ||
        params[p] === '') return

    if (res === '') res = '?'
    if (res !== '?') res = res + '&'
    let tmp = encodeURIComponent(p) + '=' + encodeURIComponent(params[p])
    res += tmp
  })

  return res
}
