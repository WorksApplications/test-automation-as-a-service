<template>
  <div class="the-task-details">
    <div class="heading">
      <h2
        :class="{'diff-field': isFieldUpdated('name')}">
        Task : {{ value.name }}
      </h2>
      <div class="state-tag">
        <the-state
          :state="value.state"
          :class="{'diff-field': isFieldUpdated('state')}" />
      </div>
      <div
        v-if="value.creator"
        class="create-info">
        {{ value.creator }} created at
        <field-time
          :value="getStartTime(value._id)"
          format-type="fullDateTime" />
      </div>
    </div>

    <div v-if="value.description">
      <h3 class="detail-header">Description</h3>
      <vue-markdown
        :class="{'diff-field': isFieldUpdated('description')}"
        :html="false"
        :source="value.description"
        :anchor-attributes="{target: '_blank'}"
        class="preview-block"
        table-class="markdown-table"/>
    </div>

    <div v-if="value.type === 'Auto'">
      <h3 class="detail-header">Execution History</h3>
      <test-job-list
        :testjobs="testjobs"
        :count="count"
        :current-page="currentPage"
        :page-size="pageSize"
        @paginatedTo="paginatedTo"/>

      <h3 class="detail-header">Dashboard</h3>
      <dashboard-table
        ref="taskDashboard"
        :branch="value.branch"
        :key="testPlan.serial + value.serial"
        :testcases-to-show="testcasesToShow"
        :platforms-to-show="[value.platform]"
        :test-plan-id="testPlan.serial"
        :task-id="value.serial"
        :show-popover="false" />
    </div>

    <h3
      v-if="countAttachment > 0"
      class="detail-header">
      Attachments
    </h3>
    <area-attachment-upload
      ref="taskAttachmentView"
      :test-plan-serial="testPlan.serial"
      :task-serial="value.serial"
      :task-name="value.name"
      :allow-upload="false"
      class="area-attachment-no-upload"
      @changed="handleChanged"/>

  </div>
</template>

<script>
import { cloneDeep, isEqual } from 'lodash'
import { mapState } from 'vuex'
import { getDateTimeFromObjectId } from '../../utils/date'
import VueMarkdown from 'vue-markdown'
import TheState from '../testplan/TheState.vue'
import FieldTime from '@/components/FieldTime.vue'
import TagGroupSelected from '@/components/forms/TagGroupSelected.vue'
import RadioPlatform from '@/components/forms/RadioPlatform.vue'
import ParametersCustomized from '@/components/testjob/TheParametersCustomized.vue'
import TestJobList from '@/components/testjob/TheList.vue'
import DashboardTable from '@/components/dashboard/TheTestcasesTable.vue'
import AreaAttachmentUpload from '@/components/forms/AreaAttachmentUpload.vue'
import TestPlan from '@/models/TestPlan'
import Task from '@/models/Task'
import testjobsapi from '@/api/testjobs'
import utilTestcase from '@/utils/testcase'
import utilSelectCascade from '@/utils/selectCascade'
import { EventBus } from '@/utils/eventBus'
import UtilsPushMessages from '@/utils/pushMessages.js'

