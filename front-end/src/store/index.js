import Vue from 'vue'
import Vuex from 'vuex'

import branch from './branch.js'
import cache from './cache.js'
import preset from './preset.js'
import schedule from './schedule.js'
import testjob from './testjob.js'
import testcode from './testcode.js'
import sysinfo from './sysinfo.js'
import dashboard from './dashboard.js'
import user from './user.js'
import socket from './socket.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    branch,
    cache,
    preset,
    schedule,
    testjob,
    testcode,
    sysinfo,
    dashboard,
    user,
    socket
  }
})

export default store
