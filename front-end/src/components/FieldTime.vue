<!--

Usage:

1. Full Date (2018-01-05 14:37:04)

  <field-time
    v-model="time"
    formatType="fullDateTime" />

2. Countdown (in 5h 30m 26s)
   Description: The time required to reach "time"

  <field-time
    v-model="time"
    formatType="countdown" />

3. Full Date with Duration (2018-01-05 14:37:04 (5 minutes))
   Parameters:
   - time
   - timeReference (if this is undefined, current time will be used)
   # timeReference can be earlier or later than time, it would take the absolute difference.

  <field-time
    v-model="time"
    timeReference="timeReference"
    formatType="fullDateTimeWithDuration" />

-->

<template>
  <span>
    {{ displayString }}
  </span>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment-timezone'

export default {

  name: 'FieldTime',
  components: {},

  props: {
    value: {
      type: String,
      default: undefined
    },
    timeReference: {
      type: String,
      default: undefined
    },
    formatType: {
      type: String,
      default: undefined
    }
  },

  data: () => ({
    currentTime: new Date()
  }),
  computed: {
    ...mapState('sysinfo', {
      timezone: state => state.timezone,
      serverNow: state => state.serverDate
    }),
    displayString: function () {
      switch (this.formatType) {
        default:
          return undefined
        case 'fullDate':
          return `${this.stringDateFull}`
        case 'fullDateTime':
          return `${this.stringDateFull} ${this.stringTimeHMS}`
        case 'fullDateTimeWithDuration':
          return `${this.stringDateFull} ${this.stringTimeHMS} (${this.stringDurationShort})`
        case 'fullCountdown':
          return `${this.stringCountdownFull}`
        case 'shortCountdown':
          return `${this.stringCountdownShort}`
        case 'shortDuration':
          return `${this.stringDurationShort}`
      }
    },

    // Date
    stringDateFull: function () {
      let result = moment.tz(this.value, this.timezone).format('YYYY-MM-DD')
      let today = moment.tz(this.timezone).format('YYYY-MM-DD')
      if (result === today) {
        return 'today'
      } else {
        return result
      }
    },

    // Time
    stringTimeHMS: function () {
      return moment.tz(this.value, this.timezone).format('HH:mm:ss')
    },
    stringTimeHM: function () {
      return moment.tz(this.value, this.timezone).format('HH:mm')
    },

    // Duration
    stringDurationShort: function () {
      let timeReference = this.timeReference
      if (timeReference === undefined) {
        timeReference = this.currentTime
      }
      let timestampValue = this.toTimestamp(this.value)
      let timestampReference = this.toTimestamp(timeReference)

      let result = Math.floor(Math.abs(timestampReference - timestampValue) / 1000)
      let durationSeconds = result % 60
      let durationMinutes = Math.floor(result / 60 % 60)
      let durationHours = Math.floor(result / 3600 % 24)
      let durationDays = Math.floor(result / 86400)

      if (durationDays) {
        return `${durationDays} days`
      } else if (durationHours) {
        return `${durationHours} hours`
      } else if (durationMinutes) {
        return `${durationMinutes} minutes`
      } else {
        return `${durationSeconds} seconds`
      }
    },

    // Countdown
    stringCountdownFull: function () {
      let timeReference = this.timeReference
      if (timeReference === undefined) {
        timeReference = this.currentTime
      }
      let timestampValue = this.toTimestamp(this.value)
      let timestampReference = this.toTimestamp(timeReference)

      let result = Math.floor((timestampValue - timestampReference) / 1000)
      let durationSeconds = result % 60
      let durationMinutes = Math.floor(result / 60 % 60)
      let durationHours = Math.floor(result / 3600 % 24)
      let durationDays = Math.floor(result / 86400)

      if (durationDays) {
        return `${durationDays}d ${durationHours}h ${durationMinutes}m ${durationSeconds}s`
      } else if (durationHours) {
        return `${durationHours}h ${durationMinutes}m ${durationSeconds}s`
      } else if (durationMinutes) {
        return `${durationMinutes}m ${durationSeconds}s`
      } else {
        return `${durationSeconds}s`
      }
    },

    stringCountdownShort: function () {
      let result = Math.floor((this.toTimestamp(this.value) - this.toTimestamp(this.currentTime)) / 1000)
      let durationSeconds = result % 60
      let durationMinutes = Math.floor(result / 60 % 60)
      let durationHours = Math.floor(result / 3600 % 24)
      let durationDays = Math.floor(result / 86400)

      if (durationDays) {
        return `${durationDays} days`
      } else if (durationHours) {
        return `${durationHours} hours`
      } else if (durationMinutes) {
        return `${durationMinutes} minutes`
      } else {
        return `${durationSeconds} seconds`
      }
    }

  },
  watch: {},

  created () {
    if (this.formatType.indexOf('Countdown') > -1) {
      let _this = this
      periodicFunctions.push(function () {
        _this.currentTime = new Date()
      })
    }
  },
  mounted () {},
  updated () {},
  destroyed () {
    if (this.formatType === 'countdown') {
      periodicFunctions.filter((fn) => false)
    }
  },

  methods: {
    toTimestamp: function (timeObject) {
      return moment.tz(timeObject, this.timezone)
    }
  }
}

const periodicFunctions = []
setInterval(() => periodicFunctions.forEach((fn) => fn()), 1000)

</script>
