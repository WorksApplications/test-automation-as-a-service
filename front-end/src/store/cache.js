import UserAPI from '@/api/user.js'
import testplanapi from '@/api/testplan.js'

export default {
  namespaced: true,
  state: {
    userAvatars: {},
    tasksName: []
  },
  getters: {},

  mutations: {},
  actions: {
    getAvatar: async (context, user) => {
      if (user === undefined) {
        context.state.userAvatars[user] = '/static/avatar.png'
      } else if (context.state.userAvatars[user] === undefined) {
        context.state.userAvatars[user] = await UserAPI.getAvatar(user)
      }
      return context.state.userAvatars[user]
    },
    updateTasksName: async (context, testPlanSerial) => {
      if (testPlanSerial) {
        let ret = await testplanapi.getAllTasksName(testPlanSerial)
        if (ret) {
          context.state.tasksName = ret.tasksName
        }
      }
    }
  }
}
