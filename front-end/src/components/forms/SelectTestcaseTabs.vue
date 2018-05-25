<template>
  <div :style="{ marginLeft: indent + 'px' }">
    <v-tabs
      v-if="testcasesWithChildrenOrNot[1].length > 0"
      ref="tabs"
      v-model="tabActive">
      <v-tab
        v-for="(testcaseWithChildren, i) in testcasesWithChildrenOrNot[1]"
        :key="`tab-${testcaseWithChildren.value}`">
        <v-checkbox
          v-model="checkList"
          :value="testcaseWithChildren.label"
          :indeterminate="checkAllChildren[i] === checkBoxStatus.INDETERMINATE"
          style="flex: 0"
          hide-details
          @change="updateCheck(testcaseWithChildren.label, i, false)"/>
        <span style="flex: 1">{{ testcaseWithChildren.label }}</span>
        <span v-if="checkChildrenCount[i] > 0">({{ checkChildrenCount[i] }})</span>
      </v-tab>
      <v-tab-item
        v-for="(testcaseWithChildren, i) in testcasesWithChildrenOrNot[1]"
        :key="`tab-item-${testcaseWithChildren.value}`">
        <select-testcase-tabs
          :ref="`subTabs${i}`"
          :testcases="testcaseWithChildren.children"
          :testcases-selected="getTestcasesSelectedChildren(i)"
          :index="i"
          :active="active && tabActive === i.toString()"
          :indent="indent"
          @offset-tabs="onOffsetTabs"
          @updateCheckChildren="updateCheckChildren"
          @update-sum="onUpdateSum"/>
      </v-tab-item>
    </v-tabs>
    <div style="padding: 6px 12px">
      <v-checkbox
        v-for="(testcaseWithoutChildren, i) in testcasesWithChildrenOrNot[0]"
        v-model="checkList"
        :value="testcaseWithoutChildren.label"
        :key="testcaseWithoutChildren.value.locator"
        :label="testcaseWithoutChildren.label"
        hide-details
        @change="updateCheck(testcaseWithoutChildren.label, i, true)"/>
    </div>
  </div>
</template>

<script>
import { partition, cloneDeep, isEqual } from 'lodash'
import SelectTestcaseTabs from '@/components/forms/SelectTestcaseTabs.vue'
import utilElement from '@/utils/element.js'

