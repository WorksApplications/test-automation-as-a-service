import { fetchAll } from '@/api/schedules.js'

export default {
  namespaced: true,
  state: {
    schedules: []
  },
  mutations: {
    UPDATE_ALL ({ schedules }, newSchedules) {
      schedules.splice(0, schedules.length)
      if (Array.isArray(newSchedules)) {
        newSchedules.forEach((ele) => {
          schedules.push(ele)
        })
      }
    }
  },
  actions: {
    fetchAll ({ commit }) {
      const updateAll = (schedules) => commit('UPDATE_ALL', schedules)

      return fetchAll().then(updateAll)
    }
  }
}
