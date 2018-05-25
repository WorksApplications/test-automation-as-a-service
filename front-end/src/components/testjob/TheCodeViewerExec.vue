<template>
  <div
    v-if="currentExecLocation !== null"
    :style="{width: isFloat && platform !== 'api' ? '100%' : '99.99%', height: 'auto'}">
    <div class="code-controller">
      <el-button-group v-if="!isFloat">
        <el-button
          :round="true"
          :plain="true"
          :disabled="isFirstExec"
          size="small"
          type="primary"
          @click="previousExec">
          <i class="fa fa-step-backward" />
        </el-button>
        <el-button
          :round="true"
          :plain="true"
          :disabled="isLastExec"
          size="small"
          type="primary"
          @click="nextExec">
          <i class="fa fa-step-forward" />
        </el-button>
      </el-button-group>
      <el-button-group v-if="!isFloat">
        <el-button
          v-if="!displayedFullCode"
          :round="true"
          :plain="true"
          size="small"
          type="primary"
          @click="viewFullCode">
          <i class="fa fa-toggle-down" /> View Full Code
        </el-button>
        <el-button
          v-if="displayedFullCode"
          :round="true"
          :plain="true"
          size="small"
          type="primary"
          @click="viewMethodCode">
          <i class="fa fa-toggle-up" /> View Method
        </el-button>
        <el-button
          :round="true"
          :plain="true"
          :disabled="isTracing"
          size="small"
          type="primary"
          @click="backToExec">
          <i class="fa fa-map-marker" /> Back to Execution
        </el-button>
        <el-button
          v-if="isSeparated"
          :round="true"
          :plain="true"
          size="small"
          type="primary"
          @click="backToFloat">
          <i class="fa fa-window-restore" /> Back to Float Window
        </el-button>
      </el-button-group>
    </div>
    <pre
      id="pre-exec"
      :class="{ 'float-code-viewer': isFloat }"
      :style="stylePre"
      :data-start="displayedFullCode ? 1 : currentMethodStart"
      class="language-java line-numbers"
      style="margin: 0">
      <code
        ref="codeViewer"
        :style="codeViewer"
        class="hljs language-java"
        v-html="highlightedCode" />
    </pre>
  </div>
</template>

<script>
import Prism from 'prismjs'
import utilTestCode from '@/utils/testcode.js'
import UtilsPropsValidator from '@/utils/propsValidator.js'
import { EventBus } from '@/utils/eventBus.js'
import UtilHighlightLine from '@/utils/highlightLine.js'
import testcasesapi from '@/api/testcases'
// prism
import 'prismjs/themes/prism-coy.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/components/prism-java'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/line-highlight/prism-line-highlight.css'
import 'prismjs/plugins/line-highlight/prism-line-highlight'

