<!--

Usage:
  <input-cron
    v-model="cron"
    :disabled="false"
  />

-->

<template>
  <span>

    <el-button
      type="text"
      @click="openDialog">
      {{ cronTime }} {{ displayedCronDays }}
    </el-button>

    <el-dialog
      :visible.sync="isDialogVisible"
      title="Schedule Picker"
      width="30%">
      <el-form
        label-position="left"
        label-width="120px">
        <el-form-item
          label="Scheduled Time"
          style="margin: 11px 0px">
          <el-time-select
            v-model="cronTime"
            :picker-options="{ start: '00:00', end: '23:45', step: '00:15' }"
            :disabled="disabled"
            placeholder="Select Time" />
        </el-form-item>
        <el-form-item
          label="Scheduled Days"
          style="margin: 11px 0px">
          <el-select
            v-model="cronDays"
            :disabled="disabled"
            placeholder="Select Days"
            multiple>
            <el-option
              v-for="item in daysInWeek"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>

  </span>
</template>

<script>

import { mapState } from 'vuex'
import moment from 'moment-timezone'

export default {

  name: 'CronSelection',
  components: {},

  props: {
    // General element styling properties
    disabled: {
      type: Boolean,
      default: false
    },

    // Model-related properties
    value: {
      type: String,
      required: true
    }
  },

  data: () => ({
    daysInWeek: [{
      value: 0,
      label: 'Sun'
    }, {
      value: 1,
      label: 'Mon'
    }, {
      value: 2,
      label: 'Tue'
    }, {
      value: 3,
      label: 'Wed'
    }, {
      value: 4,
      label: 'Thu'
    }, {
      value: 5,
      label: 'Fri'
    }, {
      value: 6,
      label: 'Sat'
    }],
    isDialogVisible: false
  }),
  computed: {
    ...mapState('sysinfo', {
      timezone: state => state.timezone
    }),
    cronTime: {
      get: function () {
        let cronArray = this.value.split(' ')
        let date = new Date()
        date.setHours(cronArray[2])
        date.setMinutes(cronArray[1])
        return moment.tz(date, this.timezone).format('HH:mm')
      },
      set: function (val) {
        let valArray = val.split(':')
        let cronArray = this.value.split(' ')
        cronArray[2] = parseInt(valArray[0])
        cronArray[1] = parseInt(valArray[1])
        let cronString = cronArray.join(' ')
        this.$emit('input', cronString)
      }
    },
    cronDays: {
      get: function () {
        let cronArray = this.value.split(' ')
        if (cronArray[5] === '*') {
          cronArray[5] = '0,1,2,3,4,5,6'
        }
        return cronArray[5].split(',').map(day => parseInt(day))
      },
      set: function (val) {
        if (val.length === 0) {
          return
        }
        let cronArray = this.value.split(' ')
        cronArray[5] = val.sort().join(',')
        let cronString = cronArray.join(' ')
        this.$emit('input', cronString)
      }
    },
    // Read only
    displayedCronDays: function () {
      let result = this.cronDays
        .map(dayNumberToString)
        .join(', ')
      if (result === 'Sun, Sat') {
        return 'every weekend'
      } else if (result === 'Mon, Tue, Wed, Thu, Fri') {
        return 'every weekday'
      } else if (result === 'Sun, Mon, Tue, Wed, Thu, Fri, Sat') {
        return 'everyday'
      } else if (result === '') {
        return undefined
      }
      return 'every ' + result
    }
  },
  watch: { },

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    openDialog () {
      this.isDialogVisible = true
    },
    closeDialog () {
      this.isDialogVisible = false
    }

  }

}

const dayNumberToString = (day) => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
}

</script>
