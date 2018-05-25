<template>
  <v-stepper
    :value="currentStep"
    alt-labels
    class="elevation-0">
    <v-stepper-header>
      <v-stepper-step
        :complete="currentStep > 1"
        step="1">
        Created
        <small v-if="currentStep > 1 && time.create">
          {{ dateDisplay(serverDate, time.create) }}
        </small>
        <small v-else>
          Waiting...
        </small>
      </v-stepper-step>
      <v-divider />
      <v-stepper-step
        v-if="currentStep <= 2 || (currentStep > 2 && time.start)"
        :complete="currentStep > 2"
        step="2">
        Started
        <small v-if="currentStep > 2 && time.start">
          {{ dateDisplay(serverDate, time.start) }}
        </small>
        <small v-else>
          Waiting...
        </small>
      </v-stepper-step>
      <v-divider />
      <v-stepper-step
        :complete="currentStep > 3 && statusThirdStep"
        :rules="[() => statusThirdStep]"
        step="3">
        {{ textThirdStep }}
        <small v-if="currentStep > 3 && time.finish">
          {{ dateDisplay(serverDate, time.finish) }}
        </small>
        <small v-else>
          Waiting...
        </small>
      </v-stepper-step>
    </v-stepper-header>
  </v-stepper>
</template>

<script>
import { mapState } from 'vuex'
import utilsTime from '@/utils/time.js'

export default {
  name: 'TestJobDetailsProgress',
  components: {},

  props: {
    verdict: {
      type: Object,
      default: () => ({})
    },
    time: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    // Constants
    currentStepMapping: {
      pending: 2,
      running: 3,
      passed: 4,
      resolved: 4,
      failed: 4,
      canceled: 4,
      error: 4
    }
  }),
  computed: {
    ...mapState('sysinfo', [
      'serverDate'
    ]),
    currentStep () {
      return this.currentStepMapping[this.verdict.status] || 1
    },
    textThirdStep () {
      if (this.verdict.status === 'failed' || this.verdict.status === 'error') {
        return 'Failed'
      } else if (this.verdict.status === 'canceled') {
        return 'Canceled'
      } else if (this.verdict.status === 'passed') {
        return 'Passed'
      } else if (this.verdict.status === 'resolved') {
        return 'Resolved'
      } else {
        return 'Finished'
      }
    },
    statusThirdStep () {
      return this.verdict.status === 'pending' ||
        this.verdict.status === 'running' ||
        this.verdict.status === 'passed' ||
        this.verdict.status === 'resolved'
    }
  },

  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    dateDisplay: utilsTime.dateDisplay
  }
}
</script>
