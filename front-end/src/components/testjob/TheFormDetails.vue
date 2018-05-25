<template>
  <div>
    <h1 v-show="!isSubForm && isNewForm">Run a Test Job</h1>
    <h1 v-show="!isSubForm && isEditForm">Edit and Run a Test Job</h1>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="110px">

      <!-- choose from configuration-->
      <el-form-item label="From Preset">
        <preset-list
          :form="form"
          @update:form="setForm" />
      </el-form-item>

      <!-- parameter -->
      <el-form-item
        v-show="!isSubForm"
        label="Name"
        prop="name">
        <el-input
          v-model="form.name"
          :maxlength="100"
          placeholder="Test Job Name"/>
      </el-form-item>
      <el-form-item
        label="Version"
        prop="branch">
        <select-branch v-model="form.branch" />
      </el-form-item>
      <el-form-item label="Runs in">
        <radio-platform v-model="form.platform" />
      </el-form-item>
      <template>
        <el-form-item
          key="url"
          label="URL"
          prop="url">
          <el-input
            v-model="form.url"
            :maxlength="100"/>
        </el-form-item>
      </template>
      <template v-if="isMobilePlatform">
        <el-form-item
          key="appUrl"
          label="App URL"
          prop="appUrl">
          <el-autocomplete
            v-model="form.appUrl"
            :fetch-suggestions="queryAppUrl"
            placeholder="Please input app url"
            style="width: 100%"
            @input="$refs['form'].validateField('appUrl')">
            <button-app-upload
              ref="apk"
              slot="append"
              @input="form.appUrl = arguments[0]" />
          </el-autocomplete>
        </el-form-item>
      </template>
      <el-form-item label="Username">
        <el-input
          v-model="form.username"
          :maxlength="200"/>
      </el-form-item>
      <el-form-item label="Password">
        <el-input
          v-model="form.password"
          :maxlength="200"/>
      </el-form-item>

      <parameters-customized :params.sync="form.params" />

      <el-form-item
        label="Slack Channel"
        prop="channelId">
        <input-slack-channel
          :channel-id.sync="form.channelId"
          :channel.sync="form.channel"
          @update:channelId="$refs['form'].validateField('channelId')" />
      </el-form-item>
      <el-form-item
        label="Testcases"
        prop="testcases">
        <select-testcase
          v-model="form"
          :branch="form.branch"
          :disabled="false"
          @syncTestcases="syncTestcases" />
      </el-form-item>
      <el-form-item v-show="!isSubForm">
        <button-testjob-run
          ref="buttonRun"
          :disabled="!isLoggedIn"
          :is-icon="false"
          @click.native="!isLoggedIn ? null : run()" />
        <button-preset-create
          v-show="!existPreset"
          ref="buttonCreate"
          :disabled="!isLoggedIn"
          @click.native="!isLoggedIn ? null : create()" />
        <button-preset-update
          v-show="existPreset"
          ref="buttonUpdate"
          :disabled="!isLoggedIn"
          @click.native="!isLoggedIn ? null : update()" />
        <button-back v-show="isEditForm" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import utilPlatforms from '@/utils/platforms.js'
import InputSlackChannel from '@/components/InputSlackChannel.vue'
import RadioPlatform from '@/components/forms/RadioPlatform.vue'
import SelectTestcase from '@/components/forms/SelectTestcase.vue'
import PresetList from '@/components/ThePresetList.vue'
import ButtonTestjobRun from '@/components/forms/ButtonTestjobRun.vue'
import ButtonPresetCreate from '@/components/forms/ButtonPresetCreate.vue'
import ButtonPresetUpdate from '@/components/forms/ButtonPresetUpdate.vue'
import ButtonBack from '@/components/forms/ButtonBack.vue'
import Preset from '@/models/Preset.js'
import ButtonAppUpload from '@/components/forms/ButtonAppUpload.vue'
import cloneDeep from 'lodash.clonedeep'
import ParametersCustomized from '@/components/testjob/TheParametersCustomized.vue'
import SelectBranch from '@/components/forms/SelectBranch.vue'

const VIEW_TYPE_NEW = 'new'
const VIEW_TYPE_EDIT = 'edit'

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

const testcasesValidator = (rule, value, callback) => {
  if (Array.isArray(value) && value.length > 0) {
    callback()
  } else {
    callback(new Error('At least one test case should be selected'))
  }
}

const here = {
  components: {
    SelectTestcase,
    PresetList,
    ButtonTestjobRun,
    ButtonPresetCreate,
    ButtonPresetUpdate,
    ButtonBack,
    RadioPlatform,
    ButtonAppUpload,
    InputSlackChannel,
    ParametersCustomized,
    SelectBranch
  },
  props: {
    isSubForm: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      validForm: true,
      form: new Preset(),
      viewType: VIEW_TYPE_NEW,
      rules: {
        name: [
          {
            required: !this.isSubForm,
            message: 'The name cannot be empty'
          }
        ],
        branch: [
          {
            required: true,
            message: 'The branch cannot be empty'
          }
        ],
        url: [
          {
            required: true,
            message: 'The URL cannot be empty'
          },
          {
            type: 'url',
            message: 'The URL is invalid',
            trigger: 'blur'
          }
        ],
        appUrl: [
          {
            required: true,
            message: 'The app URL cannot be empty'
          },
          {
            type: 'url',
            message: 'The app URL is invalid'
          },
          {
            validator: appUrlValidator
          }
        ],
        testcases: [
          {
            validator: testcasesValidator,
            message: 'The test case selection cannot be empty'
          }
        ]
      }
    }
  },
  mounted () {
    const _this = this

    const route = _this.$route
    if (route.params.form !== undefined) {
      _this.viewType = VIEW_TYPE_EDIT
      _this.form = JSON.parse(route.params.form)
    }
  },
  updated () {},
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    existPreset () {
      const form = this.form
      return this.$store.getters['preset/exist'](form)
    },
    isMobilePlatform () {
      return utilPlatforms.isMobilePlatform(this.form.platform)
    },
    testjob () {
      let res = cloneDeep(this.form)

      if (!this.isMobilePlatform) {
        delete res['appUrl']
      }
      return res
    },
    isNewForm () {
      return this.viewType === VIEW_TYPE_NEW
    },
    isEditForm () {
      return this.viewType === VIEW_TYPE_EDIT
    }
  },
  watch: {
    'form.testcases': function () {
      this.validateForm(() => {})
    }
  },
  methods: {
    run () {
      const buttonRun = this.$refs.buttonRun
      const form = this.testjob

      this.validateForm(() => {
        buttonRun.run(form)
      })
    },
    update () {
      const buttonUpdate = this.$refs.buttonUpdate
      const form = this.testjob

      this.validateForm(() => {
        buttonUpdate.updateOne(form)
      })
    },
    create () {
      const buttonCreate = this.$refs.buttonCreate
      const form = this.testjob

      this.validateForm(() => {
        buttonCreate.createOne(form)
      })
    },

    validateForm (thenDo) {
      this.$refs.form.validate((valid) => {
        if (valid && typeof thenDo === 'function') {
          thenDo()
        }
      })
    },
    setForm (preset) {
      this.form = new Preset(preset)
    },
    queryAppUrl (queryString, cb) {
      cb(this.$refs['apk'].apkList.map(e => ({ value: e.url })))
    },
    syncTestcases (testcases) {
      this.form.testcases = testcases
    }
  }
}

export default here
</script>
