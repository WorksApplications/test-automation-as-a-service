<template>
  <v-app id="app">
    <app-sidebar
      :show-sidebar="showSidebar"
      @toggleSidebar="toggleSidebar" />
    <app-navigation-bar
      :show-sidebar="showSidebar"
      @toggleSidebar="toggleSidebar" />
    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>
    <app-footer />
  </v-app>
</template>

<script>

import store from '@/store'
import { mapState } from 'vuex'

import AppSidebar from '@/components/TheAppSidebar.vue'
import AppNavigationBar from '@/components/TheAppNavigationBar.vue'
import AppFooter from '@/components/TheAppFooter.vue'

export default {

  name: 'App',
  components: {
    AppSidebar,
    AppNavigationBar,
    AppFooter
  },

  props: {},

  data: () => ({
    showSidebar: true
  }),
  computed: {
    ...mapState('socket', ['socket', 'preSocketId'])
  },

  created () {
    store.dispatch('socket/initialSocket')
    store.dispatch('sysinfo/fetchAll')
    store.dispatch('branch/updateBranches')
    setInterval(() => {
      store.commit('sysinfo/UPDATE_ALL', {
        serverDate: new Date().toISOString()
      })
    }, 1000)
  },
  mounted () {
    const _this = this
    this.socket.on('connect', () => {
      store.dispatch('socket/connect')
      getUserInfo().then((user) => {
        if (!user && _this.$route.meta.requireLogin) {
          store.commit('user/SET_NEED_LOGIN', true)
        } else if (user) {
          _this.socket.emit('set_user', user)
        }
      })
    })
    this.socket.on('reconnect', () => {
      _this.socket.emit('reconnection', _this.preSocketId)
    })
  },
  updated () {},
  destroyed () {},
  methods: {
    toggleSidebar: function (val) {
      this.showSidebar = val
    }
  }
}

const getUserInfo = () => store.dispatch('user/getUserInfo')

</script>

<style lang="scss">
.markdown-table {
  padding: 0;
  border-collapse: collapse;
  tr {
    border-top: 1px solid #cccccc;
    background-color: white;
    margin: 0;
    padding: 0;
  }
  tr:nth-child(2n) {
    background-color: #f8f8f8;
  }
  tr th {
    font-weight: bold;
    border: 1px solid #cccccc;
    text-align: left;
    margin: 0;
    padding: 6px 13px;
  }
  tr td {
    border: 1px solid #cccccc;
    text-align: left;
    margin: 0;
    padding: 6px 13px;
  }
  tr th :first-child,
  tr td :first-child {
    margin-top: 0;
  }
  tr th :last-child,
  tr td :last-child {
    margin-bottom: 0;
  }
}

.dialog__content {
  align-items: start;
}

blockquote {
  padding: 3px 15px;
  margin: 0 0 10px;
  border-left: 5px solid #eee;
}

hr {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 0;
  border-top: 1px solid #eee;
  &.divider {
    margin: 0;
  }
}

ol, ul {
  margin-top: 0;
  margin-bottom: 10px;
  padding-inline-start: 30px;
}

ol ol, ol ul, ul ol, ul ul {
  margin-bottom: 0;
}
</style>
