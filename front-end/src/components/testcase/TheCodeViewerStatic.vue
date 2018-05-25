<template>
  <span>
    <span
      class="code-icon"
      @click="prepareCode">
      <span class="fa fa-code fa-lg" />
      <el-tooltip md-direction="top">View code</el-tooltip>
    </span>
    <el-dialog
      :visible.sync="codeDialogVisible"
      :show-close="false"
      :modal-append-to-body="false"
      width="80%">
      <v-layout row>
        <v-flex xs8>
          <v-breadcrumbs>
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item
              v-for="code in codeStack"
              :key="code.class + code.startLine">
              <span @click="popCode(code)">
                {{ code.class }}
              </span>
            </v-breadcrumbs-item>
          </v-breadcrumbs>
        </v-flex>
        <v-flex
          xs4
          class="text-xs-right">
          <el-button-group>
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
              size="small"
              type="primary"
              @click="goGitlabTestcases(codeStack)">
              <i class="fa fa-gitlab" /> View Gitlab
            </el-button>
          </el-button-group>
        </v-flex>
      </v-layout>
      <pre
        :style="{ 'counter-reset': lineStart }"
        class="language-java line-numbers">
        <div
          class="code-viewer__code fix-height"
          @click="goToMethodDef($event)"
          v-html="highlightedCode" />
      </pre>
    </el-dialog>
  </span>
</template>

<script>
import Prism from 'prismjs'
import { mapState } from 'vuex'
import utilTestCode from '@/utils/testcode.js'
// prism
import 'prismjs/themes/prism-coy.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/components/prism-java'
import 'prismjs/plugins/line-numbers/prism-line-numbers'

