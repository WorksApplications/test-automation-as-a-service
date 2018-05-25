<template>
  <v-card>
    <v-card-title>
      <h3 class="title">
        Running times of the test case
      </h3>
      <v-spacer />
      <div>
        Filter by Platforms:
        <v-btn-toggle
          v-model="platformsToShow"
          multiple>
          <v-tooltip
            v-for="platform in platforms"
            :key="platform.value"
            top>
            <v-btn
              slot="activator"
              :value="platform.value"
              flat>
              <icon
                :name="platform.icon.replace('fa-', '')"
                scale="1.3" />
            </v-btn>
            <span>
              {{ platform.label }}
            </span>
          </v-tooltip>
        </v-btn-toggle>
      </div>
    </v-card-title>
    <v-card-text>
      <chart
        :options="options"
        style="width: calc(5 / 6 * (100vw - 395px) - 10px); height: 350px;" />
    </v-card-text>
  </v-card>
</template>

<script>
import timeUtil from '@/utils/time.js'
import platformsUtil from '@/utils/platforms.js'

export default {

  name: 'RatingGraph',
  components: {},

  props: {
    testResults: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    platformsToShow: []
  }),
  computed: {
    options () {
      const testResults = this.testResults
      const platformsToShow = this.platformsToShow
      const byPassed = entry => entry.status === 'PASSED'
      const byFailed = entry => entry.status !== 'PASSED'
      const byPlatform = entry => platformsToShow.length === 0 || platformsToShow.indexOf(entry.platform) > -1
      const toPoint = type => entry => ({
        name: `${type} after ${Math.round((entry.stop - entry.start) / 1000)}s using ${this.platformMap(entry.platform).label} ${timeUtil.dateDisplay(new Date(), entry.start)}`,
        value: [ entry.start, (entry.stop - entry.start) / 1000 ]
      })

      const dataPass = testResults.filter(byPlatform).filter(byPassed).map(toPoint('Passed'))
      const dataFail = testResults.filter(byPlatform).filter(byFailed).map(toPoint('Failed'))
      // vue-echarts option object
      return {
        legend: {
          data: ['Succeed run', 'Failed run'],
          x: 'right'
        },
        grid: [{
          top: 20,
          left: 50,
          right: 50,
          height: '40%'
        }, {
          top: '55%',
          left: 50,
          right: 50,
          height: '25%'
        }],
        xAxis: [{
          show: false,
          type: 'time',
          min: testResults.length > 0 ? testResults[0].start : new Date(),
          max: testResults.length > 0 ? testResults[testResults.length - 1].start : new Date()
        }, {
          gridIndex: 1,
          type: 'time',
          min: testResults.length > 0 ? testResults[0].start : new Date(),
          max: testResults.length > 0 ? testResults[testResults.length - 1].start : new Date()
        }],
        axisPointer: {
          link: {
            xAxisIndex: 'all'
          }
        },
        yAxis: [{
          type: 'value',
          name: 'Time taken',
          nameGap: 5
        }, {
          gridIndex: 1,
          type: 'value',
          name: 'Score',
          min: 0,
          max: 100,
          nameGap: 5,
          splitNumber: 1
        }],
        dataZoom: [{}, {
          type: 'inside',
          xAxisIndex: [0, 1]
        }],
        visualMap: {
          show: false,
          min: 0,
          max: 100,
          pieces: [{
            gt: 0,
            lte: 20,
            color: '#660099'
          }, {
            gt: 20,
            lte: 40,
            color: '#cc0033'
          }, {
            gt: 40,
            lte: 60,
            color: '#ff9933'
          }, {
            gt: 60,
            lte: 80,
            color: '#ffde33'
          }, {
            gt: 80,
            lte: 100,
            color: '#096'
          }],
          seriesIndex: 2
        },
        series: [{
          name: 'Succeed run',
          data: dataPass,
          type: 'scatter',
          symbol: 'circle',
          symbolSize: 5,
          markLine: {
            symbol: 'none',
            silent: true,
            itemStyle: {
              normal: {
                color: '#080'
              }
            },
            data: [{
              type: 'average',
              name: 'Average'
            }]
          }
        }, {
          name: 'Failed run',
          data: dataFail,
          type: 'scatter',
          symbol: 'circle',
          symbolSize: 5,
          markLine: {
            symbol: 'none',
            silent: true,
            itemStyle: {
              normal: {
                color: '#f00'
              }
            },
            data: [{
              type: 'average',
              name: 'Average'
            }]
          }
        }, {
          data: this.grading(testResults),
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1
        }],
        tooltip: {
          trigger: 'axis',
          formatter: '{b0}<br>{b1}',
          position: 'bottom',
          textStyle: {
            fontSize: 12
          },
          backgroundColor: '#616161'
        },
        color: [
          '#080',
          '#f00'
        ],
        textStyle: {
          fontFamily: 'ubuntu'
        },
        animation: false
      }
    },
    platforms () {
      const platformValues = [...new Set(this.testResults.map(testResult => testResult.platform))]
      return platformValues.map(platformValue => this.platformMap(platformValue))
    }
  },
  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    grading: function (entries) {
      const platformsToShow = this.platformsToShow
      const byPlatform = entry => platformsToShow.length === 0 || platformsToShow.indexOf(entry.platform) > -1

      let lastScore = 50
      const grades = []
      entries.filter(byPlatform).forEach((entry, ind) => {
        let entryScore
        const effect = 0.2
        if (entry.status === 'PASSED') {
          entryScore = 102
        } else {
          entryScore = -2
        }
        lastScore = Math.round(lastScore * (1 - effect) + entryScore * effect)
        grades.push({
          value: [entry.start, lastScore],
          name: `Score: ${lastScore} (${this.letterGrade(lastScore)})`
        })
      })
      return grades
    },
    platformMap: platform => platformsUtil.platforms.find(platformObject => platformObject.value === platform),
    letterGrade: score => {
      if (score >= 80) {
        return 'A'
      } else if (score >= 60) {
        return 'B'
      } else if (score >= 40) {
        return 'C'
      } else if (score >= 20) {
        return 'D'
      } else {
        return 'E'
      }
    }
  }
}

</script>
