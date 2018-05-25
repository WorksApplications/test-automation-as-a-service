<template>
  <v-toolbar
    color="teal lighten-2"
    app
    dark
    fixed>
    <v-spacer />
    <v-btn
      icon
      @click.native="goFeedback">
      <icon
        name="slack"
        scale="1.3" />
    </v-btn>
    <v-btn
      icon
      @click.native="goWiki">
      <icon
        name="wikipedia-w"
        scale="1.3" />
    </v-btn>
    <v-btn
      icon
      @click.native="goGitlabTestcases">
      <icon
        name="gitlab"
        scale="1.3" />
    </v-btn>
    <v-menu
      v-if="user"
      transition="slide-x-reverse-transition"
      offset-y
      left>
      <v-btn
        slot="activator"
        icon
        large
        dark>
        <user-avatar
          :username="user.username"
          size="44px" />
      </v-btn>
      <v-list subheader>
        <v-subheader>{{ user.username }}</v-subheader>
        <v-list-tile
          :to="{ name: 'User' }"
          router
          active-class="-">
          <v-list-tile-action>
            <v-icon>account_circle</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Profile</v-list-tile-title>
        </v-list-tile>
        <v-list-tile
          :to="{ name: 'Settings' }"
          router
          active-class="-">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Settings</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="logout">
          <v-list-tile-action>
            <v-icon>directions_run</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Logout</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-menu
      v-else
      transition="slide-x-reverse-transition"
      offset-y
      left>
      <v-btn
        slot="activator"
        icon
        large
        dark>
        <v-avatar size="44px">
          <img
            src="/static/avatar.png"
            alt="avatar">
        </v-avatar>
      </v-btn>
      <v-list subheader>
        <v-subheader>Guest</v-subheader>
        <v-list-tile @click="goGeniusCenterLogin">
          <v-list-tile-action>
            <v-icon>vpn_key</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Login</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="goGeniusCenterRegister">
          <v-list-tile-action>
            <v-icon>person_add</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Register</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import UtilsUrl from '@/utils/url.js'

import { mapState } from 'vuex'
import store from '@/store'

import ApiUser from '@/api/user.js'
import UserAvatar from '@/components/UserAvatar.vue'

export default {
  name: 'NavigationBar',
  components: {
    UserAvatar
  },

  props: {},

  data: () => ({}),
  computed: {
    ...mapState('user', ['user']),
    ...mapState('sysinfo', ['appId']),
    ...mapState('socket', ['socket'])
  },
  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    // External redirects
    goGitlabTestcases: () => {
      window.open('https://scm.hue.workslan/tools/hue-auto-tests', '_blank')
    },
    goWiki: () => {
      window.open('http://huewiki/mediawiki/index.php/TaaS_Readme', '_blank')
    },
    goFeedback: () => {
      window.open('https://workshuebt.slack.com/messages/C62M7BYG5', '_blank')
    },
    goGeniusCenterRegister: () => {
      window.open('http://genius.internal.worksap.com/users/new', '_blank')
    },
    goGeniusCenterLogin () {
      const appId = this.appId
      let path = this.$route.path
      let query = this.$route.query
      let hash = this.$route.hash
      let redirectUri = encodeURIComponent(
        UtilsUrl.getRelativeUrl(path, query, hash)
      )
      window.open(
        `http://genius.internal.worksap.com/login?app_id=${appId}&redirect_uri=${redirectUri}`,
        '_self'
      )
    },
    // State changes
    showLoginPrompt: () => {
      store.commit('user/SET_NEED_LOGIN', true)
    },
    logout () {
      const _this = this
      const user = this.user
      ApiUser.logout().then(res => {
        store.commit('user/REMOVE_USER', false)
        _this.socket.emit('remove_user', user)
      })
    }
  }
}
</script>

<style lang="scss">
.toolbar__content {
  padding-right: 15px;
}
</style>
