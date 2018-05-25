import userapi from '../api/user'

export default {
  namespaced: true,
  state: {
    user: undefined,
    loginRequired: false
  },
  mutations: {
    SET_USER (state, newUser) {
      if (newUser) {
        state.user = newUser
      } else {
        state.user = null
      }
    },
    REMOVE_USER (state, setNeedLogin) {
      state.user = null
      state.loginRequired = !!setNeedLogin
    },
    SET_NEED_LOGIN (state, newState) {
      state.loginRequired = !!newState
    },
    UPDATE_API_TOKEN (state, apiToken) {
      if (state.user) {
        state.user.api_token = apiToken
      }
    }
  },
  getters: {
    isLoggedIn (state) {
      return !!state.user
    }
  },
  actions: {
    getUserInfo ({ commit, state }) {
      state.user = undefined
      return userapi.getUserInfo().then(result => {
        if (result.success) {
          commit('SET_USER', result.user)
        }
        return result.user
      })
    },
    login ({ commit, state }, username, password) {
      state.user = undefined
      return userapi.login(username, password).then(result => {
        if (result.success) {
          commit('SET_USER', result.user)
        } else {
          commit('REMOVE_USER')
        }
        return result.user
      })
    },
    generateApiToken ({ commit, state }, username) {
      username = username || state.user.username
      return userapi.generateApiToken(username).then(result => {
        if (result.success) {
          commit('UPDATE_API_TOKEN', result.api_token)
          return result.api_token
        } else {
          return null
        }
      })
    }
  }
}