export default {
  name: 'SelectTestcaseTabs',

  components: {
    SelectTestcaseTabs
  },

  props: {
    testcases: {
      type: Array,
      required: true
    },
    testcasesSelected: {
      type: Array,
      default: () => []
    },
    index: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: false
    },
    indent: {
      type: Number,
      default: 0
    }
  },

  data: () => ({
    tabActive: undefined,
    sliderGenerated: false,
    checkList: [],
    checkAllChildren: [],
    checkChildrenCount: [],
    checkLeaves: [],
    checkBoxStatus: {
      CHECK_NONE: 0,
      CHECK_ALL: 1,
      INDETERMINATE: 2
    },
    intervalId: null
  }),

  computed: {
    testcasesWithChildrenOrNot () {
      return partition(this.testcases, testcase => {
        return testcase.children === undefined
      })
    },
    countNotCheckNone () {
      let countForNonLeaf = this.checkAllChildren.filter(
        item => item !== this.checkBoxStatus.CHECK_NONE
      ).length
      let countForLeaf = this.checkLeaves.filter(
        item => item === true
      ).length
      return countForNonLeaf + countForLeaf
    },
    countNotCheckAll () {
      let countForNonLeaf = this.checkAllChildren.filter(
        item => item !== this.checkBoxStatus.CHECK_ALL
      ).length
      let countForLeaf = this.checkLeaves.filter(
        item => item === false
      )
      return countForNonLeaf + countForLeaf
    }
  },

  watch: {
    active (newValue, oldValue) {
      const _this = this
      if (this.active) {
        if (!this.sliderGenerated && this.$refs.tabs) {
          this.tabActive = '0'
          this.$refs.tabs.callSlider = this.customizedCallSlider
          this.$refs.tabs.callSlider()
          this.sliderGenerated = true
        }
        if (this.testcasesWithChildrenOrNot[1].length === 0) {
          let checkTabItemExist = () => {
            if (_this.$el) {
              let root = document.querySelector('.select-testcase-tabs')
              _this.$emit('offset-tabs', [utilElement.offsetBetween(root, _this.$el).top])
              clearInterval(this.intervalId)
            }
          }
          this.intervalId = setInterval(checkTabItemExist, 100)
        }
      }
    },
    testcasesSelected: function (newValue, oldValue) {
      if (!isEqual(newValue, oldValue)) {
        this.updateSelected(newValue)
      }
    },
    testcases: function (newValue, oldValue) {
      if (!isEqual(newValue, oldValue)) {
        this.updateSelected(this.testcasesSelected)
      }
    }
  },

  created () {},
  mounted () {
    this.updateSelected(this.testcasesSelected)
    if (this.testcasesWithChildrenOrNot[0].length > 0) {
      this.$nextTick(() => {
        this.updateSum()
      })
    }
  },
  updated () {},
  destroyed () {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  },

  methods: {
    customizedCallSlider () {
      let tabs = this.$refs.tabs
      if (tabs.hideSlider || !tabs.activeTab) return false

      // Give screen time to paint
      const action = (tabs.activeTab || {}).action
      const activeTab = action === tabs.activeTab
        ? tabs.activeTab
        : tabs.tabs.find(tab => tab.action === action)

      this.$nextTick(() => {
        if (!activeTab || !activeTab.$el) return
        tabs.sliderWidth = activeTab.$el.scrollWidth
        tabs.sliderLeft = activeTab.$el.offsetLeft
        let slider = tabs.$el.querySelector('.tabs__slider-wrapper')
        slider.style.top = `${activeTab.$el.offsetTop + activeTab.$el.offsetHeight - 2}px`
      })
    },
    onOffsetTabs (offsetTabs) {
      let root = document.querySelector('.select-testcase-tabs')
      offsetTabs.unshift(utilElement.offsetBetween(root, this.$el).top)
      this.$emit('offset-tabs', offsetTabs)
    },
    countTestcases () {
      let countForLeaf = this.checkLeaves.filter(
        item => item === true
      ).length
      let countForNonLeaf = this.checkChildrenCount.reduce((sum, count) => sum + count, 0)
      return countForLeaf + countForNonLeaf
    },
    updateSum () {
      this.$emit('update-sum', this.countTestcases(), this.index)
    },
    onUpdateSum (sum, index) {
      let checkChildrenCountCopy = cloneDeep(this.checkChildrenCount)
      checkChildrenCountCopy[index] = sum
      this.checkChildrenCount = cloneDeep(checkChildrenCountCopy)
      this.$emit('update-sum', this.countTestcases(), this.index)
    },
    getTestcasesSelectedChildren (index) {
      const _this = this
      let testcasesSelectedChildren = []
      this.testcasesSelected.some(testcase => {
        // Match testcase in testcasesSelected with testcasesWithChildrenOrNot[1][index]
        if (testcase[0].value === _this.testcasesWithChildrenOrNot[1][index].value) {
          if (testcase.length === 1) {
            // All children are selected, push all
            _this.testcasesWithChildrenOrNot[1][index].children.forEach(child =>
              testcasesSelectedChildren.push([{
                label: child.label,
                value: child.value
              }]))
            return true
          } else {
            // Part of children are selected, push one by one
            let testcasesSelectedChild = testcase.slice(1)
            if (testcasesSelectedChild.length > 0) {
              testcasesSelectedChildren.push(testcasesSelectedChild)
            }
            return false
          }
        }
        return false
      })
      return testcasesSelectedChildren
    },
    updateCheck (value, index, isLeaf) {
      let checked = this.checkList.includes(value)
      let testcasePath = []
      let testcase
      if (!isLeaf) {
        let newCheckAllChildren = cloneDeep(this.checkAllChildren)
        newCheckAllChildren[index] = checked ? this.checkBoxStatus.CHECK_ALL : this.checkBoxStatus.CHECK_NONE
        this.checkAllChildren = cloneDeep(newCheckAllChildren)
        testcase = this.testcasesWithChildrenOrNot[1][index]
      } else {
        testcase = this.testcasesWithChildrenOrNot[0][index]
      }
      testcasePath.unshift({
        value: testcase.value,
        label: testcase.label
      })
      this.$emit('updateCheckChildren',
        testcasePath,
        checked,
        this.countNotCheckNone,
        this.countNotCheckAll,
        this.index)
      this.$nextTick(() => {
        this.updateSum()
      })
    },
    updateCheckChildren (testcasePath, checked, countNotCheckNone, countNotCheckAll, index) {
      let testcase = this.testcasesWithChildrenOrNot[1][index]
      let newCheckAllChildren = cloneDeep(this.checkAllChildren)
      if (countNotCheckAll === 0) {
        if (!this.checkList.includes(testcase.label)) this.checkList.push(testcase.label)
        newCheckAllChildren[index] = this.checkBoxStatus.CHECK_ALL
      } else if (countNotCheckNone === 0) {
        if (this.checkList.includes(testcase.label)) this.checkList.splice(this.checkList.indexOf(testcase.label), 1)
        newCheckAllChildren[index] = this.checkBoxStatus.CHECK_NONE
      } else {
        if (this.checkList.includes(testcase.label)) this.checkList.splice(this.checkList.indexOf(testcase.label), 1)
        newCheckAllChildren[index] = this.checkBoxStatus.INDETERMINATE
      }
      this.checkAllChildren = cloneDeep(newCheckAllChildren)

      testcasePath.unshift({
        value: testcase.value,
        label: testcase.label
      })
      this.$emit('updateCheckChildren',
        testcasePath,
        checked,
        this.countNotCheckNone,
        this.countNotCheckAll,
        this.index)
    },
    updateSelected (testcasesSelected) {
      const _this = this
      this.checkList = []
      let checkAllChildrenCopy = cloneDeep(this.checkAllChildren)
      let checkChildrenCountCopy = cloneDeep(this.checkChildrenCount)
      let checkLeavesCopy = cloneDeep(this.checkLeaves)
      this.testcasesWithChildrenOrNot[1].forEach((testcase, index) => {
        let result = testcasesSelected.filter(testcaseSelected => {
          return isEqual(testcase.value, testcaseSelected[0].value)
        })
        if (result.length === 1 && result[0].length === 1) {
          _this.checkList.push(testcase.label)
          checkAllChildrenCopy[index] = _this.checkBoxStatus.CHECK_ALL
          checkChildrenCountCopy[index] = testcase.childrenCount
        } else if (result.length === 0) {
          checkAllChildrenCopy[index] = _this.checkBoxStatus.CHECK_NONE
          checkChildrenCountCopy[index] = 0
        } else {
          checkAllChildrenCopy[index] = _this.checkBoxStatus.INDETERMINATE
          if (!checkChildrenCountCopy[index]) {
            checkChildrenCountCopy[index] = 0
          }
        }
      })
      this.testcasesWithChildrenOrNot[0].forEach((testcase, index) => {
        let result = testcasesSelected.filter(testcaseSelected => {
          return isEqual(testcase.value, testcaseSelected[0].value)
        })
        if (result.length === 1) {
          _this.checkList.push(testcase.label)
          checkLeavesCopy[index] = true
        } else {
          checkLeavesCopy[index] = false
        }
      })
      this.checkAllChildren = cloneDeep(checkAllChildrenCopy)
      this.checkChildrenCount = cloneDeep(checkChildrenCountCopy)
      this.checkLeaves = cloneDeep(checkLeavesCopy)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
