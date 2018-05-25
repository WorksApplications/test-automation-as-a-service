import Vue from 'vue'

import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
import '@/stylus/main.styl'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import '@/element-variables.scss'
import 'font-awesome/css/font-awesome.min.css'
import LazyRender from 'vue-lazy-render'
import VueClipboard from 'vue-clipboard2'

import ECharts from 'vue-echarts'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(ElementUI, { locale })
Vue.use(LazyRender)
Vue.use(VueClipboard)

router.afterEach((to, from) => {
  if (!store.state.user.user && to.meta.requireLogin) {
    store.commit('user/SET_NEED_LOGIN', true)
  }
})

Vue.component('icon', Icon)
Vue.component('chart', ECharts)

Vue.use(Vuetify, {
  theme: {
    primary: colors.teal.lighten2,
    secondary: colors.teal.lighten3,
    accent: colors.teal.base,
    error: colors.red.lighten1,
    warning: colors.yellow.darken1,
    info: colors.blue.lighten1,
    success: colors.green.lighten1,
    successSecondary: colors.lightGreen.lighten1
  }
})

export default new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
