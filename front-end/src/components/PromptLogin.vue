<template>
  <span>
    <el-dialog
      :visible = "user === null && loginRequired"
      :before-close="handleClose"
      title="Login to Proceed"
      width="400px">
      <el-form>
        <el-form-item
          v-show="false"
          label="Username"
          required>
          <el-input v-model="username"/>
        </el-form-item>
        <el-form-item
          v-show="false"
          label="Password"
          required>
          <el-input
            v-model="password"
            type="password" />
        </el-form-item>
        <span class="footer-actions">
          <span
            v-show="hasError"
            class="error-msg">Username or Password Invalid</span>
          <el-button
            type="text"
            @click="goGCRegister">Register</el-button>
          <el-button
            type="text"
            @click="loginGC">Login @ Genius Center</el-button>
          <el-button
            v-show="false"
            :plain="true"
            :disabled="username === '' || password === ''"
            type="primary"
            @click="login">Login</el-button>
        </span>
      </el-form>
    </el-dialog>
  </span>
</template>

<script>
import { mapState } from 'vuex'
import store from '@/store'
import { login } from '@/api/user'

export default {

  name: 'LoginPage',
  components: {},

  props: {},

  data: () => ({
    username: '',
    password: '',
    hasError: false
  }),
  computed: {
    ...mapState('user', ['user', 'loginRequired']),
    ...mapState('sysinfo', ['appId'])
  },
  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    showLoginDialog () {
      store.commit('user/SET_NEED_LOGIN', true)
    },
    handleClose () {
      const _this = this

      _this.hasError = false
      _this.username = ''
      _this.password = ''
      store.commit('user/SET_NEED_LOGIN', false)
    },
    login () {
      const _this = this
      login(_this.username, _this.password).then(res => {
        store.commit('user/SET_USER', res.user)
      }).catch(err => {
        if (err.message) {
          _this.hasError = true
        }
      })
    },
    goGCRegister () {
      window.open('http://genius.internal.worksap.com/users/new', '_blank')
    },
    loginGC () {
      const _this = this
      let path = encodeURIComponent(_this.$route.fullPath)
      window.location.replace('http://genius.internal.worksap.com/login?app_id=' + _this.appId + '&redirect_uri=' + path)
    }
  }

}
</script>

<style lang='scss' scoped>
  .footer-actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    .error-msg {
      color: red;
      position: absolute;
      left: 5px;
    }
  }
</style>
