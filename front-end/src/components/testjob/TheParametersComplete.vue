<template>
  <div>
    <h3>Parameters</h3>
    <el-form
      label-position="left"
      label-width="120px">
      <el-form-item
        v-if="params.url"
        label="URL"
        prop="url">
        <a :href="params.url">{{ params.url }}</a>
        ({{ params.username }} / {{ params.password }})
      </el-form-item>
      <el-form-item
        v-if="params.appUrl"
        label="App URL"
        prop="url">
        <a :href="params.appUrl">{{ params.appUrl }}</a>
      </el-form-item>
      <el-form-item label="Slack Channel">
        <span v-if="!isChannelSet">Not Set</span>
        <a
          v-if="isChannelSet"
          :href="slackChannelUrl"
          target="_blank">{{ params.channel }}</a>
        <a
          v-if="isChannelSet"
          :href="slackChannelAppUrl">(open in app)</a>
      </el-form-item>
      <el-form-item label="Testcases">
        <select-testcase
          v-model="params"
          :branch="params.branch"
          :disabled="true"
          :display-selected-only="true" />
      </el-form-item>
    </el-form>
    <el-form
      v-if="params.params && params.params.length > 0"
      label-position="left"
      label-width="120px">
      <h3>Customized Parameters</h3>
      <parameters-customized
        :editable="false"
        :params="params.params" />
    </el-form>

  </div>
</template>

<script>
import SelectTestcase from '@/components/forms/SelectTestcase.vue'
import Preset from '@/models/Preset.js'
import ParametersCustomized from '@/components/testjob/TheParametersCustomized.vue'

const here = {
  props: {
    params: {
      type: Object,
      default: () => new Preset()
    }
  },
  data: () => ({
    dialogVisible: false
  }),
  computed: {
    slackChannelUrl () {
      return this.$store.state.sysinfo.slackChannelPrefix + this.params.channelId
    },
    slackChannelAppUrl () {
      return this.$store.state.sysinfo.slackChannelAppPrefix + this.params.channelId
    },
    isChannelSet () {
      return this.params.channelId && this.params.channelId !== ''
    }
  },
  components: {
    SelectTestcase, ParametersCustomized
  }
}

here.defaultForm = Preset

export default here
</script>
