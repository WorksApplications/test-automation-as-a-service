<template>
  <el-form
    ref="task"
    :model="value"
    :rules="rules"
    class="the-task-submit-form"
    label-position="top">
    <el-form-item
      label="Name"
      prop="name">
      <el-input
        v-model="value.name"
        @change="formChanged"/>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item
          label="Assignee"
          prop="assignee">
          <el-select
            v-model="value.assignee"
            placeholder="Select the assignee"
            filterable
            @visible-change="loadUsers"
            @change="formChanged">
            <el-option
              v-for="user in users"
              :key="user.username"
              :label="user.username"
              :value="user.username">
              <user-avatar
                :username="user.username"
                size="24px"
                style="margin: 2px" />
              {{ user.username }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          label="Type"
          prop="type">
          <el-select
            v-model="value.type"
            placeholder="Select the type"
            @change="formChanged">
            <el-option
              v-for="t in taskType"
              :key="t"
              :label="taskType[t]"
              :value="t"/>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          v-if="value.state"
          label="State">
          <el-select
            v-model="value.state"
            placeholder="select a state"
            @change="formChanged">
            <el-option
              v-for="state in states"
              :key="state.value"
              :label="state.label"
              :value="state.value"/>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item
      label="Description"
      prop="description">
      <el-input
        v-model="value.description"
        :rows="value.type === 'Auto' ? 2: 10"
        type="textarea"
        @change="formChanged" />
    </el-form-item>

    <div v-if="value.type === 'Auto'">
      <el-form-item
        label="Platform"
        prop="platform">
        <radio-platform
          v-model="value.platform"
          :platforms="selectPlatforms"
          @change="formChanged"/>
      </el-form-item>

      <el-form-item
        label="Testcases"
        prop="testcases">
        <drawer
          ref="drawerSelectTestcases"
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
              v-if="isDrawerOpened"
              :items="testcasesWithType"
              :items-selected="value.testcases"
              empty-text="No testcase of this platform is selected. Please selected in test plan."
              @updateCheckChildren="updateCheckTestcases" />
          </el-card>
        </drawer>
        <tag-group-selected :items-selected="value.testcases" />
      </el-form-item>

      <el-form-item
        v-if="isMobilePlatform"
        key="appUrl"
        label="App URL"
        prop="appUrl">
        <el-autocomplete
          v-model="value.appUrl"
          :fetch-suggestions="queryAppUrl"
          placeholder="Please input app url"
          style="width: 100%"
          @input="feildInput('appUrl')">
          <button-app-upload
            ref="apk"
            slot="append"
            @input="value.appUrl = arguments[0]" />
        </el-autocomplete>
      </el-form-item>

      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item
            label="Environment"
            prop="environment">
            <el-input
              v-model="value.environment.url"
              :disabled="value.environment.inherit"
              @change="formChanged"/>
            <el-tag
              v-if="value.environment.inherit"
              size="mini"
              type="info">Inherit from Test Plan</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="Username"
            prop="username">
            <el-input
              v-model="value.environment.username"
              :disabled="!value.environment.url || value.environment.inherit"
              @change="formChanged"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="Password"
            prop="password">
            <el-input
              v-model="value.environment.password"
              :disabled="!value.environment.url || value.environment.inherit"
              @change="formChanged"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item
        label="Slack Channel"
        prop="channel">
        <input-slack-channel
          :channel-id.sync="value.channel.id"
          :channel.sync="value.channel.name"
          :disabled="value.channel.inherit"
          @update:channelId="feildInput('channel')" />
        <br>
        <el-tag
          v-if="value.channel.inherit"
          size="mini"
          type="info">Inherit from Test Plan</el-tag>
      </el-form-item>

      <parameters-customized
        :params.sync="value.params"
        @update:params="formChanged" />
    </div>

    <el-form-item
      v-if="!isNew"
      label="Attachments"
      prop="attachments">
      <area-attachment-upload
        ref="taskAttachmentUpload"
        :test-plan-serial="testPlan.serial"
        :task-serial="value.serial"
        @input="formChanged"/>
    </el-form-item>

    <template v-if="showEditVerdict">
      <el-form-item
        label="Verdict Result"
        prop="verdict.result">
        <el-input
          v-model="value.verdict.result"
          type="text"
          @change="formChanged" />
      </el-form-item>
      <el-form-item
        label="Verdict Reason"
        prop="verdict.reason">
        <el-input
          :rows="2"
          v-model="value.verdict.reason"
          type="textarea"
          @change="formChanged" />
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
import { intersectionWith, cloneDeep } from 'lodash'
import SelectCascade from '@/components/forms/SelectCascade.vue'
import TagGroupSelected from '@/components/forms/TagGroupSelected.vue'
import InputSlackChannel from '@/components/InputSlackChannel.vue'
import RadioPlatform from '@/components/forms/RadioPlatform.vue'
import Drawer from '@/components/Drawer.vue'
import ButtonAppUpload from '@/components/forms/ButtonAppUpload.vue'
import ParametersCustomized from '@/components/testjob/TheParametersCustomized.vue'
import AreaAttachmentUpload from '@/components/forms/AreaAttachmentUpload.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import utilSelectCascade from '@/utils/selectCascade.js'
import utilPlatforms from '@/utils/platforms.js'
import utilTestcase from '@/utils/testcase.js'
import { EventBus } from '@/utils/eventBus.js'
import { states } from '@/utils/states'
import uploadapi from '@/api/upload.js'
import userapi from '@/api/user.js'
import testplanapi from '@/api/testplan.js'

export default {
  components: {
    SelectCascade,
    TagGroupSelected,
    InputSlackChannel,
    RadioPlatform,
    Drawer,
    ButtonAppUpload,
    ParametersCustomized,
    AreaAttachmentUpload,
    UserAvatar
  },

  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    testPlan: {
      type: Object,
      default: () => ({})
    },
    testcasesCascade: {
      type: Array,
      default: () => []
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
        platform: [{ required: true, message: 'Please select Platform' }],
        testcases: [{ required: true, message: 'Please select Testcases' }],
        appUrl: [
          { required: true, message: 'The app URL cannot be empty' },
          { type: 'url', message: 'The app URL is invalid' },
          { validator: appUrlValidator }
        ],
        environment: [{ required: true, message: 'Please input Environment' }],
        channel: [{ required: true, message: 'Please input Channel' }]
      },
      selectPlatforms: [],
      selectedTestcases: [],
      testcasesWithType: [],
      oldPlatform: '',
      taskType: {
        auto: 'Auto',
        manual: 'Manual'
      },
      users: []
    }
  },

  computed: {
    identity () {
      return {
        testPlanSerial: this.value.testPlanId,
        taskSerial: this.value.serial
      }
    },
    testcasesHeader () {
      return utilTestcase.testcasesHeader
    },
    isMobilePlatform () {
      return utilPlatforms.isMobilePlatform(this.value.platform)
    },
    showEditVerdict () {
      return this.value.state === this.states['finished'].value
    },
    isNew () {
      return this.$route.query.op === 'add_task'
    }
  },

  watch: {
    identity: {
      deep: true,
      handler: function (newValue) {
        this.getSelectedPlatformsAndTestcases()
      }
    },
    value: {
      deep: true,
      handler: function (newValue, oldValue) {
        if (oldValue.serial === newValue.serial &&
            oldValue.testPlanId === newValue.testPlanId) {
          this.$emit('update:value', newValue)
          if (this.oldPlatform !== newValue.platform) {
            this.oldPlatform = newValue.platform
            this.value.testcases = []
            this.testcasesWithType = cloneDeep(this.selectedTestcases)
            utilTestcase.filterByType(
              this.testcasesWithType,
              utilPlatforms.getType(newValue.platform)
            )
          }
        }
      }
    },
    testPlan: {
      deep: true,
      handler: function (newValue) {
        this.getSelectedPlatformsAndTestcases()
      }
    },
    testcasesCascade: {
      deep: true,
      handler: function () {
        this.getSelectedTestcases()
      }
    }
  },

  mounted () {
    const _this = this
    EventBus.$on('task-edit-saved', () => {
      if (_this.$refs['taskAttachmentUpload'] && _this.$refs['taskAttachmentUpload'].attachmentList.length > 0) {
        recordAttachmentActivity(_this.testPlan.serial, _this.value.serial, _this.value.name, _this.$refs['taskAttachmentUpload'].attachmentList, true)
        _this.$refs['taskAttachmentUpload'].attachmentList = []
      }
      return true
    })
    EventBus.$on('task-edit-canceled', () => {
      const _this = this
      if (_this.$refs['taskAttachmentUpload']) {
        _this.$refs['taskAttachmentUpload'].attachmentList.forEach(attachment => {
          uploadapi.removeAttachment(attachment.name, _this.testPlan.serial, _this.value.serial)
        })
        _this.$refs['taskAttachmentUpload'].attachmentList = []
      }
    })
  },

  destroyed () {
    EventBus.$off('task-edit-saved')
    EventBus.$off('task-edit-canceled')
  },

  methods: {
    async loadUsers (visible) {
      if (visible && this.users.length === 0) {
        let res = await getUsers()
        if (res) {
          this.users = res.users
        }
      }
    },
    drawerChanged (opened) {
      this.isDrawerOpened = opened
    },
    updateCheckTestcases (itemPath, checked) {
      this.value.testcases = utilSelectCascade.updateCheckChildren(
        this.testcasesWithType,
        this.value.testcases,
        itemPath,
        checked
      )
      this.formChanged()
    },
    getSelectedTestcases () {
      if (this.testcasesCascade.length > 0) {
        this.selectedTestcases = utilSelectCascade.arrayOfPathToObjects(
          this.testPlan.testcases,
          this.testcasesCascade
        )
        this.testcasesWithType = cloneDeep(this.selectedTestcases)
        utilTestcase.filterByType(
          this.testcasesWithType,
          utilPlatforms.getType(this.value.platform)
        )
      }
    },
    getSelectedPlatformsAndTestcases () {
      this.selectPlatforms = intersectionWith(
        utilPlatforms.platforms,
        utilSelectCascade.arrayOfPathToLeaves(this.testPlan.platforms, utilPlatforms.platformsCascade),
        (firstVal, secondVal) => {
          if (firstVal.value === secondVal.value) return true
        }
      )
      this.getSelectedTestcases()
      if (this.testPlan.branch !== '') {
        this.value.branch = this.testPlan.branch
      }
      if (this.testPlan.environment.inherit && this.testPlan.environment.url !== '') {
        this.value.environment = this.testPlan.environment
      }
      if (this.testPlan.channel.inherit && this.testPlan.channel.id !== '') {
        this.value.channel = this.testPlan.channel
      }
      this.oldPlatform = this.value.platform
    },
    queryAppUrl (queryString, cb) {
      cb(this.$refs['apk'].apkList.map(e => ({ value: e.url })))
    },
    feildInput (feild) {
      this.$refs['task'].validateField(feild)
      this.formChanged()
    },
    formChanged () {
      this.$emit('change')
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

const isAppUrl = (url) => {
  try {
    return url.toLowerCase().endsWith('.apk') ||
             url.toLowerCase().endsWith('.ipa')
  } catch (e) {
    return false
  }
}

const appUrlValidator = (rule, value, callback) => {
  if (value && !isAppUrl(value)) {
    callback(new Error('You should specify a valid app URL'))
  } else {
    callback()
  }
}

const getUsers = (limit) =>
  userapi.getUsers({ limit: limit })
const recordAttachmentActivity = (testPlanSerial, taskSerial, taskName, attachments, isUpload) =>
  testplanapi.recordAttachmentActivity(testPlanSerial, taskSerial, taskName, attachments, isUpload)
</script>

<style lang="scss" scoped>
.the-task-submit-form {
  min-width: 600px;
}

.edit-form__btn-select {
  margin: 3px;
}
</style>
