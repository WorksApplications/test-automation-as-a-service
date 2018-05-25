import api from '@/api/sysinfo.js'
import moment from 'moment-timezone'

moment.tz.zone('Asia/Singapore').abbrs[6] = 'SGT'

const timezones = [
  'UTC',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Singapore'
]

const guessTimezone = () => {
  const now = new Date()
  let res = 'Asia/Shanghai'

  timezones.some(zone => {
    if (moment.tz.zone(zone).utcOffset(now.getTime()) === now.getTimezoneOffset()) {
      res = zone
      return true
    } else {
      return false
    }
  })

  return res
}

export default {
  namespaced: true,
  state: {
    serverDate: new Date(),
    version: 'v0.0.0',
    commit: '1234567890abcdef1234567890abcdef12345678',
    buildNum: 111111,
    buildDate: '2017-05-09T03:12:57.280Z',

    timezone: guessTimezone(),
    timezones,

    appId: '',

    slackChannelPrefix: 'https://workshuebt.slack.com/messages/',
    slackChannelAppPrefix: 'slack://channel?team=T09N6RYFM&id='
  },
  mutations: {
    UPDATE_ALL (state, newSysinfo) {
      for (const p in newSysinfo) {
        state[p] = newSysinfo[p]
      }
    }
  },
  actions: {
    fetchAll ({ commit }) {
      const update = (json) => {
        commit('UPDATE_ALL', json)
        return json
      }
      return api.fetchAll().then(update)
    }
  }
}
