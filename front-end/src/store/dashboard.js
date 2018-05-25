import api from '@/api/dashboard.js'

export default {
  namespaced: true,
  state: {
    testresults: {},
    lastUpdatedAt: undefined
  },
  mutations: {
    UPDATE_DASHBOARD (state, dashboard) {
      state.testresults = dashboard.testresults
      state.lastUpdatedAt = dashboard.date
    }
  },
  actions: {
    getDashboard ({ commit }, branch) {
      const update = (json) => {
        if (json && json.success) {
          commit('UPDATE_DASHBOARD', json.dashboard)

          return json.dashboard
        }
      }
      return api.getDashboard(branch).then(update)
    }
  }
}
