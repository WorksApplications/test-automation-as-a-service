<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="elevation-0">
      <template
        slot="items"
        slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td
          v-for="browser in Object.keys(metrics)"
          :key="browser">
          {{ props.item[browser].value }}
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import timeUtil from '@/utils/time.js'
import platformsUtil from '@/utils/platforms.js'

export default {

  name: 'StatisticsTable',
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

  data: () => ({}),
  computed: {
    ...mapState('sysinfo', [
      'serverDate'
    ]),
    headers () {
      const headers = [{
        text: 'Metrics',
        align: 'left',
        sortable: false,
        value: 'name'
      }]
      for (let browserName in this.metrics) {
        headers.push({
          text: this.platformMap(browserName),
          align: 'left',
          sortable: false,
          width: '12%'
        })
      }
      return headers
    },
    items () {
      const metrics = this.metrics

      const entryPassingRatio = { name: 'Passing ratio' }
      const entryMeanPassingTime = { name: 'Mean passing time' }
      const entryLastRun = { name: 'Time since last run' }
      const entryLastPassed = { name: 'Time since last passed' }
      Object.keys(metrics).forEach(browser => {
        if (metrics[browser].passedCount > 0) {
          const meanPassingTime = this.duration(metrics[browser].sumPassingTime / metrics[browser].passedCount)
          const sdPassingTime = this.duration(
            Math.sqrt(
              metrics[browser].sumSquarePassingTime / metrics[browser].passedCount -
              Math.pow(metrics[browser].sumPassingTime / metrics[browser].passedCount, 2)
            )
          )
          entryMeanPassingTime[browser] = {
            value: `${meanPassingTime} ± ${sdPassingTime}`
          }
          entryLastPassed[browser] = {
            value: timeUtil.dateDisplay(this.serverDate, metrics[browser].lastPassed)
          }
        } else {
          entryMeanPassingTime[browser] = {
            value: 'Never'
          }
          entryLastPassed[browser] = {
            value: 'Forever'
          }
        }
        if (metrics[browser].totalCount > 0) {
          const passingRatio = Math.round(metrics[browser].passedCount / metrics[browser].totalCount * 100)

          entryPassingRatio[browser] = {
            value: `${passingRatio}%`
          }
          entryLastRun[browser] = {
            value: timeUtil.dateDisplay(this.serverDate, metrics[browser].lastRun)
          }
        } else {
          entryPassingRatio[browser] = {
            value: '0%'
          }
          entryLastRun[browser] = {
            value: 'Forever'
          }
        }
      })

      return [
        entryPassingRatio,
        entryLastRun,
        entryLastPassed,
        entryMeanPassingTime
      ]
    },
    metrics () {
      const metrics = {}
      platformsUtil.platforms.forEach(platformObject => {
        const platform = platformObject.value
        if (platformsUtil.getType(platform) !== this.dashboardResult.type) { return }
        const testResults = this.testResults.filter(testResult => testResult.platform === platform)
        const testResultsPassed = testResults.filter(testResult => testResult.status === 'PASSED')
        const testResultsRecent = testResults.filter((testResult, ind) => ind >= testResults.length - 10)
        metrics[platform] = {
          totalCount: testResults.length,
          passedCount: testResultsPassed.length,
          recentFailures: testResultsRecent.filter(testResult => testResult.status !== 'PASSED').length,
          sumPassingTime: testResultsPassed.reduce((acc, testResult) => this.passingTime(testResult) + acc, 0),
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
    platformMap: platform => {
      const platformObject = platformsUtil.platforms.find(platformObject => platformObject.value === platform)
      if (platformObject === undefined) {
        return 'Unknown'
      } else {
        return platformObject.label
      }
    },
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
    }
  }
}

</script>
