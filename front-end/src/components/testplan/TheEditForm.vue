<template>
  <el-form
    ref="testPlan"
    :model="value"
    :rules="rules"
    class="the-test-plan-submit-form"
    label-position="top">
    <el-form-item
      label="Name"
      prop="name">
      <el-input v-model="value.name"/>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item
          v-if="value.state"
          label="State">
          <el-select
            v-model="value.state"
            placeholder="select a state">
            <el-option
              v-for="state in states"
              :key="state.value"
              :label="state.label"
              :value="state.value"/>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="value.state ? 16: 24">
        <el-form-item
          prop="startEndDate"
          label="Start / End Date">
          <el-date-picker
            v-model="startEndDate"
            type="daterange"
            class="start-end-date-selector"
            placeholder="Select Start End Date"
            range-separator="  ~  "/>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item
      label="Objective"
      prop="objective">
      <el-input
        v-model="value.objective"
        :rows="2"
        type="textarea"/>
    </el-form-item>

    <el-form-item
      label="Description (markdown supported)"
      prop="description">
      <el-input
        v-model="value.description"
        :rows="descRows"
        type="textarea"/>
    </el-form-item>

    <el-form-item
      v-if="false"
      label="Branch"
      prop="branch">
      <el-input v-model="value.branch"/>
    </el-form-item>

    <el-form-item
      label="Platforms"
      prop="platforms">
      <el-popover
        ref="popoverPlatforms"
        :visible-arrow="false"
        placement="bottom-start"
        width="600"
        trigger="click">
        <select-cascade
          :items="platformsCascade"
          :items-selected="value.platforms"
          @updateCheckChildren="updateCheckPlatforms" />
      </el-popover>
      <el-button
        v-popover:popoverPlatforms
        class="edit-form__btn-select"
        size="small"
        title="Select Platforms">
        <i
          class="fa fa-cogs"
          aria-hidden="true"/>
      </el-button>
      <tag-group-selected :items-selected="value.platforms" />
    </el-form-item>

    <el-form-item
      label="Testcases"
      prop="testcases">
      <drawer
        ref="drawer"
        style="display: inline-block"
        width="80%"
        @changed="drawerChanged">
        <el-button
          slot="handle"
          class="edit-form__btn-select"
          size="small"
          title="Select Testcases">
          <i
            class="fa fa-cogs"
            aria-hidden="true"/>
        </el-button>
        <el-card slot="main">
          <select-cascade
            :items="testcasesHeader"
            :header="true" />
          <select-cascade
            :items="testcasesCascade"
            :items-selected="value.testcases"
            @updateCheckChildren="updateCheckTestcases" />
        </el-card>
      </drawer>
      <tag-group-selected :items-selected="value.testcases" />
    </el-form-item>

    <el-row :gutter="5">
      <el-col :span="12">
        <el-form-item
          label="Environment"
          prop="environment">
          <el-input v-model="value.environment.url"/>
          <el-checkbox
            v-model="value.environment.inherit"
            :disabled="value.environment.url === ''">
            Inherited by Tasks
          </el-checkbox>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item
          label="Username"
          prop="username">
          <el-input
            v-model="value.environment.username"
            :disabled="!value.environment.url"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item
          label="Password"
          prop="password">
          <el-input
            v-model="value.environment.password"
            :disabled="!value.environment.url"/>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item
      label="Slack Channel"
      prop="channelId">
      <input-slack-channel
        :channel-id.sync="value.channel.id"
        :channel.sync="value.channel.name"
        @update:channelId="$refs['testPlan'].validateField('channelId')" />
      <br>
      <el-checkbox
        v-model="value.channel.inherit"
        :disabled="value.channel.id === ''">
        Inherited by Tasks
      </el-checkbox>
    </el-form-item>

    <el-form-item
      v-if="!isNew"
      label="Attachments"
      prop="attachments">
      <area-attachment-upload
        ref="testPlanAttachmentUpload"
        :test-plan-serial="value.serial"/>
    </el-form-item>

    <template v-if="showEditVerdict">
      <el-form-item
        label="Verdict Result"
        prop="verdict.result">
        <el-input
          v-model="value.verdict.result"
          type="text"/>
      </el-form-item>
      <el-form-item
        label="Verdict Reason"
        prop="verdict.reason">
        <el-input
          v-model="value.verdict.reason"
          :rows="2"
          type="textarea"/>
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
import InputSlackChannel from '@/components/InputSlackChannel.vue'
import SelectCascade from '@/components/forms/SelectCascade.vue'
import Drawer from '@/components/Drawer.vue'
import TagGroupSelected from '@/components/forms/TagGroupSelected.vue'
import AreaAttachmentUpload from '@/components/forms/AreaAttachmentUpload.vue'
import { states } from '@/utils/states'
import utilSelectCascade from '@/utils/selectCascade.js'
import utilTestcase from '@/utils/testcase'
import { platformsCascade } from '@/utils/platforms.js'
import { EventBus } from '@/utils/eventBus.js'
import testcasesapi from '@/api/testcases'
import uploadapi from '@/api/upload.js'
import testplanapi from '@/api/testplan.js'

