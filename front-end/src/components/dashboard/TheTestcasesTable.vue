<template>
  <span>
    <div class="dashboard-title">
      <div class="thead">
        <span>
          License
        </span>
        <span>
          Subsystem
        </span>
        <span>
          Module
        </span>
        <span>
          Testcase
        </span>
        <span
          v-for="platform in platforms"
          v-show="showPlatform(platform)"
          :key="platform.value"
          style="width: 35px; text-align: center;">
          <el-tooltip :content="platform.label">
            <i :class="['fa', platform.icon]" />
          </el-tooltip>
        </span>
        <span style="width: 50px;" />
      </div>
    </div>
    <virtual-scroller
      ref="table"
      :items="tableDataFiltered"
      buffer="500"
      pool-size="500"
      item-height="26"
      container-class="dashboard-table"
      content-class="tbody"
      content-tag="div"
      style="max-height: calc(100vh - 250px); overflow-y: scroll;">
      <template slot-scope="props">
        <div class="tr">
          <span
            v-for="colIndex in [0, 1, 2, 3]"
            :colspan="colIndex < props.item.path.length - 1 ? 1 : (colIndex === props.item.path.length - 1 ? 4 - colIndex : 0)"
            :class="{ line_above: props.itemIndex === 0 || tableDataFiltered[props.itemIndex - 1].path[colIndex] !== props.item.path[colIndex] }"
            :key="colIndex"
            class="td">
            <span
              v-if="props.item.path.length - 1 === colIndex">
              <span
                :class="getRatingColorClass(props.item.info.rating)"
                style="font-weight: bold;">
                {{ getRatingString(props.item.info.rating) }}
              </span>
              <router-link :to="`/testcases/${branch}/${encodeURIComponent(props.item.info.locator)}`">{{ props.item.path[colIndex] }}</router-link>
            </span>
            <span v-else-if="props.itemIndex === 0 || tableDataFiltered[props.itemIndex - 1].path[colIndex] !== props.item.path[colIndex]">
              {{ props.item.path[colIndex] }}
            </span>
          </span>
          <span
            :style="{ 'width': `${35 * (7 - platformsToShow.length)}px`, 'display': platformsToShow.length ? 'block' : 'none' }"
            class="line_above td" />
          <span
            v-for="platform in platforms"
            v-show="showPlatform(platform)"
            :key="platform.value"
            class="line_above td"
            style="text-align: center;">
            <span v-if="!isPlatformSupported(platform.value, props.item.info.type)">
              <i
                class="fa fa-minus"
                style="color: #eee;" />
            </span>
            <entry-testcase-result
              v-else
              :display-result="props.item.results[platform.value]"
              :show-popover="showPopover"
              :branch="branch"
              :platform="platform"
              :locator="props.item.info.locator"
              :testcase-name="last(props.item.path)" />
          </span>
          <span
            class="line_above td"
            style="text-align: center;">
            <code-viewer-static
              :branch="branch"
              :testcase="props.item.info" />
          </span>
        </div>
      </template>
    </virtual-scroller>
  </span>
</template>

<script>

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { VirtualScroller } from 'vue-virtual-scroller'
import store from '@/store'
import utilPlatforms from '@/utils/platforms.js'
import { last, cloneDeep } from 'lodash'
import { loadingData } from '@/components/InteractivePushMessage.vue'
import CodeViewerStatic from '@/components/testcase/TheCodeViewerStatic.vue'
import EntryTestcaseResult from '@/components/dashboard/EntryTestcaseResult.vue'
import { getTestResultsForJob } from '@/api/testresults.js'

