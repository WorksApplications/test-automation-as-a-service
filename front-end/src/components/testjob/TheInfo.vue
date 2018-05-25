<template>
  <el-tabs
    v-model="tabView"
    @tab-click="ontabclick">
    <el-tab-pane
      label="Basic"
      name="basic">
      <div class="info-tab">
        <div class="info-child">
          <h3>Basic</h3>
          <el-form
            :model="testjob"
            label-position="left"
            label-width="120px">
            <el-form-item label="Operator">
              <el-button
                v-if="testjob.operator"
                type="text">
                {{ testjob.operator }}
              </el-button>
              <el-button
                v-else
                type="text"
                @click="gotoSchedule">
                {{ scheduleSerialShown }}
              </el-button>
            </el-form-item>
            <el-form-item label="Verdict">
              <verdict
                :value="testjob.status"
                :result="testjob.result"
                :link="testjob.report"
                :resolve="testjob.resolve" />
            </el-form-item>
            <el-form-item label="Version">
              {{ testjob.params.branch }}
            </el-form-item>
            <el-form-item label="Summary">
              <details-result-bar
                :test-job-result="testjob.result"
                :verdict="verdict" />
              <switch-testjob-resolve
                v-show="testjob.status !== 'Running' && testjob.paramsRerunFailed && testjob.paramsRerunFailed.testcases.length > 0"
                :testjob="testjob"
                size="small"
                style="padding-left: 240px;" />
            </el-form-item>
            <el-form-item label="History">
              <div>
                Created at
                <field-time
                  :value="testjob.create"
                  format-type="fullDateTime" />
              </div>
              <div v-if="testjob.start">
                Started at
                <field-time
                  :value="testjob.start"
                  :time-reference="testjob.create"
                  format-type="fullDateTimeWithDuration" />
              </div>
              <div v-if="testjob.start && testjob.finish">
                Finished at
                <field-time
                  :value="testjob.finish"
                  :time-reference="testjob.start"
                  format-type="fullDateTimeWithDuration" />
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="info-child">
          <parameters-complete :params="testjob.params" />
        </div>
        <div
          v-show="resolve !== undefined && resolve.resolved"
          class="info-child">
          <h3>Resolve Info</h3>
          <el-form
            :model="testjob"
            label-position="left"
            label-width="120px">
            <el-form-item label="Reason">
              {{ resolve.reason }}
            </el-form-item>
            <el-form-item
              v-show="resolve.comment !== ''"
              label="Comment">
              {{ resolve.comment }}
            </el-form-item>
          </el-form>
        </div>
        <div
          v-if="hasTestResultsToShow"
          class="dashboard-container">
          <h3>
            Dashboard
          </h3>
          <dashboard-table
            :branch="testjob.params.branch"
            :key="Number.parseInt(testjob.serial) + testjob.status"
            :testcases-to-show="testjob.params.testcases"
            :platforms-to-show="[testjob.params.platform]"
            :job-id="Number.parseInt(testjob.serial)"
            :show-popover="false" />
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane
      label="Log"
      name="log">
      <tab-log :log-array="logs" />
      <div
        v-if="testjob.videoAvailable && testjob.status === 'Running'"
        class="live-box-view">
        <live-window
          v-if="testjob.vncHost && testjob.vncPort"
          :id="'log-live-' + testjob.serial"
          :host="testjob.vncHost"
          :port="testjob.vncPort"
          :password="testjob.vncPassword"
          :node-type="nodeType"
          :ratio="testjob.params.platform === 'Android' ? 1.28 : 2.56" />
      </div>
    </el-tab-pane>
    <el-tab-pane
      v-if="testjob.status === 'Running'"
      id="live-replay"
      label="Live"
      name="live">
      <tab-live
        v-if="testjob.params.platform === 'api' || (testjob.vncHost && testjob.vncPort)"
        :vnc-host="testjob.vncHost"
        :vnc-port="testjob.vncPort"
        :vnc-password="testjob.vncPassword"
        :platform="testjob.params.platform"
        :url="testjob.params.url"
        :video-available="testjob.videoAvailable"
        :steps="steps"
        :exec-stack="execStack"
        :branch="testjob.params.branch" />
    </el-tab-pane>
    <el-tab-pane
      v-if="(testjob.videoAvailable || testjob.params.platform === 'api') && testjob.status !== 'Running' && testjob.status !== 'Pending'"
      id="live-replay"
      label="Replay"
      name="replay">
      <tab-replay
        :serial="testjob.serial"
        :platform="testjob.params.platform"
        :url="testjob.params.url"
        :video-available="testjob.videoAvailable"
        :steps="steps"
        :exec-stack="execStack"
        :branch="testjob.params.branch" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>

