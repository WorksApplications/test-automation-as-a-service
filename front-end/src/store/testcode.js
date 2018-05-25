import testcodeapi from '@/api/testcode.js'

export default {
  namespaced: true,
  state: {
    branch: '',
    codes: [],
    lastUpdate: ''
  },
  mutations: {
    UPDATE_BRANCH_DATE: (state, payload) => {
      if (payload) {
        state.branch = payload.branch
        state.lastUpdate = payload.lastUpdate
      }
    },
    // update single class code
    UPDATE_CODE: (state, code) => {
      const element = state.codes.find((ele) => ele.class === code.class)
      if (element) {
        element.code = code.code
      } else {
        state.codes.push(code)
      }
    }
  },
  actions: {
    updateCode ({ commit }, payload) {
      const update = (json) => {
        commit('UPDATE_CODE', {
          class: json.codes[0].class,
          code: json.codes[0].code,
          calls: json.codes[0].calls
        })
        commit('UPDATE_BRANCH_DATE', {
          branch: json.branch,
          lastUpdate: json.lastUpdate
        })
      }

      return testcodeapi.fetchCode(payload.branch, payload.class).then(update)
    }
  }
}
