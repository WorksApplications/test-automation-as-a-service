<template>
  <v-card-text>
    <ul
      v-if="reminders.length > 0"
      style="list-style-type: none;">
      <li
        v-for="reminder in reminders"
        :key="`${reminder.severity}|${reminder.description}|${reminder.platform}`">
        <v-chip
          :color="severityLevels[reminder.severity].color"
          text-color="white"
          small>
          <i :class="['fa', platformMap(reminder.platform).icon]" />
          &nbsp;
          {{ severityLevels[reminder.severity].body }}
        </v-chip>
        {{ reminder.description }}
      </li>
    </ul>
    <div v-else>
      No reminders.  The test case is all good!
    </div>
  </v-card-text>
</template>

<script>
import { mapState } from 'vuex'
import platformsUtil from '@/utils/platforms.js'

export default {

  name: 'RemindersList',
  components: {},

  props: {
    dashboardResult: {
      type: Object,
      default: () => ({})
    },
    testResults: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    severityLevels: {
      0: {
        body: 'Low',
        color: 'yellow darken-3'
      },
      1: {
        body: 'Medium',
        color: 'orange darken-3'
      },
      2: {
        body: 'High',
        color: 'purple darken-4'
      },
      3: {
        body: 'Critical',
        color: 'red darken-4'
      }
    }
  }),
  computed: {
    ...mapState('sysinfo', [
      'serverDate'
    ]),
    reminders () {
      const metrics = this.metrics

      const reminders = []
      Object.keys(metrics).forEach(browser => {
        // If it has ever been executed
        if (metrics[browser].totalCount === 0) {
          return
        }
        // If it has never been passed
        if (metrics[browser].passedCount === 0) {
          reminders.push({
            severity: SEVERITY.CRITICAL + this.adjustSeverityLevel(browser),
            platform: browser,
            description: `This test case is never passed.`
          })
        }
        // Fails much recently
        if (metrics[browser].passedCount > 0 && metrics[browser].recentFailures >= 3) {
          reminders.push({
            severity: Math.floor((metrics[browser].recentFailures - 3) / 2) + this.adjustSeverityLevel(browser),
            platform: browser,
            description: `This test case fails ${metrics[browser].recentFailures} times in the recent 10.`
          })
        }
        // Becoming slower...
        if (metrics[browser].passedCount > 3) {
          const sdPassingTime = Math.sqrt(
            metrics[browser].sumSquarePassingTime / metrics[browser].passedCount -
            Math.pow(metrics[browser].sumPassingTime / metrics[browser].passedCount, 2)
          )
          const meanPassingTime = metrics[browser].sumPassingTime / metrics[browser].passedCount
          const recentPassingTime = metrics[browser].recentSumPassingTime / 3
          if ((recentPassingTime - meanPassingTime) / sdPassingTime > 0.3) {
            reminders.push({
              severity: Math.min(3, Math.round((recentPassingTime - meanPassingTime) / sdPassingTime / 0.3 - 1)) + this.adjustSeverityLevel(browser),
              platform: browser,
              description: `This test case is becoming slower:  The average running time is ${Math.round(recentPassingTime)}s recently, and it was ${Math.round(meanPassingTime)}s.`
            })
          }
        }
        // Too long, didn't pass
        if (metrics[browser].passedCount > 0 && new Date(this.serverDate).getTime() - metrics[browser].lastPassed > 7 * 86400 * 1000) {
          const daysSinceLastPassed = Math.floor((new Date(this.serverDate).getTime() - metrics[browser].lastPassed) / (86400 * 1000))
          reminders.push({
            severity: Math.min(Math.floor(daysSinceLastPassed / 7 - 1), 3) + this.adjustSeverityLevel(browser),
            platform: browser,
            description: `This test case is not being passed in the ${daysSinceLastPassed} days.`
          })
        }
      })
      return reminders.filter(remainder => remainder.severity >= 0).sort((reminderOne, reminderTwo) => reminderTwo.severity - reminderOne.severity)
    },
    metrics () {
      const metrics = {}
      platformsUtil.platforms.forEach(platformObject => {
        const platform = platformObject.value
        if (platformsUtil.getType(platform) !== this.dashboardResult.type) { return }
        const testResults = this.testResults.filter(testResult => testResult.platform === platform)
        const testResultsPassed = testResults.filter(testResult => testResult.status === 'PASSED')
        const testResultsRecent = testResults.filter((testResult, ind) => ind >= testResults.length - 10)
        const testResultsRecentPassed = testResultsPassed.filter((testResult, ind) => ind >= testResultsPassed.length - 3)
        metrics[platform] = {
          totalCount: testResults.length,
          passedCount: testResultsPassed.length,
          recentFailures: testResultsRecent.filter(testResult => testResult.status !== 'PASSED').length,
          sumPassingTime: testResultsPassed.reduce((acc, testResult) => this.passingTime(testResult) + acc, 0),
          recentSumPassingTime: testResultsRecentPassed.reduce((acc, testResult) => this.passingTime(testResult) + acc, 0),
          sumSquarePassingTime: testResultsPassed.reduce((acc, testResult) => Math.pow(this.passingTime(testResult), 2) + acc, 0),
          lastRun: testResults.length > 0 ? new Date(testResults[testResults.length - 1].start) : undefined,
          lastPassed: testResultsPassed.length > 0 ? new Date(testResultsPassed[testResultsPassed.length - 1].start) : undefined
        }
      })
      return metrics
    }
  },
  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    passingTime: testResult => (testResult.stop - testResult.start) / 1000,
    platformMap: platform => platformsUtil.platforms.find(platformObject => platformObject.value === platform),
    duration: second => {
      let secondRounded = Math.round(second)
      const outputArray = []
      if (secondRounded >= 86400) {
        outputArray.push(`${Math.floor(secondRounded / 86400)}d`)
        secondRounded %= 86400
      }
      if (secondRounded >= 3600) {
        outputArray.push(`${Math.floor(secondRounded / 3600)}h`)
        secondRounded %= 3600
      }
      if (secondRounded >= 60) {
        outputArray.push(`${Math.floor(secondRounded / 60)}m`)
        secondRounded %= 60
      }
      outputArray.push(`${secondRounded}s`)
      return outputArray.join(' ')
    },
    adjustSeverityLevel: platform => {
      if (platform === 'chrome' || platform === 'api' || platform === 'iOS' || platform === 'Android') {
        return 0
      } else {
        return -2
      }
    }
  }

}
const SEVERITY = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  CRITICAL: 3
}

</script>
