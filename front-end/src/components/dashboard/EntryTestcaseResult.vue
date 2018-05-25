<template>
  <span style="display: inline-block;">
    <el-popover
      ref="popover"
      :disabled="!showPopover"
      :open-delay="200"
      trigger="hover"
      placement="bottom"
      @show="getRecentResults"
      @hide="tableData = undefined">
      <span v-if="tableData">
        <h4>
          <i
            :class="platform.icon"
            class="fa" /> {{ testcaseName }}
        </h4>
        <lazy-render>
          <span slot="tip">Loading...</span>
          <el-table
            :data="tableData"
            @row-click="goTestJob">
            <el-table-column
              label="Job Id"
              prop="serial"
              width="80px">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini">
                  #{{ scope.row.serial }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="Result"
              prop="result"
              width="100px">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini">
                  {{ scope.row.result }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="Time"
              prop="time"
              min-width="140px">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini">
                  {{ scope.row.time }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </lazy-render>
      </span>
    </el-popover>
    <span
      v-popover:popover>
      <i :class="iconClasses"/>
    </span>
  </span>
</template>

<script>

import { getRecentTestResults } from '@/api/testresults.js'

export default {
  name: 'EntryTestcaseResult',
  component: {},

  props: {
    displayResult: {
      type: String,
      default: undefined
    },
    showPopover: {
      type: Boolean,
      default: true
    },
    branch: {
      type: String,
      default: undefined
    },
    platform: {
      type: Object,
      default: () => ({})
    },
    locator: {
      type: String,
      required: true
    },
    testcaseName: {
      type: String,
      required: true
    }
  },

  data: () => ({
    tableData: undefined
  }),
  computed: {
    iconClasses () {
      let classes = ['fa']
      if (this.displayResult === 'PASSED') {
        return classes.concat(['fa-check', 'success--text'])
      } else if (this.displayResult === 'RESOLVED') {
        return classes.concat(['fa-check', 'successSecondary--text'])
      } else if (this.displayResult === undefined) {
        return classes.concat(['fa-question', 'testcase-empty'])
      } else {
        return classes.concat(['fa-close', 'error--text'])
      }
    }
  },
  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    goTestJob (row, event, column) {
      this.$router.push({ path: `/testjobs/details/${row.serial}` })
    },
    getRecentResults () {
      const _this = this
      if (_this.showPopover === false) {
        return
      }
      if (_this.tableData === undefined) {
        getRecentTestResults(_this.branch, _this.locator, _this.platform.value, 5).then(res => {
          if (res && res.success) {
            _this.tableData = res.testresults.map(tr => ({
              serial: tr.jobId,
              result: tr.status,
              time: new Date(tr.start).toLocaleString()
            }))
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .testcase-passed {
    color: #97cc64
  }
  .testcase-failed {
    color: #fd5a3e;
  }
  .testcase-empty {
    color: #cccccc;
  }

  .el-popover h4 {
    width: 340px;
    padding: 0px 12px;
    margin: 5px 0px;
    text-overflow: ellipsis;
  }
  .el-popover .smaller {
    font-size: 10px;
  }
</style>
