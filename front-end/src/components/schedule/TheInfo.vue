<template>
  <div class="info-tab">
    <div class="info-child">
      <h3>Basic</h3>
      <el-form
        label-position="left"
        label-width="120px">
        <el-form-item label="Schedule">
          <input-cron
            v-model="schedule.cron"
            :disabled="true" />
        </el-form-item>
        <el-form-item label="Next Run">
          <div v-if="schedule.enabled">
            In
            <field-time
              v-model="schedule.nextRun"
              format-type="fullCountdown" />
          </div>
          <em v-else>
            Not enabled
          </em>
        </el-form-item>
        <el-form-item label="Status">
          <switch-schedule-active
            v-model="schedule"
            :next-run.sync="schedule.nextRun"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="info-child">
      <parameters-complete :params="schedule.params" />
    </div>
  </div>
</template>

<script>

import TestjobFormDetails from '@/components/testjob/TheFormDetails.vue'
import SwitchScheduleActive from '@/components/forms/SwitchScheduleActive.vue'
import ParametersComplete from '@/components/testjob/TheParametersComplete.vue'
import InputCron from '@/components/forms/InputCron.vue'
import FieldTime from '@/components/FieldTime.vue'

export default {

  name: 'Info',
  components: {
    FieldTime,
    SwitchScheduleActive,
    ParametersComplete,
    InputCron
  },

  props: {
    schedule: {
      type: Object,
      default: () => ({
        serial: 0,
        count: 0,
        name: 'Schedule1',
        cron: '* * * * * * ?',
        enabled: false,
        lastRun: '',
        nextRun: '',
        params: TestjobFormDetails.defaultForm()
      })
    }
  },

  data: () => ({}),
  computed: {},
  watch: {},

  created () {},
  updated () {
    this.schedule.params.name = this.schedule.name + ' (Manual run from #S' + this.schedule.serial + ')'
  },
  destroyed () {},

  methods: {}

}

</script>
