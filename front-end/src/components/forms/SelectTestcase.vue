<template>
  <div class="vue-drawer">
    <a
      type="text"
      @click="openDrawer">
      {{ drawerButtonString }}
    </a>
    <el-container
      :class="isDrawerVisible ? 'active' : ''"
      class="main">
      <el-header>
        Select Testcases from
        <i class="fa fa-code-fork" />
        <em>{{ branch }}</em>
        ({{ selectedTestcases.length }})
      </el-header>
      <el-main>
        <el-card>
          <el-checkbox-group v-model="selectedCheckboxes">
            <el-table
              :data="tableTestcasesFiltered"
              :span-method="arraySpanMethod"
              class="testcase-selector-table">
              <el-table-column
                label="License"
                min-width="150">
                <template slot-scope="scope">
                  <el-checkbox
                    v-if="!disabled"
                    :label="serialize(scope.row.locator, 0)"
                    @change="updateCheckbox(scope.row.locator, 0)">
                    {{ scope.row.testcasePath[0] }}
                    <el-tooltip
                      v-if="branch !=='develop'"
                      :content="tooltipNonLatest">
                      <i class="fa fa-code-fork" />
                    </el-tooltip>
                  </el-checkbox>
                  <span v-else>
                    {{ scope.row.testcasePath[0] }}
                    <el-tooltip
                      v-if="branch !=='develop'"
                      :content="tooltipNonLatest">
                      <i class="fa fa-code-fork" />
                    </el-tooltip>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="Subsystem"
                min-width="150">
                <template slot-scope="scope">
                  <el-checkbox
                    v-if="!disabled"
                    :label="serialize(scope.row.locator, 1)"
                    @change="updateCheckbox(scope.row.locator, 1)">
                    {{ scope.row.testcasePath[1] }}
                    <el-tooltip
                      v-if="branch !=='develop'"
                      :content="tooltipNonLatest">
                      <i class="fa fa-code-fork" />
                    </el-tooltip>
                  </el-checkbox>
                  <span v-else>
                    {{ scope.row.testcasePath[1] }}
                    <el-tooltip
                      v-if="branch !=='develop'"
                      :content="tooltipNonLatest">
                      <i class="fa fa-code-fork" />
                    </el-tooltip>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="Module"
                min-width="150">
                <template slot-scope="scope">
                  <el-checkbox
                    v-if="scope.row.testcasePath.length === 3 && !disabled"
                    :label="serialize(scope.row.locator, -1)"
                    @change="updateCheckbox(scope.row.locator, -1)">
                    {{ scope.row.testcasePath[2] }}
                    <el-tag
                      v-for="group in scope.row.groups"
                      :key="group"
                      size="mini"
                      type="info">
                      {{ group }}
                    </el-tag>
                  </el-checkbox>
                  <el-checkbox
                    v-else-if="!disabled"
                    :label="serialize(scope.row.locator, 2)"
                    @change="updateCheckbox(scope.row.locator, 2)">
                    {{ scope.row.testcasePath[2] }}
                  </el-checkbox>
                  <span v-else>
                    {{ scope.row.testcasePath[2] }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="Testcase"
                min-width="500">
                <template slot-scope="scope">
                  <el-checkbox
                    v-if="!disabled"
                    :label="serialize(scope.row.locator, -1)"
                    @change="updateCheckbox(scope.row.locator, -1)">
                    {{ scope.row.testcasePath[3] }}
                    <el-tag
                      v-for="group in scope.row.groups"
                      :key="group"
                      size="mini"
                      type="info">
                      {{ group }}
                    </el-tag>
                  </el-checkbox>
                  <span v-else>
                    {{ scope.row.testcasePath[3] }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-checkbox-group>
        </el-card>

      </el-main>
      <el-footer v-if="!disabled">
        <el-button
          :plain="true"
          type="primary"
          size="small"
          @click="closeDrawer">
          I choose you, Pikachu!
        </el-button>
        <el-button
          :plain="true"
          type="warning"
          size="small"
          @click="clearSelection">
          Clear
        </el-button>
      </el-footer>
    </el-container>
    <div
      :class="isDrawerVisible ? 'active' : ''"
      class="mask"
      @click="closeDrawer"/>
  </div>
</template>

<script>

import { cloneDeep, intersection, union, xor, without } from 'lodash'
import TestcasesAPI from '@/api/testcases.js'
import utilPlatforms from '@/utils/platforms.js'

export default {

  name: 'InputSelector',
  components: {},

  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    },
    branch: {
      type: String,
      required: true
    }
  },

  data: () => ({
    isDrawerVisible: false,
    tableTestcases: [],
    selectedCheckboxes: [],
    selectedGroups: [],
    availableCheckboxes: [],
    availableTestcases: [],
    availableGroups: [],
    tableTestcasesFiltered: [],
    testcases: {}
  }),
  computed: {
    selectedTestcases: function () {
      if (this.disabled === false) {
        let result = intersection(this.availableTestcases, this.selectedCheckboxes)
        this.$emit('syncTestcases', result)
        return result
      } else {
        return this.value.testcases
      }
    },
    drawerButtonString: function () {
      let testcasesCount = this.selectedTestcases.length
      if (testcasesCount === 0) {
        return 'No testcases are selected'
      } else if (testcasesCount === 1) {
        return '1 testcase is selected'
      } else {
        return `${testcasesCount} testcases are selected`
      }
    },
    spanTestcasesFiltered: function () {
      let spanData = []
      // Initializing
      this.tableTestcasesFiltered.forEach(() => spanData.push([[0, 0], [0, 0], [0, 0], [0, 0]]))
      // Manage "rowspan"
      for (var columnIndex = 0; columnIndex < 4; columnIndex++) {
        let lastEqualRow = 0
        this.tableTestcasesFiltered.forEach((dataRow, rowIndex) => {
          if (dataRow.testcasePath[columnIndex] === undefined) {
            return
          }
          if (dataRow.testcasePath[columnIndex] !== this.tableTestcasesFiltered[lastEqualRow].testcasePath[columnIndex]) {
            lastEqualRow = rowIndex
          }
          spanData[lastEqualRow][columnIndex][0]++
          spanData[lastEqualRow][columnIndex][1] = 1
        })
      }
      // Manage "colspan"
      this.tableTestcasesFiltered.forEach((dataRow, rowIndex) => {
        let columnIndex = dataRow.testcasePath.length - 1
        spanData[rowIndex][columnIndex][0] = 1
        spanData[rowIndex][columnIndex][1] = 4 - columnIndex
      })

      return spanData
    },
    tooltipNonLatest () {
      return `You are selecting testcases on ${this.branch}, which is not the latest`
    }
  },
  watch: {
    value: function () {
      this.updateTestcases()
      this.selectedCheckboxes = this.value.testcases
      this.value.testcases.forEach((locator) => {
        this.updateCheckbox(locator, -1)
      })
    },
    'value.platform': function () {
      this.syncTable()
    },
    branch: async function () {
      this.testcases = (await TestcasesAPI.fetchAll(this.branch)).testcases
      this.syncTable()
    },
    tableTestcases: function () {
      this.updateTestcases()
    },
    disabled: function () {
      this.updateTestcases()
    }
  },

  created () {},
  mounted: async function () {
    this.testcases = (await TestcasesAPI.fetchAll(this.branch)).testcases
    this.syncTable()
  },
  updated () {},
  destroyed () {},

  methods: {
    openDrawer: function () {
      this.isDrawerVisible = true
    },
    closeDrawer: function () {
      this.isDrawerVisible = false
    },

    clearSelection: function () {
      this.selectedCheckboxes = []
    },

    updateTestcases: function () {
      this.availableCheckboxes = []
      this.availableTestcases = []
      let type = utilPlatforms.getType(this.value.platform)
      const whereTypeEquals = (type) => (testcase) => testcase.type === type
      const withLocator = (locatorsList) => (testcase) => locatorsList.indexOf(testcase.locator) !== -1

      this.tableTestcasesFiltered = this.tableTestcases.filter(whereTypeEquals(type))
      if (this.disabled === true) {
        this.tableTestcasesFiltered = this.tableTestcasesFiltered.filter(withLocator(this.value.testcases))
      }
      this.tableTestcasesFiltered.forEach((testcase) => {
        this.availableTestcases.push(testcase.locator)
        let mapping = [0, 1, -1, 2]
        for (var index = 0; index < testcase.testcasePath.length; index++) {
          let sublocator = this.serialize(testcase.locator, mapping[index])
          this.availableCheckboxes.push(sublocator)
        }
      })
      this.availableCheckboxes = Array.from(new Set(this.availableCheckboxes)) // making entries unique
    },

    updateCheckbox: function (fullLocator, depth) {
      const checkboxLocator = this.serialize(fullLocator, depth)
      const withPrefix = (locatorPrefix) => (locator) => locator.indexOf(locatorPrefix) === 0
      let locatorState = this.selectedCheckboxes.some((selectedCheckboxLocator) => checkboxLocator === selectedCheckboxLocator)

      // checked
      if (locatorState) {
        // update children
        this.selectedCheckboxes = union(this.selectedCheckboxes, this.availableCheckboxes.filter(withPrefix(checkboxLocator)))
        // update parent
        if (depth === -1) {
          depth = 3
        }
        for (let subdepth = depth - 1; subdepth >= 0; subdepth--) {
          let parentLocator = this.serialize(fullLocator, subdepth)
          if (this.availableCheckboxes.some((availableLocator) => availableLocator === parentLocator) === false) {
            continue
          }
          let childLocators = without(this.availableCheckboxes.filter(withPrefix(parentLocator)), parentLocator)
          if (childLocators.length === intersection(childLocators, this.selectedCheckboxes).length) {
            this.selectedCheckboxes.push(parentLocator)
          } else {
            break
          }
        }
      } else {
        // update children
        this.selectedCheckboxes = xor(this.selectedCheckboxes, this.availableCheckboxes.filter(withPrefix(checkboxLocator)))
        // update parent
        if (depth === -1) {
          depth = 3
        }
        for (let subdepth = depth - 1; subdepth >= 0; subdepth--) {
          let parentLocator = this.serialize(fullLocator, subdepth)
          if (this.availableCheckboxes.some((availableLocator) => availableLocator === parentLocator) === false) {
            continue
          }
          this.selectedCheckboxes = without(this.selectedCheckboxes, parentLocator)
        }
        this.selectedCheckboxes = without(this.selectedCheckboxes, checkboxLocator)
      }
    },

    serialize: function (locator, depth) {
      if (depth >= 0) {
        let locatorArray = locator.replace('#', '.').split('.')
        return locatorArray.slice(0, depth + 1).join('.')
      } else if (depth === -1) {
        return locator
      }
    },
    parseSubtree: function (subtree, stack) {
      const byName = (testcaseOne, testcaseTwo) => {
        return testcaseOne.name > testcaseTwo.name
      }
      let currentStack = cloneDeep(stack)
      currentStack.push(subtree.taas_metadata.name)
      // Testcases
      if (subtree.testcases !== undefined) {
        subtree.testcases.sort(byName).forEach((testcase) => {
          let currentTestcaseStack = cloneDeep(currentStack)
          currentTestcaseStack.push(testcase.name)
          let testcaseGroups = cloneDeep(testcase.groups)
          if (testcaseGroups === undefined) {
            testcaseGroups = []
          }
          this.tableTestcases.push({
            testcasePath: currentTestcaseStack,
            type: testcase.type,
            locator: testcase.locator,
            groups: testcaseGroups
          })
        })
      }
      // Go deeper recursively
      Object.keys(subtree).sort().forEach((branchKey) => {
        if (branchKey === 'taas_metadata' || branchKey === 'testcases') {
          return
        }
        this.parseSubtree(subtree[branchKey], currentStack)
      })
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex >= 4) {
        return [1, 1]
      }
      return this.spanTestcasesFiltered[rowIndex][columnIndex]
    },
    syncTable () {
      if (this.testcases === undefined) {
        return
      }
      this.tableTestcases = []
      Object.keys(this.testcases).sort().forEach((value) => this.parseSubtree(this.testcases[value], []))
    }
  }

}
</script>