export default {

  name: 'CodeViewerStatic',

  props: {
    branch: {
      type: String,
      required: true
    },
    dialog: {
      type: Boolean,
      default: true
    },
    testcase: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    codeDialogVisible: false,
    displayedFullCode: false,
    codeStack: [],
    currentCode: {},
    displayedCode: '',
    methodCalls: undefined
  }),
  computed: {
    highlightedCode () {
      const html = Prism.highlight(this.displayedCode, Prism.languages.java)
      let htmlWithMethodCallRef
      if (this.displayedFullCode) {
        htmlWithMethodCallRef = this.insertMethodCallRef(html)
      } else {
        htmlWithMethodCallRef = this.insertMethodCallRef(html, this.currentCode.startLine, this.currentCode.endLine)
      }
      return this.insertLineNumber(htmlWithMethodCallRef)
    },
    lineStart () {
      if (this.displayedFullCode) {
        return 'linenumber'
      } else {
        return 'linenumber ' + (this.currentCode.startLine - 1)
      }
    },
    ...mapState('testcode', [
      'codes'
    ])
  },
  watch: {},

  created () {},
  mounted () {},
  updated () {
    // Regenerate line number
    Prism.highlightAll()
  },
  destroyed () {},

  methods: {
    prepareCode (callee) {
      const _this = this
      const testcase = this.testcase
      const className = testcase.locator.split('#')[0]
      let tmpCode = {}
      if (callee.class !== undefined) {
        tmpCode = callee
      } else {
        this.codeStack = []
        tmpCode = {
          startLine: testcase.start_line,
          endLine: testcase.end_line,
          class: className
        }
      }
      let code = _this.codes.find((ele) => ele.class === tmpCode.class)
      if (!code) {
        _this.$store.dispatch('testcode/updateCode', { branch: _this.branch, class: tmpCode.class }).then(() => {
          code = _this.codes.find((ele) => ele.class === tmpCode.class)
          tmpCode.code = code.code
          this.methodCalls = code.calls
          tmpCode = utilTestCode.getCodeWithRealStartEndLine(tmpCode)
          tmpCode.codeFragment = utilTestCode.extractCodeFragment(tmpCode.code, tmpCode.startLine, tmpCode.endLine)
          _this.currentCode = tmpCode
          _this.codeDialogVisible = true
          _this.viewMethodCode()
          _this.codeStack.push(tmpCode)
        })
      } else {
        tmpCode.code = code.code
        this.methodCalls = code.calls
        tmpCode = utilTestCode.getCodeWithRealStartEndLine(tmpCode)
        tmpCode.codeFragment = utilTestCode.extractCodeFragment(tmpCode.code, tmpCode.startLine, tmpCode.endLine)
        _this.currentCode = tmpCode
        _this.codeDialogVisible = true
        _this.viewMethodCode()
        _this.codeStack.push(tmpCode)
      }
    },
    viewFullCode () {
      this.displayedCode = this.currentCode.code
      this.displayedFullCode = true
    },
    viewMethodCode () {
      this.displayedCode = this.currentCode.codeFragment
      this.displayedFullCode = false
    },
    goToMethodDef (event) {
      if (event.target.nodeName === 'A') {
        const params = event.target.id.split('-')
        let callee = {
          startLine: parseInt(params[2]),
          endLine: parseInt(params[3]),
          class: params[1]
        }
        this.prepareCode(callee)
      }
    },
    insertMethodCallRef (html, startLine, endLine) {
      const lines = html.split('\n')
      for (let i in this.methodCalls) {
        const call = this.methodCalls[i]
        const line = call.caller.line
        if ((startLine === undefined && endLine === undefined) || (line >= startLine && line <= endLine)) {
          const lineReal = startLine === undefined ? line - 1 : line - startLine
          const lineCur = lines[lineReal]
          let column = call.caller.column
          column = this.getRealColumnInHTML(lineCur, column)
          const tagSpanEnd = '</span>'
          const spanBracket = '<span class="token punctuation">(</span>'
          const spanFunction = '<span class="token function">'
          let endColumn = column + lineCur.substring(column).indexOf(spanBracket)
          let startColumn = column - 1
          startColumn += spanFunction.length
          endColumn -= tagSpanEnd.length
          const callee = call.callee
          // Add <a> tag
          lines[lineReal] =
              [
                lineCur.slice(0, startColumn),
                `<a id="${callee.module}-${callee.class}-${callee.start}-${callee.end}" class="code-functions">`,
                lineCur.slice(startColumn, endColumn),
                '</a>',
                lineCur.slice(endColumn)
              ].join('')
        }
      }
      return lines.join('\n')
    },
    getRealColumnInHTML (lineCur, column) {
      let pos = 0
      let spanStartLeft = 0
      const tagSpanEnd = '</span>'
      const tagAEnd = '</a>'
      while (spanStartLeft + 1 < column) {
        // Add length of <span> tag
        spanStartLeft = pos + lineCur.substring(pos).indexOf('<span ')
        if (spanStartLeft + 1 >= column) {
          break
        }
        let spanStartRight = spanStartLeft + lineCur.substring(spanStartLeft).indexOf('>') + 1
        let spanEnd = spanStartRight + lineCur.substring(spanStartRight).indexOf(tagSpanEnd)
        pos = spanEnd + tagSpanEnd.length
        // Add length of <a> tag (<a> tag is inserted by previous method call ref)
        let tagAStart = lineCur.substring(spanStartRight, spanEnd).indexOf('<a ')
        if (tagAStart !== -1) {
          let aStartRight = lineCur.substring(spanStartRight + tagAStart).indexOf('>') + 1
          column += spanStartRight - spanStartLeft + tagSpanEnd.length + aStartRight + tagAEnd.length
        } else {
          column += spanStartRight - spanStartLeft + tagSpanEnd.length
        }
      }
      return column
    },
    insertLineNumber (html) {
      let lineCount = html.split('\n').length - 1
      let spanLineNumbers = '<span aria-hidden="true" class="line-numbers-rows">'
      while (lineCount--) {
        spanLineNumbers += '<span></span>'
      }
      spanLineNumbers += '</span>'
      return html + spanLineNumbers
    },
    popCode (code) {
      let curCode = {}
      do {
        if (this.codeStack === []) {
          break
        }
        curCode = this.codeStack.pop()
      } while (curCode !== code)
      this.prepareCode(curCode)
    },
    goGitlabTestcases (codeStack) {
      let relativePath = codeStack[codeStack.length - 1].class.replace(/\./g, '/')
      window.open(`https://scm.hue.workslan/tools/hue-auto-tests/tree/${this.branch}/main/src/main/java/${relativePath}.java`)
    }
  }

}

</script>

<style lang="scss" scoped>
  .code-className {
    margin-top: 10px;
    color: #1570a0;
    font-size: 15px;
    display: inline-block;
  }

  .code-icon {
    color: #4db6ac;
    &:hover {
      cursor: pointer;
    }
  }

  .gitlab-link {
    color: #20a0ff;
    float: right;
    width: auto !important;
  }

  .fix-height {
    max-height: 500px;
    overflow: auto;
  }

  .code-viewer__code {
    position: relative;
    padding-left: 3.8em;
    border-left: 10px solid #358ccb;
    box-shadow: -1px 0px 0px 0px #358ccb, 0px 0px 0px 1px #dfdfdf;
    background-color: #fdfdfd;
    background-image: linear-gradient(transparent 50%, rgba(69, 142, 209, 0.04) 50%);
    background-size: 3em 3em;
    background-origin: content-box;
    background-attachment: local;
    background-repeat: initial;
  }

  .breadcrumbs {
    padding: 4px;
  }
</style>
<style lang="scss">
  span.token.function > a.code-functions {
    text-decoration: underline dashed;
    &:hover {
      cursor: pointer;
    }
  }
</style>
