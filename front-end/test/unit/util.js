import Vue from 'vue'

import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import '@/element-variables.scss'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
import '@/stylus/main.styl'

import store from '@/store'
import router from '@/router'

Vue.use(ElementUI, { locale })
Vue.use(Vuetify, {
  theme: {
    primary: colors.teal.lighten2,
    secondary: colors.teal.lighten3,
    accent: colors.teal.base,
    error: colors.red.darken2,
    warning: colors.yellow.darken2,
    info: colors.blue.darken2,
    success: colors.green.darken2
  }
})
Vue.component('icon', Icon)

let id = 0

const createElm = () => {
  const elm = document.createElement('div')

  elm.id = 'app' + ++id
  document.body.appendChild(elm)

  return elm
}

/**
 * Destroy the vm
 * @param  {Object} vm
 */
exports.destroyVM = (vm) => {
  vm.$destroy && vm.$destroy()
  vm.$el &&
  vm.$el.parentNode &&
  vm.$el.parentNode.removeChild(vm.$el)
}

/**
 * Create a Vue component
 * @param  {Object|String} Compo    Component (template is allowed)
 * @param  {Boolean=false} mounted  Mount to DOM?
 * @return {Object} vm
 */
exports.createVue = (Compo, mounted = false) => {
  if (Object.prototype.toString.call(Compo) === '[object String]') {
    Compo = { template: Compo }
    // Support vuex & router
    Compo.store = store
    Compo.router = router
  }
  return new Vue(Compo).$mount(mounted === false ? null : createElm())
}

/**
 * Create a Vue test
 * @link http://vuejs.org/guide/unit-testing.html#Writing-Testable-Components
 * @param  {Object}  Compo          Component
 * @param  {Object}  propsData      Props
 * @param  {Boolean=false} mounted  Mount to DOM?
 * @return {Object} vm
 */
exports.createTest = (Compo, propsData = {}, mounted = false) => {
  if (propsData === true || propsData === false) {
    mounted = propsData
    propsData = {}
  }
  const elm = createElm()
  // Support vuex & router
  Compo.store = store
  Compo.router = router
  const Ctor = Vue.extend(Compo)
  return new Ctor({ propsData }).$mount(mounted === false ? null : elm)
}

/**
 * Trigger an event: mouseenter, mouseleave, mouseover, keyup, change, click, ...
 * @param  {Element} elm
 * @param  {String} name
 * @param  {*} opts
 */
exports.triggerEvent = (elm, name, ...opts) => {
  let eventName

  if (/^mouse|click/.test(name)) {
    eventName = 'MouseEvents'
  } else if (/^key/.test(name)) {
    eventName = 'KeyboardEvent'
  } else {
    eventName = 'HTMLEvents'
  }
  const evt = document.createEvent(eventName)

  evt.initEvent(name, ...opts)
  elm.dispatchEvent
    ? elm.dispatchEvent(evt)
    : elm.fireEvent('on' + name, evt)

  return elm
}

/**
 * Trigger a mouse click (mouseover + mousedown + mouseup + click)
 * @param {Element} elm
 * @param {*} opts
 */
exports.triggerClick = (elm, ...opts) => {
  exports.triggerEvent(elm, 'mouseover', ...opts)
  exports.triggerEvent(elm, 'mousedown', ...opts)
  exports.triggerEvent(elm, 'mouseup', ...opts)
  exports.triggerEvent(elm, 'click', ...opts)

  return elm
}