export default {

  name: 'TestcasesTable',
  components: {
    VirtualScroller,
    CodeViewerStatic,
    EntryTestcaseResult
  },

  props: {
    branch: {
      type: String,
      required: true
    },
    platformsToShow: {
      type: Array,
      default: () => []
    },
    testcasesToShow: {
      type: Array,
      default: () => []
    },
    subsystemsToShow: {
      type: Array,
      default: () => []
    },
    testcasesSubscribed: {
      type: Array,
      default: () => []
    },
    showPopover: {
      type: Boolean,
      default: true
    },
    jobId: {
      type: Number,
      default: undefined
    },
    testPlanId: {
      type: Number,
      default: undefined
    },
    taskId: {
      type: Number,
      default: undefined
    }
  },

  data: () => ({
    // Raw data obtained from DB
    rawData: undefined,
    // Tabulated data
    tableData: [],
    platforms: utilPlatforms.platforms
  }),
  computed: {
    tableDataFiltered () {
      const withSubsystemIn = (subsystemsList) => (testcase) => subsystemsList.some((subsystemInList) => testcase.info.locator.startsWith(subsystemInList))
      const withTestcasesIn = (testcasesList) => (testcase) => testcasesList.some((testcaseInList) => testcase.info.locator === testcaseInList)
      const withTestcasesSubscribed = (testcasesSubscribed) => (testcase) => testcasesSubscribed.some((testcaseSubscribed) => {
        return testcaseSubscribed.every((pathNode, index) => {
          if (typeof pathNode.value === 'string') {
            return pathNode.label === testcase.path[index]
          } else {
            return pathNode.value.locator === testcase.info.locator
          }
        })
      })
      let result = cloneDeep(this.tableData)
      // Filter by subsystemsToShow
      if (this.subsystemsToShow.length > 0) {
        result = result.filter(withSubsystemIn(this.subsystemsToShow))
      }
      // Filter by testcasesToShow
      if (this.testcasesToShow.length > 0) {
        result = result.filter(withTestcasesIn(this.testcasesToShow))
      }
      // Filter by testcasesSubscribed
      if (this.testcasesSubscribed.length > 0) {
        result = result.filter(withTestcasesSubscribed(this.testcasesSubscribed))
      }
      return result
    },
    tooltipNonLatest () {
      return `You are viewing testcases on ${this.branch}, which is not the latest`
    }
  },
  watch: {
    branch: function () {
      this.updateDashboard()
    },
    rawData: function () {
      this.tableData = []
      if (this.rawData === undefined) {
        return
      }
      Object.keys(this.rawData).sort().forEach((value) => this.parseSubtree(this.rawData[value], []))
    },
    tableData: {
      deep: true,
      handler: function (newValue) {
        const _this = this
        if (_this.jobId) {
          getTestResultsForJob(_this.jobId).then(res => {
            if (res && res.success) {
              _this.testcasesToShow.forEach(testcase => {
                const withLocator = (locator) => (tableRow) => locator === tableRow.info.locator
                let tableDataIndex = _this.tableData.findIndex(withLocator(testcase))
                let testresult = res.testresults.find(testresult => {
                  return testresult.locator === testcase
                })
                _this.tableData[tableDataIndex].results[_this.platformsToShow[0]] = testresult ? testresult.status : undefined
              })
            }
          })
        }
      }
    }
  },

  created () {},
  mounted () {
    this.updateDashboard()
  },
  updated () {},
  destroyed () {},

  methods: {
    getRatingColorClass: score => {
      if (score === null || score === undefined) {
        return 'grey--text'
      } else if (score >= 80) {
        return 'green--text'
      } else if (score >= 60) {
        return 'yellow--text'
      } else if (score >= 40) {
        return 'orange--text'
      } else if (score >= 20) {
        return 'red--text'
      } else {
        return 'red--text text--darken-2'
      }
    },
    getRatingString: score => {
      if (score === null || score === undefined) {
        return '[?]'
      } else if (score >= 80) {
        return '[A]'
      } else if (score >= 60) {
        return '[B]'
      } else if (score >= 40) {
        return '[C]'
      } else if (score >= 20) {
        return '[D]'
      } else {
        return '[E]'
      }
    },
    last,
    isPlatformSupported: utilPlatforms.isPlatformSupported,
    showPlatform: function (platform) {
      return this.platformsToShow.length === 0 ||
          this.platformsToShow.some((platformValue) => platformValue === platform.value)
    },
    fetchData: (branch) => store.dispatch('dashboard/getDashboard', branch),
    renderHeader (createElement, { column }) {
      return createElement('el-tooltip', {
        attrs: {
          content: column.label
        }
      }, [
        createElement('i', {
          class: ['fa', column.property]
        })
      ]
      )
    },
    parseSubtree (subtree, currentStack) {
      const byName = (testcaseOne, testcaseTwo) => {
        return testcaseOne.name > testcaseTwo.name
      }
      currentStack.push(subtree.taas_metadata.name)

      // Testcases
      let branchPrefix = ''
      if (this.branch.indexOf('TaaS_') === 0) {
        let branchArray = this.branch.substr(5).split('_')
        branchArray.pop()
        branchPrefix = branchArray.join('.')
      }

      if (subtree.testcases !== undefined) {
        subtree.testcases.sort(byName).forEach((testcase) => {
          let currentTestcaseStack = cloneDeep(currentStack)
          currentTestcaseStack.push(testcase.name)
          if (testcase.locator.startsWith(branchPrefix)) {
            let results = {}
            if (testcase.testResults) {
              if (!this.testPlanId && !this.taskId) {
                results = testcase.testResults
              } else if (testcase.testResults[this.testPlanId]) {
                if (this.testPlanId && !this.taskId) {
                  results = testcase.testResults[this.testPlanId]
                } else if (testcase.testResults[this.testPlanId][this.taskId]) {
                  if (this.testPlanId && this.taskId) {
                    results = testcase.testResults[this.testPlanId][this.taskId]
                  }
                }
              }
            }
            testcase.branch = this.branch
            this.tableData.push({
              info: testcase,
              path: currentTestcaseStack,
              results
            })
          }
        })
      }
      // Go deeper recursively
      Object.keys(subtree).sort().forEach((branchKey) => {
        if (branchKey === 'taas_metadata' || branchKey === 'testcases') {
          return
        }
        this.parseSubtree(subtree[branchKey], currentStack)
      })
      currentStack.pop()
    },
    updateDashboard () {
      const _this = this
      const dom = _this.$el
      loadingData(_this.fetchData(this.branch), dom).then((dashboard) => {
        if (dashboard) {
          _this.rawData = dashboard.testresults
        }
      })
    }
  }

}