export default {
  components: {
    SelectCascade,
    TagGroupSelected,
    InputSlackChannel,
    Drawer,
    AreaAttachmentUpload
  },

  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      isDrawerOpened: false,
      states,
      rules: {
        name: [
          { required: true, message: 'Name is required' },
          { validator: nameLengthValidator }
        ],
        startEndDate: [{ validator: this.endDateShouldBeLaterThanToday }],
        objective: [
          { required: true, message: 'Please input Objective' },
          { validator: objectiveLengthValidator }
        ],
        environment: [{ validator: this.UserAndPwdShouldSyncWithUrl }]
      },
      testcasesCascade: []
    }
  },

  computed: {
    descRows () {
      const _this = this
      let rows = 8
      if (_this.value.description) {
        let matches = _this.value.description.match(/\n/g)
        if (matches !== null) {
          rows = Math.max(matches.length, 8)
        }
      }
      return rows
    },
    startEndDate: {
      set (val) {
        const _this = this
        let start = val[0]
        let end = val[1]
        _this.value.start = start
        _this.value.end = end
      },
      get () {
        const _this = this
        return [_this.value.start, _this.value.end]
      }
    },
    platformsCascade () {
      return platformsCascade
    },
    testcasesHeader () {
      return utilTestcase.testcasesHeader
    },
    showEditVerdict () {
      return this.value.state === this.states['finished'].value
    },
    isNew () {
      return this.$route.name === 'TestPlanAdd'
    }
  },

  watch: {
    value: {
      deep: true,
      handler: function (value) {
        const _this = this
        if (value.environment.url === '') {
          _this.value.environment.username = ''
          _this.value.environment.password = ''
        }
        _this.$emit('update:value', value)
      }
    },
    'value.branch' () {
      this.updateTestcases()
    }
  },

  mounted () {
    const _this = this
    _this.updateTestcases()
    EventBus.$on('test-plan-edit-saved', () => {
      if (_this.$refs['testPlanAttachmentUpload'] && _this.$refs['testPlanAttachmentUpload'].attachmentList.length > 0) {
        recordAttachmentActivity(_this.value.serial, undefined, undefined, _this.$refs['testPlanAttachmentUpload'].attachmentList, true)
        _this.$refs['testPlanAttachmentUpload'].attachmentList = []
      }
      return true
    })
    EventBus.$on('test-plan-edit-canceled', () => {
      const _this = this
      if (_this.$refs['testPlanAttachmentUpload']) {
        _this.$refs['testPlanAttachmentUpload'].attachmentList.forEach(attachment => {
          uploadapi.removeAttachment(attachment.name, _this.value.serial)
        })
        _this.$refs['testPlanAttachmentUpload'].attachmentList = []
      }
    })
  },

  destroyed () {
    EventBus.$off('test-plan-edit-saved')
    EventBus.$off('test-plan-edit-canceled')
  },

  methods: {
    drawerChanged (opened) {
      this.isDrawerOpened = opened
    },
    updateTestcases () {
      const _this = this
      testcasesapi.fetchAll(_this.value.branch).then(res => {
        if (res.testcases) {
          _this.testcasesCascade = utilTestcase.testcasesToCascade(res.testcases, true).items
        }
      })
    },
    endDateShouldBeLaterThanToday (rule, value, callback) {
      const _this = this
      let end = new Date(_this.value.end)
      let today = new Date()
      if (!_this.value.start || !_this.value.end) {
        callback(new Error('Field is required'))
      } else if (_this.value.end && end < today) {
        callback(new Error('End date should be later than today'))
      } else {
        callback()
      }
    },
    UserAndPwdShouldSyncWithUrl (rule, value, callback) {
      if (
        this.value.environment.url !== '' &&
        (this.value.environment.username === '' ||
          this.value.environment.password === '')
      ) {
        callback(new Error('Please input Username and Password'))
      } else {
        callback()
      }
    },
    updateCheckPlatforms (itemPath, checked) {
      this.value.platforms = utilSelectCascade.updateCheckChildren(
        this.platformsCascade,
        this.value.platforms,
        itemPath,
        checked
      )
    },
    updateCheckTestcases (itemPath, checked) {
      this.value.testcases = utilSelectCascade.updateCheckChildren(
        this.testcasesCascade,
        this.value.testcases,
        itemPath,
        checked
      )
    }
  }
}

const nameLengthValidator = (rule, value, callback) => {
  if (value.length > 100) {
    callback(new Error('Name should not be too long'))
  }
  if (value.length < 10) {
    callback(new Error('Name should be longer than 10 characters'))
  } else {
    callback()
  }
}

const objectiveLengthValidator = (rule, value, callback) => {
  if (value.length > 200) {
    callback(new Error('Objective should not be too long'))
  }
  if (value.length < 10) {
    callback(new Error('Objective should be longer than 10 characters'))
  } else {
    callback()
  }
}

const recordAttachmentActivity = (testPlanSerial, taskSerial, taskName, attachments, isUpload) =>
  testplanapi.recordAttachmentActivity(testPlanSerial, taskSerial, taskName, attachments, isUpload)
</script>

<style lang="scss" scoped>
.start-end-date-selector {
  width: 100%;
}

.the-test-plan-submit-form {
  min-width: 600px;
}

.edit-form__btn-select {
  margin: 3px;
}
</style>
