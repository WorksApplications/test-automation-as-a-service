import { updateOne, deleteOne, findBy } from './common.js'
import presetapi from '@/api/presets.js'

const byName = (preset) => (ele) => preset.name === ele.name

const getIdByName = (preset, presets) => {
  const res = presets.find(byName(preset))
  if (res) { return res._id } else { return undefined }
}

export default {
  namespaced: true,
  state: {
    presets: []
  },
  getters: {
    exist: ({ presets }) => (preset) => {
      return presets.some(findBy()(preset))
    }
  },
  mutations: {
    UPDATE_ONE: ({ presets }, preset) => {
      updateOne(preset)(presets, preset)
    },
    DELETE_ONE: ({ presets }, preset) => {
      deleteOne()(presets, preset)
    },
    UPDATE_ALL: ({ presets }, newpresets) => {
      presets.splice(0, presets.length)
      if (Array.isArray(newpresets)) {
        newpresets.forEach((ele) => {
          presets.push(ele)
        })
      }
    }
  },
  actions: {
    getList ({ commit }) {
      const changeList = (presets) => commit('UPDATE_ALL', presets)

      presetapi.getList().then(changeList)
    },
    createOne ({ commit, dispatch, getters, state }, preset) {
      const updateList = () => dispatch('getList')

      return presetapi.createOne(preset).then(updateList)
    },
    updateOne ({ commit, dispatch, getters, state }, preset) {
      const updateList = () => dispatch('getList')

      preset._id = getIdByName(preset, state.presets)

      return presetapi.updateOne(preset).then(updateList)
    },
    deleteOne ({ commit, dispatch }, preset) {
      const updateList = () => dispatch('getList')

      return presetapi.deleteOne(preset._id).then(updateList)
    }
  }
}
