import testjobsapi from '@/api/testjobs.js'
import { cloneArrMonitored } from '@/utils'

export default {
  namespaced: true,
  state: {
    testjobs: [],
    selection: []
  },
  mutations: {
    CHANGE_SELECTION ({ selection }, newSelection) {
      cloneArrMonitored(selection, newSelection)
    },
    UPDATE_TESTJOBS ({ testjobs }, newTestjobs) {
      cloneArrMonitored(testjobs, newTestjobs)
    }
  },
  actions: {
    run ({ commit }, form) {
      return testjobsapi.run(form)
    },
    getList ({ commit }) {
      const updateTestjobs = (testjobs) => {
        commit('UPDATE_TESTJOBS', testjobs.testjobs)
      }

      testjobsapi.getList()
        .then(updateTestjobs)
    },
    updateResolve ({ commit, dispatch, state }, resolve) {
      const updateList = () => dispatch('getList')

      return testjobsapi.updateResolve(resolve.id, resolve.resolve).then(updateList)
    }
  }
}
