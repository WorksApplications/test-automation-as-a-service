<template>
  <div>
    <v-layout
      row
      wrap>
      <v-flex xs8>
        <v-breadcrumbs>
          <v-icon slot="divider">chevron_right</v-icon>
          <v-breadcrumbs-item disabled>
            TaaS
          </v-breadcrumbs-item>
          <v-breadcrumbs-item
            :to="{ name: 'TestJobList', params: { page: 1 } }"
            exact>
            Test Jobs
          </v-breadcrumbs-item>
          <v-breadcrumbs-item>
            #{{ serial }}
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-flex>
      <v-flex
        xs4
        class="text-xs-right">
        <button-testjob-cancel
          v-if="!testJob.finish && testJob.status !== 'CANCELED'"
          :testjob="testJob" />
        <switch-testjob-resolve
          v-show="paramsRerunFailed !== undefined"
          :testjob="testJob" />
        <button-testjob-run
          v-if="paramsRerunAll !== undefined"
          :testjob="paramsRerunAll"
          :disabled="!isLoggedIn"
          tooltip="Rerun test job"
          tooltip-disabled="Please login to rerun test job"
          need-edit />
        <button-testjob-run
          v-if="paramsRerunFailed !== undefined"
          :testjob="paramsRerunFailed"
          :disabled="!isLoggedIn"
          tooltip="Rerun test job with failed cases"
          tooltip-disabled="Please login to rerun test job with failed cases"
          need-edit />
        <button-share-page :params="urlParams" />
      </v-flex>
      <v-flex
        xs12
        px-2>
        <v-card v-if="testJob.params">
          <v-card-title primary-title>
            <h3>
              Test job #{{ serial }}:
              <radio-platform
                v-model="testJob.params.platform"
                :show-label="false"
                disabled
                show-icon />
              <span v-html="parseTestJobName(testJob.params.name)" />
            </h3>
          </v-card-title>
          <v-tabs v-model="activeTab">
            <v-tab @click="setTab('summary')">
              Summary
            </v-tab>
            <v-tab @click="setTab('testcases')">
              Test cases
            </v-tab>
            <v-tab
              v-if="logs.length > 0"
              @click="setTab('log')">
              Log
            </v-tab>
            <v-tab
              v-if="testJob.status === 'Running'"
              @click="setTab('live')">
              Live
            </v-tab>
            <v-tab
              v-if="(testJob.videoAvailable || testJob.params.platform === 'api') && testJob.status !== 'Running' && testJob.status !== 'Pending'"
              @click="setTab('replay')">
              Replay
            </v-tab>
            <v-tab-item>
              <v-card>
                <v-card-text>
                  <details-progress
                    :verdict="verdict"
                    :time="testJobTimes" />
                  <details-result-bar
                    :test-job-result="testJob.result"
                    :verdict="verdict"
                    :report="testJob.report" />
                  <v-layout
                    row
                    wrap>
                    <v-flex
                      xs6
                      px-2>
                      <v-layout
                        row
                        wrap>
                        <v-flex
                          xs2
                          pa-2>
                          Operator
                        </v-flex>
                        <v-flex
                          xs10
                          pa-2>
                          <user-avatar
                            :username="testJob.operator"
                            size="24px" />
                          {{ testJob.operator }}
                          <span v-if="testJob.scheduleSerial">
                            <em>Scheduled</em>
                            <v-tooltip bottom>
                              <v-icon
                                slot="activator"
                                small>
                                schedule
                              </v-icon>
                              <span>Scheduled task</span>
                            </v-tooltip>
                          </span>
                        </v-flex>
                        <v-flex
                          xs2
                          pa-2>
                          Branch
                        </v-flex>
                        <v-flex
                          xs10
                          pa-2>
                          {{ testJob.params.branch }}
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex
                      xs6
                      px-2>
                      <v-layout
                        row
                        wrap>
                        <v-flex
                          xs2
                          pa-2>
                          URL
                        </v-flex>
                        <v-flex
                          xs10
                          pa-2>
                          {{ testJob.params.url }} ({{ testJob.params.username }} / {{ testJob.params.password }})
                        </v-flex>
                        <v-flex
                          xs2
                          pa-2>
                          Slack channel
                        </v-flex>
                        <v-flex
                          xs10
                          pa-2>
                          {{ testJob.params.channel }} ({{ testJob.params.channelId }})
                        </v-flex>
                        <v-flex
                          xs2
                          pa-2>
                          Test cases
                        </v-flex>
                        <v-flex
                          xs10
                          pa-2>
                          <select-testcase
                            v-model="testJob.params"
                            :branch="testJob.params.branch"
                            disabled />
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex
                      v-if="verdict.status === 'resolved'"
                      xs12
                      px-2>
                      <v-layout
                        row
                        wrap>
                        <v-flex xs12>
                          <h3>Resolve Status</h3>
                        </v-flex>
                        <v-flex
                          xs1
                          pa-2>
                          Reason
                        </v-flex>
                        <v-flex
                          xs11
                          pa-2>
                          {{ testJob.resolve.reason }}
                        </v-flex>
                        <v-flex
                          v-if="testJob.resolve.comment"
                          xs1
                          pa-2>
                          Comments
                        </v-flex>
                        <v-flex
                          v-if="testJob.resolve.comment"
                          xs11
                          pa-2>
                          {{ testJob.resolve.comment }}
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card-text>
                <dashboard-table
                  :branch="testJob.params.branch"
                  :key="Number.parseInt(testJob.serial) + testJob.status"
                  :testcases-to-show="testJob.params.testcases"
                  :platforms-to-show="[ testJob.params.platform ]"
                  :job-id="Number.parseInt(testJob.serial)"
                  :show-popover="false" />
              </v-card-text>
            </v-tab-item>
            <v-tab-item v-if="logs.length > 0">
              <tab-log :logs="logs" />
            </v-tab-item>
            <v-tab-item v-if="testJob.status === 'Running'">
              <tab-live
                v-if="testJob.params.platform === 'api' || (testJob.vncHost && testJob.vncPort)"
                :vnc-host="testJob.vncHost"
                :vnc-port="testJob.vncPort"
                :vnc-password="testJob.vncPassword"
                :platform="testJob.params.platform"
                :url="testJob.params.url"
                :video-available="testJob.videoAvailable"
                :steps="steps"
                :exec-stack="execStack"
                :branch="testJob.params.branch" />
            </v-tab-item>
            <v-tab-item v-if="(testJob.videoAvailable || testJob.params.platform === 'api') && testJob.status !== 'Running' && testJob.status !== 'Pending'">
              <tab-replay
                :serial="serial"
                :platform="testJob.params.platform"
                :url="testJob.params.url"
                :video-available="testJob.videoAvailable"
                :steps="steps"
                :exec-stack="execStack"
                :branch="testJob.params.branch" />
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import router from '@/router'
import utilsTestJob from '@/utils/testJob.js'
import TestJobsAPI from '@/api/testjobs.js'
import TabLog from '@/components/testjob/TheTabLog.vue'
import TabLive from '@/components/testjob/TheTabLive.vue'
import TabReplay from '@/components/testjob/TheTabReplay.vue'
import DetailsProgress from '@/components/testjob/DetailsProgress.vue'
import DetailsResultBar from '@/components/testjob/DetailsResultBar.vue'
import DashboardTable from '@/components/dashboard/TheTestcasesTable.vue'
import ButtonSharePage from '@/components/forms/ButtonSharePage.vue'
import ButtonTestjobCancel from '@/components/forms/ButtonTestjobCancel.vue'
import ButtonTestjobRun from '@/components/forms/ButtonTestjobRun.vue'
import RadioPlatform from '@/components/forms/RadioPlatform.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import SelectTestcase from '@/components/forms/SelectTestcase.vue'
import SwitchTestjobResolve from '@/components/forms/SwitchTestjobResolve.vue'