<style lang="scss" scoped>
  .vue-drawer > .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    visibility: hidden;
    opacity: 0;
    background-color: #000000;
    transition: opacity ease 0.5s, visibility ease 0.5s;
    z-index: 100;
    &.active {
      visibility: visible;
      opacity: 0.5;
    }
  }

  .vue-drawer > .main {
    background-color: #eee;
    position: fixed;
    top: 0;
    right: -80%;
    bottom: 0;
    width: 80%;
    transition: right ease 0.5s;
    overflow-y: auto;
    z-index: 101;
    opacity: 0;

    &.active {
      opacity: 1;
      right: 0px;
    }

    .el-header {
      background-color: #4DB6AC;
      font-size: 20px;
      color: #ffffff;
      padding-top: 10px;
    }
    .el-footer {
      padding: 10px;
      background-color: #ffffff;
    }
    .el-main {
      overflow-x: hidden;
    }
  }
</style>

<style lang="scss">
  .testcase-selector-table .el-table__body > tbody > tr > td {
    padding: 2px;
  }
  .testcase-selector-table .el-table__body > tbody > tr:hover > td {
    background-color: #FFF;
  }
  .testcase-selector-table .el-table__body > tbody > tr > td > div > label > .el-checkbox__label {
    font-weight: 400;
  }
</style>