import Verdict from '@/components/testjob/Verdict.vue'
import ParametersComplete from '@/components/testjob/TheParametersComplete.vue'
import DetailsResultBar from '@/components/testjob/DetailsResultBar.vue'
import FieldTime from '@/components/FieldTime.vue'
import TabLog from '@/components/testjob/TheTabLog.vue'
import router from '@/router'
import Testjob from '@/models/Testjob.js'
import TabReplay from '@/components/testjob/TheTabReplay.vue'
import TabLive from '@/components/testjob/TheTabLive.vue'
import ButtonTestjobRun from '@/components/forms/ButtonTestjobRun.vue'
import DashboardTable from '@/components/dashboard/TheTestcasesTable.vue'
import SwitchTestjobResolve from '@/components/forms/SwitchTestjobResolve.vue'
import LiveWindow from '@/components/LiveWindow.vue'
import utilPlatform from '@/utils/platforms.js'

const gotoSchedule = (id) => router.push({
  path: `/schedules/${id}`
})

const setWindowHash = (tabView) => {
  window.location.hash = '#' + router.currentRoute.path +
          '#' + tabView
}

const here = {
  props: {
    testjob: {
      type: Object,
      default: () => new Testjob()
    },
    logs: {
      type: Array,
      default: () => []
    },
    steps: {
      type: Array,
      default: () => []
    },
    execStack: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    tabView: 'basic',
    resolve: {}
  }),

  computed: {
    nodeType () {
      return utilPlatform.platformToNodeType(this.testjob.params.platform)
    },
    scheduleSerialShown () {
      const testjob = this.testjob
      if (!testjob.scheduleSerial || testjob.scheduleSerial === '') {
        return 'anonymous user'
      } else {
        return `Schedule #${testjob.scheduleSerial}`
      }
    },
    testJobLiveUrl () {
      return (this.testjob.liveUrl && this.testjob.liveUrl !== '')
        ? this.testjob.liveUrl
        : '/live?port=6080'
    },
    hasTestResultsToShow () {
      return this.testjob.params.testcases && this.testjob.params.testcases.some(tc => tc.indexOf('#') > 0)
    },
    testjobResolve () {
      return this.testjob.resolve
    }
  },

  watch: {
    testjobResolve: function (newResolve) {
      if (newResolve !== undefined) {
        this.resolve = newResolve
      }
    }
  },

  methods: {
    gotoSchedule () {
      const id = this.testjob.scheduleSerial
      if (id) {
        gotoSchedule(id)
      }
    },
    ontabclick () {
      setWindowHash(this.tabView)
    }
  },

  components: {
    Verdict,
    TabLog,
    ParametersComplete,
    FieldTime,
    DetailsResultBar,
    TabLive,
    TabReplay,
    DashboardTable,
    ButtonTestjobRun,
    SwitchTestjobResolve,
    LiveWindow
  },

  mounted () {
    const reg = /#([^#]*)$/
    const tags = ['basic', 'log', 'live', 'replay']
    let tabView = router.currentRoute.fullPath.match(reg)

    if (tabView) {
      tabView = tabView[1]

      if (tags.some(e => e === tabView)) {
        this.tabView = tabView
      } else {
        this.tabView = 'basic'
      }
    } else {
      this.tabView = 'basic'
    }
  }
}

export default here
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