export default {

  components: {
    VueMarkdown,
    TheState,
    FieldTime,
    TagGroupSelected,
    RadioPlatform,
    ParametersCustomized,
    TestJobList,
    DashboardTable,
    AreaAttachmentUpload
  },

  props: {
    value: {
      type: Object,
      default: () => new Task()
    },
    testPlan: {
      type: Object,
      default: () => new TestPlan()
    },
    testcasesCascade: {
      type: Array,
      default: () => []
    },
    diff: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    responseJson: {},
    testjobs: [],
    count: 0,
    currentPage: 1,
    pageSize: 5,
    changeByPaginated: false,
    changeByTask: false,
    countAttachment: 0
  }),

  computed: {
    ...mapState('socket', ['socket']),
    testcasesToShow () {
      if (this.testcasesCascade.length === 0) return []
      let testcasesTestPlan = cloneDeep(utilSelectCascade.arrayOfPathToObjects(
        this.testPlan.testcases,
        this.testcasesCascade
      ))
      return utilTestcase.pathsToLocators(
        this.value.testcases,
        this.value.platform,
        testcasesTestPlan
      )
    }
  },

  watch: {
    'value.serial': async function (newValue) {
      if (newValue) {
        this.changeByTask = true
        this.responseJson = await fetchTestjobs(this.testPlan.serial, newValue, this.currentPage, this.pageSize)
      }
    },
    testjobs: function (newValue, oldValue) {
      if (!isEqual(newValue, oldValue)) {
        if (!this.changeByPaginated && !this.changeByTask) {
          if (this.$refs.taskDashboard) {
            this.$refs.taskDashboard.updateDashboard()
          }
          EventBus.$emit('testjob-update')
        } else {
          this.changeByPaginated = false
          this.changeByTask = false
        }
      }
    },
    responseJson (responseJson) {
      if (responseJson.success === true) {
        this.count = responseJson.count
        this.testjobs = responseJson.testjobs
      } else {
        UtilsPushMessages.error(responseJson.info)
      }
    }
  },

  created () {},

  mounted () {
    const _this = this
    EventBus.$on('testjob-update', async () => {
      _this.currentPage = 1
      _this.responseJson = await fetchTestjobs(_this.testPlan.serial, _this.value.serial, _this.currentPage, _this.pageSize)
      return true
    })
    EventBus.$on('task-edit-saved', () => {
      if (_this.$refs['taskAttachmentView']) {
        _this.$refs['taskAttachmentView'].refresh()
      }
      return true
    })
    _this.updateTestJobList()
    this.socket.on('update_test_job', args => {
      let updateKey = args[0]
      let serial = parseInt(args[1])
      let updateValue = args[2]
      let inList = _this.testjobs.map(testjob => testjob.serial).includes(serial)
      if ((updateKey === 'progress' && inList) ||
        (updateKey === 'status' && (updateValue[0] === 'Running' || inList))) {
        _this.updateTestJobList()
      }
    })
  },

  destroyed () {
    EventBus.$off('testjob-update')
    EventBus.$off('task-edit-saved')
    this.socket.off('update_test_job')
  },

  methods: {
    getStartTime: function (objectId) {
      return getDateTimeFromObjectId(objectId).toISOString()
    },
    isFieldUpdated: function (fieldName) {
      let diff = this.diff
      if (diff) {
        return diff.some(diffItem => diffItem.key === fieldName)
      } else {
        return false
      }
    },
    paginatedTo: async function (page) {
      this.currentPage = page
      this.changeByPaginated = true
      this.responseJson = await fetchTestjobs(this.testPlan.serial, this.value.serial, page, this.pageSize)
    },
    updateTestJobList: async function () {
      this.responseJson = await fetchTestjobs(this.testPlan.serial, this.value.serial, this.currentPage, this.pageSize)
    },
    handleChanged: function () {
      this.countAttachment = this.$refs['taskAttachmentView'].attachmentList.length
    }
  }
}

const fetchTestjobs = (testPlan, task, page, pageSize) =>
  testjobsapi.getList({ testPlan: testPlan, task: task, skip: pageSize * (page - 1), limit: pageSize })

</script>

<style lang="scss" scoped>
.the-task-details {
  min-width: 600px;

  .diff-field {
    border: 1px solid red !important;
  }
  .heading {
    padding-bottom: 10px;
    border-bottom: 1px solid #eef0f2;
    margin-bottom: 5px;
  }

  .create-info {
    position: relative;
    top: -12px;
    right: 20px;

    font-size: 12px;
    display: flex;
    justify-content: flex-end;
    float: right;

    & > span {
      margin-left: 4px;
    }
  }
  .state-tag {
    position: relative;
    top: -18px;
    right: 5px;

    display: flex;
    justify-content: flex-end;
    float: right;
  }
  .preview-block {
    overflow: hidden;
    padding: 20px;
    background-color: #f6f8fa;
  }
  .detail-header {
    padding: 18px 0 8px 0;
  }
  .area-attachment-no-upload {
    position: relative;
    top: -30px;
  }
}
</style>
