<template>
  <div>
    <div v-if="testcasesToShow.length > 0">
      <h3 class="preview-header">Dashboard</h3>
      <dashboard-table
        ref="testPlanDashboard"
        :branch="branch"
        :key="serial"
        :testcases-to-show="testcasesToShow"
        :platforms-to-show="platformsToShow"
        :test-plan-id="serial"
        :show-popover="false" />
    </div>

    <h3
      v-if="countAttachment > 0"
      class="preview-header">
      Attachments
    </h3>
    <area-attachment-upload
      ref="testPlanAttachmentView"
      :test-plan-serial="serial"
      :allow-upload="false"
      class="area-attachment-no-upload"
      @changed="handleChanged"/>

    <div
      v-if="verdict && verdict.result && state === states['finished'].value"
      class="verdict-block">
      <h3>Verdict</h3>
      <p>
        <strong>Result:</strong>
        {{ verdict.result }}
      </p>
      <p>
        <strong>Reason:</strong>
        <span style="white-space: pre-line">
          {{ verdict.reason }}
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import DashboardTable from '@/components/dashboard/TheTestcasesTable.vue'
import AreaAttachmentUpload from '@/components/forms/AreaAttachmentUpload.vue'
import { EventBus } from '@/utils/eventBus'
import utilSelectCascade from '@/utils/selectCascade'
import utilPlatforms from '@/utils/platforms'
import utilTestcase from '@/utils/testcase'
import { states } from '@/utils/states'

export default {
  components: {
    DashboardTable,
    AreaAttachmentUpload
  },

  props: {
    serial: {
      type: Number,
      default: undefined
    },
    branch: {
      type: String,
      default: 'develop'
    },
    testcases: {
      type: Array,
      default: () => []
    },
    platforms: {
      type: Array,
      default: () => []
    },
    testcasesCascade: {
      type: Array,
      default: () => []
    },
    verdict: {
      type: Object,
      default: () => ({})
    },
    state: {
      type: String,
      default: 'new'
    }
  },

  data: () => ({
    countAttachment: 0,
    states
  }),

  computed: {
    testcasesToShow () {
      if (this.testcasesCascade.length === 0) return []
      let testcasesTestPlan = cloneDeep(utilSelectCascade.arrayOfPathToObjects(
        this.testcases,
        this.testcasesCascade
      ))
      return utilTestcase.pathsToLocators(
        this.testcases,
        'all',
        testcasesTestPlan
      )
    },
    platformsToShow () {
      return utilSelectCascade
        .arrayOfPathToLeaves(this.platforms, utilPlatforms.platformsCascade)
        .map(platform => platform.value)
    }
  },

  mounted () {
    const _this = this
    _this.$nextTick(() => {
      EventBus.$on('testjob-update', () => {
        if (_this.$refs.testPlanDashboard) {
          _this.$refs.testPlanDashboard.updateDashboard()
        }
        return true
      })
      EventBus.$on('test-plan-edit-saved', () => {
        if (_this.$refs['testPlanAttachmentView']) {
          _this.$refs['testPlanAttachmentView'].refresh()
        }
        return true
      })
    })
  },

  destroyed () {
    EventBus.$off('testjob-update')
    EventBus.$off('test-plan-edit-saved')
  },

  methods: {
    handleChanged: function () {
      this.countAttachment = this.$refs['testPlanAttachmentView'].attachmentList.length
    }
  }
}
</script>

<style lang="scss" scoped>
.area-attachment-no-upload {
  position: relative;
  top: -30px;
}
.verdict-block {
  border-top: 1px solid #eef0f2;
}
</style>
