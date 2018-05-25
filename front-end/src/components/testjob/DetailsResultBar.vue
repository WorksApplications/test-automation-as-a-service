<template>
  <a
    :href="report"
    :disabled="!report"
    :title="report ? 'Click to show a detailed report' : 'No report available'"
    target="_blank">
    <chart
      :options="dataTestResults"
      style="width: calc(100vw - 395px); height: 20px;" />
  </a>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'DetailsResultBar',
  components: {},

  props: {
    testJobResult: {
      type: Object,
      default: () => ({})
    },
    verdict: {
      type: Object,
      default: () => ({})
    },
    report: {
      type: String,
      default: undefined
    }
  },

  data: () => ({}),
  computed: {
    dataTestResults () {
      // for vue-echarts
      const verdict = this.verdict
      const result = _.cloneDeep(this.testJobResult)
      if (result === undefined) {
        return {}
      }
      if (verdict.status !== 'pending' && verdict.status !== 'running') {
        result.canceled += result.total - result.passed - result.failed - result.canceled - result.broken
      }
      if (verdict.status === 'resolved') {
        result.resolved = result.total
        result.passed = 0
        result.failed = 0
        result.pending = 0
        result.broken = 0
        result.canceled = 0
      }
      const series = [{
        name: 'passed',
        value: result.passed,
        color: '#acd683bb'
      }, {
        name: 'resolved',
        value: result.resolved,
        color: '#acd683bb'
      }, {
        name: 'failed',
        value: result.failed,
        color: '#fd7b65bb'
      }, {
        name: 'pending',
        value: result.pending,
        color: '#dc7ecbbb'
      }, {
        name: 'broken',
        value: result.broken,
        color: '#ffd973bb'
      }, {
        name: 'canceled',
        value: result.canceled,
        color: '#bbbbbbbb'
      }, {
        name: 'pending',
        value: result.total - result.passed - result.failed - result.canceled - result.broken,
        color: '#bbbbbbbb'
      }].map(item => ({
        name: item.name,
        type: 'bar',
        stack: 'Test Job',
        label: {
          show: item.value > 0,
          position: 'inside'
        },
        itemStyle: {
          color: item.color
        },
        data: [
          item.value
        ]
      }))
      // vue-echarts option object
      return {
        xAxis: {
          show: false,
          type: 'value',
          max: result.total
        },
        yAxis: {
          type: 'category',
          data: ['Test Job'],
          show: false
        },
        series,
        title: {
          show: false
        },
        legend: {
          show: false
        },
        tooltip: {
          trigger: 'item',
          formatter: '{c} {a}',
          position: 'bottom',
          textStyle: {
            fontSize: 12
          },
          backgroundColor: '#616161'
        },
        grid: {
          left: 0,
          right: -10,
          bottom: 0,
          top: 0,
          backgroundColor: 'red'
        },
        textStyle: {
          fontFamily: 'ubuntu'
        },
        animationEasing: 'cubicInOut',
        animationDuration: 1000
      }
    }
  },

  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {}
}
</script>

<style module>
.testResults {
  width: calc(100vw - 395px);
  height: 20px;
}
</style>