export default {
  name: 'TestJobDetails',
  components: {
    TabLog,
    TabLive,
    TabReplay,
    DetailsProgress,
    DetailsResultBar,
    DashboardTable,
    ButtonSharePage,
    ButtonTestjobCancel,
    ButtonTestjobRun,
    RadioPlatform,
    UserAvatar,
    SelectTestcase,
    SwitchTestjobResolve
  },

  props: {
    serial: {
      type: Number,
      required: true
    }
  },

  data: () => ({
    testJob: {},
    logs: [],
    steps: [],
    execStack: {
      execStack: [],
      codes: {},
      methods: {},
      exceptions: {}
    },
    pollingId: undefined,
    paramsRerunAll: undefined,
    paramsRerunFailed: undefined,
    activeTab: null
  }),
  computed: {
    ...mapState('socket', ['socket']),
    ...mapState('sysinfo', [
      'serverDate'
    ]),
    ...mapGetters('user', [
      'isLoggedIn'
    ]),
    urlParams () {
      return {}
    },
    verdict () {
      return utilsTestJob.getVerdict(this.testJob.status, this.testJob.result, this.testJob.resolve)
    },
    testJobTimes () {
      return utilsTestJob.getTimes(this.testJob.create, this.testJob.start, this.testJob.finish)
    },
    dataTestResults () {
      // for vue-echarts
      const result = this.testJob.result
      if (result === undefined) {
        return {}
      }
      const series = [{
        name: 'passed',
        value: result.passed,
        color: '#acd683bb'
      }, {
        name: 'failed',
        value: result.failed,
        color: '#fd7b65bb'
      }, {
        name: 'pending',
        value: result.pending,
        color: '#dc7ecbbb'
      }, {
        name: 'broken',
        value: result.broken,
        color: '#ffd973bb'
      }, {
        name: 'canceled',
        value: result.canceled,
        color: '#bbbbbbbb'
      }, {
        name: 'pending',
        value: result.total - result.passed - result.failed - result.canceled - result.broken,
        color: '#bbbbbbbb'
      }].map(item => ({
        name: item.name,
        type: 'bar',
        stack: 'Test Job',
        label: {
          show: item.value > 0,
          position: 'inside'
        },
        itemStyle: {
          color: item.color
        },
        data: [
          item.value
        ]
      }))
      // vue-echarts option object
      return {
        xAxis: {
          show: false,
          type: 'value',
          max: result.total
        },
        yAxis: {
          type: 'category',
          data: ['Test Job'],
          show: false
        },
        series,
        title: {
          show: false
        },
        legend: {
          show: false
        },
        tooltip: {
          trigger: 'item',
          formatter: '{c} {a}',
          position: 'bottom',
          textStyle: {
            fontSize: 12
          },
          backgroundColor: '#616161'
        },
        grid: {
          left: 0,
          right: -10,
          bottom: 0,
          top: 0,
          backgroundColor: 'red'
        },
        textStyle: {
          fontFamily: 'ubuntu'
        },
        animationEasing: 'cubicInOut',
        animationDuration: 1000
      }
    }
  },

  watch: {
    verdict (verdict) {
      if (verdict.status !== 'running' && verdict.status !== 'pending') {
        clearInterval(this.pollingId)
      }
    },
    testJob: async function (testJob) {
      this.paramsRerunAll = utilsTestJob.getRerunAllParams(testJob)
      this.paramsRerunFailed = await utilsTestJob.getRerunFailedParams(testJob)
    }
  },

  created () {},
  mounted () {
    const tab = router.currentRoute.hash.replace('#', '')
    const tabMapping = {
      summary: '0',
      testcases: '1',
      log: '2',
      live: '3',
      replay: '3'
    }
    if (typeof tabMapping[tab] === 'string') {
      this.activeTab = tabMapping[tab]
    }
    const _this = this
    this.fetchTestJob()
    this.socket.on('update_test_job', async args => {
      let updateKey = args[0]
      let serial = parseInt(args[1])
      let updateValue = args[2]
      if (serial === _this.serial) {
        switch (updateKey) {
          case 'progress':
            _this.testJob = await TestJobsAPI.getOne(serial)
            break
          case 'status':
            _this.testJob = await TestJobsAPI.getOne(serial)
            break
          case 'live_info':
            _this.testJob.vncHost = updateValue[0]
            _this.testJob.vncPort = updateValue[1].toString()
            _this.testJob.vncPassword = updateValue[2]
            break
          case 'log':
            _this.logs.push(updateValue[0])
            break
          case 'step':
            _this.steps.push(updateValue[0])
            break
          case 'step_result':
            for (let i = _this.steps.length - 1; i >= 0; i--) {
              let step = _this.steps[i]
              if (step.action === 'Testcase' && step.element.value === updateValue[0]) {
                step.inputValue = updateValue[1]
                break
              }
            }
            break
          case 'exec_stack':
            _this.execStack.execStack.push(updateValue[0])
            _this.execStack.codes = Object.assign(_this.execStack.codes, updateValue[1].codes)
            Object.keys(updateValue[1].methods).forEach(classPath => {
              if (!_this.execStack.methods[classPath]) {
                _this.execStack.methods[classPath] = {}
              }
              _this.execStack.methods[classPath] = Object.assign(
                _this.execStack.methods[classPath], updateValue[1].methods[classPath])
            })
            break
          case 'exec_stack_exception':
            _this.execStack.exceptions[updateValue[0]] = updateValue[1]
            _this.execStack.codes = Object.assign(_this.execStack.codes, updateValue[2].codes)
            Object.keys(updateValue[2].methods).forEach(classPath => {
              if (!_this.execStack.methods[classPath]) {
                _this.execStack.methods[classPath] = {}
              }
              _this.execStack.methods[classPath] = Object.assign(
                _this.execStack.methods[classPath], updateValue[2].methods[classPath])
            })
            break
          default:
            break
        }
      }
    })
  },
  updated () {},
  destroyed () {
    this.socket.off('update_test_job')
  },

  methods: {
    fetchTestJob: async function () {
      const testJob = await TestJobsAPI.getOne(this.serial)
      this.testJob = testJob
      const logsResponse = await TestJobsAPI.getLog(this.serial)
      if (logsResponse.success === true) {
        this.logs = logsResponse.log
      }
      const stepsResponse = await TestJobsAPI.getSteps(this.serial)
      if (stepsResponse.success) {
        this.steps = stepsResponse.steps
      }
      const execStackResult = await TestJobsAPI.getExecStack(this.serial)
      if (execStackResult.success) {
        this.execStack = execStackResult.execStack
      }
    },
    parseTestJobName: (testJobName) => {
      testJobName = testJobName.replace(/</g, '&lt;')
      testJobName = testJobName.replace(/>/g, '&gt;')
      testJobName = testJobName.replace(/#S(\d+)/g, '<a href="#/schedules/$1" class="title-hashtags">#S$1</a>')
      testJobName = testJobName.replace(/#T(\d+)/g, '<a href="#/testjobs/details/$1" class="title-hashtags">#T$1</a>')
      testJobName = testJobName.replace(/Task #(\d+) of Test Plan #(\d+)/g, '<a href="#/testplans/$2?op=view_task&id=$1" class="a__title-hashtags">Task #$1</a> of Test Plan #$2')
      testJobName = testJobName.replace(/Test Plan #(\d+)/g, '<a href="#/testplans/$1" class="title-hashtags">Test Plan #$1</a>')
      return testJobName
    },
    setTab: (tabView) => {
      window.location.hash = `#${router.currentRoute.path}#${tabView}`
    }
  }
}
</script>

<style lang="scss">
  .info-tab {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
  }
  .info-child {
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;
    align-self: auto;
    width: 50%;
    min-width: 250px;
  }
  .dashboard-container {
    width: 100%;
  }
  .live-box-view {
    position: absolute;
    right: 20px;
    bottom: 10px;
    z-index: 10;
  }
  .fix-window {
    width: 1024px;
    height: 576px;
  }
  .float-window {
    position: absolute;
    box-shadow: 5px 5px 5px #888888;
    right: 28px;
    top: 5px;
    z-index: 10;
    width: 480px;
  }
  .drag-bar {
    height: 20px;
    background: linear-gradient(to top, rgb(76, 180, 170), rgb(94, 221, 208));
    border: solid 1px #47b1a6;
    border-radius: 6px 6px 0px 0px;
    cursor: move;
  }
  .view-box {
    position: inherit;
  }
</style>
