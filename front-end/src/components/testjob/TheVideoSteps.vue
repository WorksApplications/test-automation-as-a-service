<template>
  <v-card class="elevation-0">
    <v-toolbar
      color="primary"
      dark
      class="elevation-0">
      <v-toolbar-side-icon>
        <v-icon>timeline</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title>Steps</v-toolbar-title>
      <v-spacer />
      Track the steps of your tests
    </v-toolbar>
    <v-list
      id="step-list"
      dense
      two-line
      style="height: 523px; overflow-y: scroll;">
      <template v-for="(step, index) in steps">
        <v-divider
          v-if="index > 0"
          :key="`divider-${index}`" />
        <v-list-tile
          v-if="step.action === 'Testcase'"
          :key="`steps-${index}`"
          :id="`steps-${index}`"
          :class="getTitleClass(step.inputValue)">
          <v-list-tile-avatar>
            <v-icon>{{ getTestCaseIcon(step.inputValue) }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              Test case ({{ step.inputValue }})
              <span
                v-if="exceptions[replacePointWithSlash(step.element.value)]"
                :class="{'exception-link': viewType === 'replay'}"
                :title="exceptions[replacePointWithSlash(step.element.value)].message"
                @click="viewType === 'replay' ? jumpToException(step.element.value) : null">
                {{ exceptions[replacePointWithSlash(step.element.value)].message }}
              </span>
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <v-tooltip bottom>
                <span slot="activator">{{ step.element.value }}</span>
                <span>{{ step.element.value }}</span>
              </v-tooltip>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-else
          :key="`steps-${index}`"
          :id="`steps-${index}`"
          :class="getStepClass(index)"
          ripple
          @click="handler(step)">
          <v-list-tile-content>
            <v-list-tile-title>
              <span>
                {{ step.action }}
              </span>
              <span style="max-width: 250px; float: right; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ step.inputValue }}</span>
            </v-list-tile-title>
            <v-list-tile-sub-title
              v-if="step.element && step.element.value">
              {{ `${step.element.value} (${step.element.using})` }}
            </v-list-tile-sub-title>
            <v-list-tile-sub-title
              v-else>
              &nbsp;
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-card>
</template>

<script>
import { EventBus } from '@/utils/eventBus.js'

export default {
  components: {},

  filters: {
    truncateHost (value, url) {
      if (!value) {
        return ''
      }
      let tempString = value.toString().replace(url, '')
      if (!tempString.startsWith('/')) {
        tempString = '/' + tempString
      }
      return tempString
    }
  },

  props: {
    steps: {
      type: Array,
      default: () => []
    },
    handler: {
      type: Function,
      default: () => ({})
    },
    viewType: {
      type: String,
      default: undefined
    },
    platform: {
      type: String,
      default: ''
    },
    currentPosition: {
      type: Number,
      default: 0
    },
    url: {
      type: String,
      default: undefined
    },
    exceptions: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    currentStepIndex: 0,
    autoScroll: true
  }),

  computed: {},

  watch: {
    currentPosition: function (val) {
      this.currentStepIndex = this.getCurrentStepIndex()
    },
    currentStepIndex: function (val) {
      this.scrollToCurrent(this.autoScroll)
    }
  },

  mounted () {},

  updated () {},

  methods: {
    replacePointWithSlash (testcase) {
      return testcase.replace(/\./g, '/')
    },
    jumpToException (testcase) {
      EventBus.$emit('jump-to-exception', testcase)
    },
    getCurrentStepIndex () {
      if (this.viewType === 'live') {
        return this.steps.length - 1
      }
      let lastIndex = 0
      let currentTestCaseStartTime
      for (let index = 0; index < this.steps.length; index++) {
        const step = this.steps[index]
        if (step.action !== 'Testcase') {
          if (this.currentPosition <= step.timestamp) {
            if (!currentTestCaseStartTime || this.currentPosition > currentTestCaseStartTime) return index
            else return lastIndex
          } else {
            lastIndex = index
          }
        } else {
          currentTestCaseStartTime = step.timestamp
        }
      }
      return this.steps.length - 1
    },

    scrollToCurrent (forced) {
      if (forced === false) {
        return
      }
      if (this.viewType !== 'live') {
        const stepListTop = document.getElementById('step-list').getBoundingClientRect().top
        const stepTop = document.getElementById(`steps-${this.currentStepIndex}`).getBoundingClientRect().top
        const stepListDom = this.$el.children[1]
        stepListDom.scrollTop += stepTop - stepListTop - 150
      }
    },

    getTitleClass (verdict) {
      if (verdict === 'PASSED') {
        return 'test-case-success'
      } else if (verdict === 'FAILED') {
        return 'test-case-failed'
      } else if (verdict === 'CANCELED') {
        return 'test-case-cancelled'
      } else if (verdict === 'RUNNING') {
        return 'test-case-running'
      }
    },
    getTestCaseIcon (verdict) {
      if (verdict === 'PASSED') {
        return 'check_circle'
      } else if (verdict === 'FAILED') {
        return 'error'
      } else if (verdict === 'CANCELED') {
        return 'cancel'
      } else if (verdict === 'RUNNING') {
        return 'timelapse'
      }
    },
    getStepClass (stepIndex) {
      if (stepIndex === this.currentStepIndex) {
        return 'active'
      } else {
        return 'default'
      }
    }

  }

}
</script>

<style lang="scss" scoped>

  .steps-title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    background-color: #eeeeee;
    color: #4db6ac;
    height: 50px;
    border: 1px solid lightgrey;
    padding: 0 20px;

    h4 {
      padding: 0;
      text-align: left;
    }
    small {
      font-size: 12px;
      text-align: right;
      color: grey;
    }

  }

  .exception-link {
    overflow: hidden;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }

  .active {
    background-color: rgb(255, 250, 205);
    background-image: url("/static/task-running.gif");
    background-size: 27px 42px;
    background-repeat: no-repeat;
    background-position: right;
  }
  .test-case-success {
    background-color: rgb(210, 236, 184);
    color: rgb(84, 171, 0);
  }
  .test-case-failed {
    background-color: rgb(255, 208, 208);
    color: rgb(208, 36, 36);
  }
  .test-case-cancelled {
    background-color: rgb(238, 238, 238);
    color: rgb(99, 99, 99);
  }
  .test-case-running {
    background-color: rgb(202, 231, 249);
    color: rgb(30, 162, 245);
  }
</style>