</script>

<style lang="scss">
  .dashboard-title {
    & > .thead {
      width: 100%;
      color: #909399;
      font-weight: bold;
      display: inline-flex;
      & > span {
        padding-bottom: 8px;
        &:nth-child(-n+4) { // First four childs
          text-align: left;
        }
        &:nth-child(-n+3) {
          width: 200px;
        }
        &:nth-child(4) {
          margin-right: auto;
        }
      }
    }
  }
  .dashboard-table {
    & > .tbody > .tr {
      display: flex;
    }
    & > .tbody > .tr > span.line_above {
      border-top: #eee solid 1px;
    }
    & > .tbody > .tr > span {
      height: 26px;
      padding: 2px 0px;
      white-space: nowrap;
      color: #606266;
      overflow: hidden;
      text-overflow: ellipsis;
      &:nth-child(-n+3)[colspan='1'] {
        width: 200px;
      }
      &:nth-child(4) {
        width: 100%;
        max-width: calc(100% - 600px - 8 * 35px);
        margin-right: auto;
      }
      &:nth-child(n+5) {
        width: 35px;
      }
      &[colspan='0'] {
        display: none;
      }
      &[colspan='2'] {
        width: 100%;
        max-width: calc(100% - 400px - 8 * 35px);
        margin-right: auto;
      }
    }
  }
</style>