export default {

  name: 'CodeViewerExec',

  props: {
    execStack: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: -1
    },
    currentPosition: {
      type: Number,
      default: 0
    },
    viewType: {
      type: String,
      required: true,
      validator: UtilsPropsValidator.viewType
    },
    platform: {
      type: String,
      default: ''
    },
    isFloat: {
      type: Boolean,
      default: false
    },
    dropped: {
      type: Boolean,
      default: true
    },
    isSeparated: {
      type: Boolean,
      default: false
    },
    branch: {
      type: String,
      default: undefined
    }
  },

  data: () => ({
    displayedFullCode: false,
    currentExecLocation: null,
    currentExecCode: null,
    currentMethodStart: null,
    currentMethodEnd: null,
    scrollOffset: 0,
    hasUserScrollListener: false,
    updatedByUserScroll: false,
    isTracing: true,
    normalMaxLine: 23,
    floatMaxLine: 10,
    lineHeight: 21,
    dropChanged: false,
    lineBackground: {
      executing: '-webkit-gradient(linear, left top, right top, from(#4db6ac4d), to(#4db6ac1a))',
      exception: '-webkit-gradient(linear, left top, right top, from(#f10e0e4d), to(#f10e0e1a))'
    },
    testcases: []
  }),

  computed: {
    stylePre () {
      if (this.isFloat) {
        return {
          height: (this.currentCodeEnd - this.currentCodeStart + 1) * this.lineHeight + 'px',
          'max-height': this.maxHeight + 'px'
        }
      } else {
        return {
          height: 'auto',
          'max-height': 'none'
        }
      }
    },
    codeViewer () {
      if (this.isFloat) {
        return {
          'max-height': this.maxHeight + 'px',
          overflow: 'hidden',
          'box-shadow': 'none'
        }
      } else {
        return {
          'max-height': this.maxHeight + 'px',
          overflow: 'auto',
          'box-shadow': '-1px 0px 0px 0px #358ccb, 0px 0px 0px 1px #dfdfdf'
        }
      }
    },
    maxHeight () {
      return this.maxLine * this.lineHeight
    },
    maxLine () {
      return this.isFloat || this.platform === 'api' ? this.floatMaxLine : this.normalMaxLine
    },
    isFirstExec () {
      return this.viewType === 'live' || this.index === 0 || this.currentExecLocation.timestamp === 0
    },
    isLastExec () {
      return this.viewType === 'live' || this.index === this.execStack.execStack.length - 1
    },
    currentCodeStart () {
      if (this.displayedFullCode && !this.isFloat) {
        return 1
      } else {
        return this.currentMethodStart
      }
    },
    currentCodeEnd () {
      if (this.displayedFullCode && !this.isFloat) {
        return this.currentExecCode.split('\n').length
      } else {
        return this.currentMethodEnd
      }
    },
    codeFragment () {
      if (this.isFloat || (!this.displayedFullCode && this.currentMethodStart && this.currentMethodEnd)) {
        return utilTestCode.extractCodeFragment(this.currentExecCode, this.currentMethodStart, this.currentMethodEnd)
      } else {
        return this.currentExecCode
      }
    },
    isTaasSetupClass () {
      return !this.currentExecLocation.lineCall && this.currentExecLocation.class.startsWith('taas.')
    },
    isTestCaseClass () {
      return !this.currentExecLocation.lineCall && !this.currentExecLocation.class.startsWith('taas.')
    },
    highlightedCode () {
      const html = Prism.highlight(this.codeFragment, Prism.languages.java)
      return html
    },
    highlightLine () {
      if (this.currentExecLocation) {
        return this.currentExecLocation.line + (this.isFloat ? 0 : 1)
      } else {
        return 1
      }
    }
  },

  watch: {
    index: function (newIndex) {
      if (!this.currentPosition) {
        this.updateCurrentExec(newIndex)
        if (!document.querySelector('.line-highlight')) {
          this.highlightExecAndException()
        }
      }
    },
    currentPosition: function (newPosition) {
      this.updateCurrentExec(this.index)
      if (!document.querySelector('.line-highlight')) {
        this.highlightExecAndException()
      }
    },
    dropped: function (newDropped) {
      this.dropChanged = true
      if (newDropped) {
        this.isTracing = true
        this.scrollToCode()
      }
    },
    branch: function () {
      this.updateTestcases()
      this.updateCurrentExec(this.index)
    }
  },

  async mounted () {
    const _this = this
    await _this.updateTestcases()
    _this.updateCurrentExec(_this.index)
    EventBus.$on('jump-to-exception', testcase => {
      const exception = _this.execStack.exceptions[testcase.replace(/\./g, '/')]
      _this.$emit('jump:exception', exception.timestamp)
      _this.$nextTick(function () {
        _this.currentExecLocation = exception
        _this.currentExecCode = this.execStack.codes[_this.currentExecLocation.class.replace(/\./g, '/')]
        _this.updateMethodRange()
      })
    })
  },

  destroyed () {
    EventBus.$off('jump-to-exception')
  },

  updated () {
    let codeViewer = this.$refs.codeViewer
    if (codeViewer && !this.hasUserScrollListener) {
      codeViewer.addEventListener('wheel', this.handleMouseWheel, false)
      window.addEventListener('keydown', this.handleKeyDown, false)
      codeViewer.addEventListener('mousedown', this.handleMouseDown, false)
      this.hasUserScrollListener = true
      this.scrollToCode()
    }
    if (this.currentExecLocation) {
      if (this.dropChanged && this.dropped) {
        this.scrollToCode()
        this.dropChanged = false
      } else if (this.isTracing || this.isFloat) {
        if (!this.updatedByUserScroll) this.scrollToCode()
        else this.updatedByUserScroll = false
      }

      // Regenerate line number and line highlight
      try {
        Prism.highlightAll()
      } catch (e) {
        if (e.message !== 'Invalid array length') {
          throw e
        }
      }
      this.highlightExecAndException()
    }
  },

  methods: {
    backToFloat () {
      this.$emit('backToFloat')
    },
    previousExec () {
      this.$emit('change:exec', this.index - 1)
      this.isTracing = true
      this.updatedByUserScroll = false
    },
    nextExec () {
      this.$emit('change:exec', this.index + 1)
      this.isTracing = true
      this.updatedByUserScroll = false
    },
    backToExec () {
      this.isTracing = true
      this.updatedByUserScroll = false
      this.scrollToCode()
    },
    viewFullCode () {
      this.displayedFullCode = true
      this.backToExec()
    },
    viewMethodCode () {
      this.displayedFullCode = false
      this.backToExec()
    },
    async updateTestcases () {
      let res = await testcasesapi.fetchAll(this.branch)
      if (res.testcases) {
        this.testcases = res.testcases
      }
    },
    updateCurrentExec (index) {
      if (index >= 0) {
        this.currentExecLocation = this.execStack.execStack[index]
        this.currentExecCode = this.execStack.codes[this.currentExecLocation.class.replace(/\./g, '/')]
        this.updateMethodRange()
      } else {
        this.currentExecLocation = null
        this.currentExecCode = null
        this.currentMethodStart = null
        this.currentMethodEnd = null
      }
    },
    updateMethodRange () {
      const _this = this
      if (!_this.currentExecLocation || _this.isTaasSetupClass) {
        _this.currentMethodStart = 1
        _this.currentMethodEnd = _this.currentExecCode.split('\n').length
      } else if (_this.isTestCaseClass) {
        const locator = _this.currentExecLocation.class + '#' + _this.currentExecLocation.method
        const testcase = utilTestCode.findTestCaseByLocator(locator, _this.testcases)
        let realStartEndLine = utilTestCode.getCodeWithRealStartEndLine({
          code: this.currentExecCode,
          start_line: testcase.start_line,
          end_line: testcase.end_line
        })
        _this.currentMethodStart = realStartEndLine.start_line
        _this.currentMethodEnd = realStartEndLine.end_line
      } else {
        let classPath = _this.currentExecLocation.class.replace(/\./g, '/')
        let methodName = _this.currentExecLocation.method
        const methodRange = _this.execStack.methods[classPath][methodName]
        let realStartEndLine = utilTestCode.getCodeWithRealStartEndLine({
          code: this.currentExecCode,
          start_line: methodRange.start,
          end_line: methodRange.end
        })
        _this.currentMethodStart = realStartEndLine.start_line
        _this.currentMethodEnd = realStartEndLine.end_line
      }
    },
    highlightExecAndException () {
      let pre = document.querySelector('#pre-exec')
      if (!pre) return
      UtilHighlightLine.highlightLine(pre, this.currentExecLocation.line, this.lineBackground.executing)
      for (let testcase in this.execStack.exceptions) {
        let exception = this.execStack.exceptions[testcase]
        if (this.displayedFullCode) {
          if (exception.class === this.currentExecLocation.class) {
            UtilHighlightLine.highlightLine(pre, exception.line, this.lineBackground.exception)
          }
        } else if (exception.class === this.currentExecLocation.class &&
            exception.method === this.currentExecLocation.method) {
          UtilHighlightLine.highlightLine(pre, exception.line, this.lineBackground.exception)
          break
        }
      }
    },
    scrollToCode () {
      let codeViewer = this.$refs.codeViewer
      let codeOffset = this.currentExecLocation.line - this.currentCodeStart
      if (this.currentCodeEnd - this.currentCodeStart > this.maxLine && codeOffset >= this.maxLine / 2) {
        let offset = 0
        let codeToEnd = this.currentCodeEnd - this.currentExecLocation.line
        if (codeToEnd > this.maxLine / 2) {
          offset = (codeOffset - this.maxLine / 2) * this.lineHeight
        } else {
          offset = (codeOffset - this.maxLine + codeToEnd) * this.lineHeight
        }
        codeViewer.scrollTop = offset
        this.scrollOffset = offset
      } else {
        codeViewer.scrollTop = 0
        this.scrollOffset = 0
      }
    },
    scrollByUser () {
      if (this.currentCodeEnd - this.currentCodeStart > this.maxLine) {
        this.updatedByUserScroll = true
        this.isTracing = false
      }
    },
    handleMouseWheel () {
      this.scrollByUser()
    },
    handleKeyDown (event) {
      if (
        event.key === 'ArrowUp' ||
          event.key === 'ArrowDown' ||
          event.key === 'Space' ||
          event.key === 'PageUp' ||
          event.key === 'PageDown' ||
          event.key === 'Home' ||
          event.key === 'End' ||
          (event.ctrlKey && event.key === 'Home') ||
          (event.ctrlKey && event.key === 'End')
      ) {
        this.scrollByUser()
      }
    },
    handleMouseDown (event) {
      this.scrollByUser()
    }
  }
}

</script>

<style lang="scss">
  .float-code-viewer {
    font-size: 12px;
  }
  .float-code-viewer code {
    top: -18px;
  }
  .float-code-viewer::before {
    content: none !important;
  }
  .float-code-viewer::after {
    content: none !important;
  }
  .code-controller {
    display: flex;
    display: -webkit-flex;
    justify-content:space-between;
    flex-wrap: wrap;
  }
</style>
