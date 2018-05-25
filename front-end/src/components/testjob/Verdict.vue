<template>
  <v-tooltip
    v-if="!showDetails"
    bottom>
    <v-icon
      slot="activator"
      :color="color"
      small>
      {{ icon }}
    </v-icon>
    <span>{{ verdict.description }}</span>
  </v-tooltip>
  <div v-else>
    <v-icon
      :color="color"
      small>
      {{ icon }}
    </v-icon>
    {{ verdict.description }}
  </div>
</template>

<script>
import utilsTestJob from '@/utils/testJob.js'

export default {
  props: {
    value: {
      type: String,
      default: undefined
    },
    result: {
      type: Object,
      default: () => ({})
    },
    resolve: {
      type: Object,
      default: () => ({})
    },
    showDetails: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    verdict () {
      return utilsTestJob.getVerdict(this.value, this.result, this.resolve)
    },
    color () {
      if (this.verdict.status === 'failed') {
        if (this.result.passed >= this.result.total * 0.8) {
          return 'yellow darken-1'
        } else if (this.result.passed >= this.result.total * 0.6) {
          return 'amber lighten-1'
        } else if (this.result.passed >= this.result.total * 0.4) {
          return 'orange accent-2'
        } else if (this.result.passed >= this.result.total * 0.2) {
          return 'deep-orange lighten-1'
        } else {
          return 'red lighten-1'
        }
      }
      const colorMap = {
        passed: 'success',
        resolved: 'successSecondary',
        pending: 'orange darken-1',
        canceled: 'warning',
        running: 'info',
        error: 'error'
      }
      return colorMap[this.verdict.status]
    },
    icon () {
      const iconMap = {
        passed: 'check_circle',
        resolved: 'check_circle',
        failed: 'error',
        pending: 'pause_circle_filled',
        canceled: 'cancel',
        running: 'timelapse',
        error: 'error'
      }
      return iconMap[this.verdict.status]
    }
  }
}
</script>
