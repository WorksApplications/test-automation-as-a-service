import axios from 'axios'

const fetchWrapper = async (url, customConfigs) => {
  let mergedConfigs = {
    // Accept any status code response. Accept 2xx only by default.
    validateStatus: (status) => true,
    url,
    credentials: 'same-origin',
    headers: {
      'Cache-Control': 'no-cache'
    }
  }
  Object.keys(customConfigs).forEach(key => {
    mergedConfigs[key] = customConfigs[key]
  })
  return axios(mergedConfigs)
    .then(response => response.data)
}

export default fetchWrapper
