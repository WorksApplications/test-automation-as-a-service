
import store from '@/store'

const fetchWrapper = (input, init) => {
  let globalInit = {
    credentials: 'same-origin'
  }

  let mergedInit = Object.assign(globalInit, init)

  return fetch(input, mergedInit).then((response) => {
    if (response.status === 401) {
      store.commit('user/REMOVE_USER', true)
      return response
    } else {
      return response
    }
  })
}

export default fetchWrapper
