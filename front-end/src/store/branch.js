import _ from 'lodash'
import BranchesAPI from '@/api/branches.js'
import BranchesUtils from '@/utils/branches.js'

/*
  // state.branches
  [
    {
      value: 'develop',
      label: 'Latest'
    }, {
      value: 'TaaS_collaboration_17.09',
      label: 'Enterprise Collaboration (17.09)'
    }, {
      value: 'TaaS_collaboration_17.10',
      label: 'Enterprise Collaboration (17.10)'
    }
  ]
 */

export default {
  namespaced: true,
  state: {
    branches: []
  },
  getters: {},

  mutations: {
    SET_BRANCHES: (state, branches) => {
      state.branches = _.cloneDeep(branches)
    }
  },
  actions: {
    updateBranches: async context => {
      const byVersions = BranchesUtils.filterByVersions
      const toObject = BranchesUtils.mapToObject
      let branches
      if (document.location.host === 'taas.internal.worksap.com') {
        branches = (await BranchesAPI.fetchAll()).branches.filter(byVersions).map(toObject)
      } else {
        branches = (await BranchesAPI.fetchAll()).branches.map(toObject)
      }
      context.commit('SET_BRANCHES', branches)
    }
  }
}
