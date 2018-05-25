<template>
  <div>
    <v-layout row>
      <v-flex
        col
        xs8>
        <h2>Subscribe Test Cases</h2>
        <p class="hint">
          Select test cases that you are concerned about
          <span v-if="testcasesSum > 0">
            ({{ testcasesSum }} test case{{ testcasesSum > 1 ? 's are selected' : ' is selected' }})
          </span>
        </p>
      </v-flex>
      <v-flex
        xs4
        class="text-xs-right">
        <v-btn
          :disabled="!isLoggedIn"
          color="primary"
          @click="isLoggedIn ? saveSubscribeTestCases() : null">
          Save Setting
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex
        xs1
        wrap>
        <div
          v-for="(header, index) in headers"
          :key="header"
          :style="headerStyle[index]"
          class="test-case-header">
          {{ header }}
        </div>
      </v-flex>
      <v-flex xs11>
        <select-testcase-tabs
          ref="selectTestcaseTabs"
          :testcases="testcasesCascade"
          :testcases-selected="testcasesSelected"
          :active="active"
          :indent="20"
          class="select-testcase-tabs"
          @offset-tabs="onOffsetTabs"
          @updateCheckChildren="updateCheckTestcases"
          @update-sum="onUpdateSum"/>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { mapGetters } from 'vuex'
import { submitNotice } from '@/components/InteractivePushMessage.vue'
import SelectTestcaseTabs from '@/components/forms/SelectTestcaseTabs.vue'
import testcasesapi from '@/api/testcases'
import utilTestcase from '@/utils/testcase'
import utilSelectCascade from '@/utils/selectCascade.js'
import settingsapi from '@/api/settings.js'

export default {
  components: {
    SelectTestcaseTabs
  },

  props: {
    branch: {
      type: String,
      default: 'develop'
    }
  },

  data: () => ({
    testcasesCascade: [],
    headers: [],
    headersWithModule: [
      'License',
      'Subsystem',
      'Module',
      'Test Case'
    ],
    headersWithoutModule: [
      'License',
      'Subsystem',
      'Test Case'
    ],
    headerStyle: [],
    active: false,
    testcasesSelected: [],
    testcasesSum: 0
  }),

  computed: {
    ...mapGetters('user', ['isLoggedIn'])
  },

  watch: {
    testcasesCascade () {
      if (this.testcasesCascade.length > 0) {
        this.active = true
      }
    }
  },

  created () {},
  async mounted () {
    this.updateTestcases()
    let ret = await getTestcases()
    if (ret && ret.success) {
      this.testcasesSelected = ret.testcases
    }
  },
  updated () {},
  destroyed () {},

  methods: {
    updateTestcases () {
      const _this = this
      testcasesapi.fetchAll(this.branch).then(res => {
        if (res.testcases) {
          _this.testcasesCascade = utilTestcase.testcasesToCascade(res.testcases, true).items
        }
      })
    },
    onOffsetTabs (offsetTabs) {
      let newHeaderStyle = []
      newHeaderStyle[0] = {
        height: `${offsetTabs[1]}px`
      }
      newHeaderStyle[1] = {
        height: `${offsetTabs[2] - offsetTabs[1]}px`
      }
      newHeaderStyle[2] = {
        height: 'auto'
      }
      if (offsetTabs.length === 4) {
        this.headers = this.headersWithModule
        newHeaderStyle[2] = {
          height: `${offsetTabs[3] - offsetTabs[2]}px`
        }
        newHeaderStyle[3] = {
          height: 'auto'
        }
      } else {
        this.headers = this.headersWithoutModule
      }
      this.headerStyle = cloneDeep(newHeaderStyle)
    },
    updateCheckTestcases (testcasePath, checked) {
      this.testcasesSelected = utilSelectCascade.updateCheckChildren(
        this.testcasesCascade,
        this.testcasesSelected,
        testcasePath,
        checked
      )
    },
    onUpdateSum (sum) {
      this.testcasesSum = sum
    },
    saveSubscribeTestCases () {
      const _this = this
      let saveData = saveSubscribeTestCases(this.testcasesSelected)
      submitNotice(saveData, this.$el).then(res => {
        if (res && res.success) {
          _this.$router.push({
            path: '/dashboard'
          })
        }
      })
    }
  }
}

const getTestcases = () => settingsapi.getTestcases()
const saveSubscribeTestCases = (testcases) => settingsapi.updateTestcases(testcases)
</script>

<style lang="scss">
.select-testcase-tabs {
  position: relative;

  .tabs__bar {
    border-bottom: solid 1px #dddddd;
    .tabs__div {
      width: 200px;
    }
  }

  .tabs__container {
    height: inherit;
    flex-wrap: wrap;
    flex: 0 1 auto;
  }
}
</style>

<style lang="scss" scoped>
.test-case-header {
  padding-top: 12px;
  font-weight: 600;
}
.hint {
  color: rgba(0, 0, 0, 0.38);
}
</style>
