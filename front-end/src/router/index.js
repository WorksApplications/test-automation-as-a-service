import Vue from 'vue'
import VueRouter from 'vue-router'

import Dashboard from '@/views/Dashboard.vue'
import TestJobList from '@/views/TestJobList.vue'
import TestJobDetails from '@/views/TestJobDetails.vue'
import TestJobForm from '@/views/TestJobForm.vue'
import Schedules from '@/views/ScheduleList.vue'
import Schedule from '@/views/Schedule.vue'
import ScheduleForm from '@/views/ScheduleForm.vue'
import TestPlanList from '@/views/TestPlanList.vue'
import TestPlanDetails from '@/views/TestPlanDetails.vue'
import TestPlanSubmitForm from '@/views/TestPlanSubmitForm.vue'
import TestPlanEditView from '@/views/TestPlanEditView.vue'
import TestCaseDetails from '@/views/TestCaseDetails.vue'
import LiveList from '@/views/LiveList.vue'
import UserInfo from '@/views/UserInfo.vue'
import UserSettings from '@/views/UserSettings.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  }, {
    name: 'Dashboard',
    path: '/dashboard',
    component: Dashboard
  }, {
    name: 'TestJobList',
    path: '/testjobs/list/:page(\\d+)',
    component: TestJobList,
    props: (route) => ({
      page: parseInt(route.params.page)
    })
  }, {
    name: 'TestJobDetails',
    path: '/testjobs/details/:serial(\\d+)',
    component: TestJobDetails,
    props: (route) => ({
      serial: parseInt(route.params.serial)
    })
  }, {
    name: 'TestJobAdd',
    path: '/testjobs/add',
    component: TestJobForm,
    meta: { requireLogin: true }
  }, {
    name: 'ScheduleList',
    path: '/schedules',
    component: Schedules
  }, {
    name: 'ScheduleAdd',
    path: '/schedules/add',
    component: ScheduleForm,
    meta: { requireLogin: true }
  }, {
    name: 'ScheduleDetails',
    path: '/schedules/:serial(\\d+)',
    component: Schedule,
    props: (route) => ({
      serial: parseInt(route.params.serial)
    })
  }, {
    name: 'ScheduleEdit',
    path: '/schedules/edit/:id(\\d+)',
    component: ScheduleForm
  }, {
    name: 'TestCaseDetails',
    path: '/testcases/:branch/:locator',
    component: TestCaseDetails,
    props: (route) => ({
      branch: route.params.branch,
      locator: route.params.locator
    })
  }, {
    name: 'TestPlanList',
    path: '/testplans',
    component: TestPlanList
  }, {
    name: 'TestPlanDetails',
    path: '/testplans/:id(\\d+)',
    component: TestPlanDetails,
    props: (route) => ({
      testPlanSerial: route.params.id
    })
  }, {
    name: 'TestPlanAdd',
    path: '/testplans/add',
    component: TestPlanSubmitForm,
    meta: { requireLogin: true }
  }, {
    name: 'TestPlanEdit',
    path: '/testplans/edit/:id(\\d+)',
    component: TestPlanEditView,
    props: (route) => ({
      testPlanSerial: route.params.id
    }),
    meta: { requireLogin: true }
  }, {
    name: 'LiveList',
    path: '/live',
    component: LiveList
  }, {
    name: 'User',
    path: '/user',
    component: UserInfo
  }, {
    name: 'Settings',
    path: '/settings',
    component: UserSettings
  }
]

Vue.use(VueRouter)

export default new VueRouter({
  routes
})
