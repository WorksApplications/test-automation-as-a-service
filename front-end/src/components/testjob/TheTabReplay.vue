<template>
  <v-card-text class="drag-area">
    <el-row :gutter="10">
      <el-col :span="6">
        <video-steps
          :steps="steps"
          :handler="platform !== 'api' ? setPosition : setRequest"
          :platform="platform"
          :current-position="currentPosition"
          :url="url"
          :exceptions="execStack.exceptions"
          view-type="replay"
          style="flex: 0 0 auto;" />
      </el-col>
      <!-- Replay Screen (Modified FLV-Maxi player) -->
      <el-col
        v-if="videoAvailable"
        :span="18"
        class="view-box replay-box"
        style="text-align: center;">
        <div class="fix-window">
          <object
            id="player"
            ref="player"
            :style="playerHW"
            type="application/x-shockwave-flash"
            data="../static/player_flv_maxi.swf"
            position="0">
            <param
              name="movie"
              value="../static/player_flv_maxi.swf">
            <param
              name="allowFullScreen"
              value="true" >
            <param
              :value="`playerId=player&amp;flv=/videos/${serial}.flv&amp;startimage=../static/title_logo.png&amp;margin=0&amp;bgcolor1=ffffff&amp;bgcolor2=ffffff&amp;showstop=1&amp;autoplay=1&amp;showtime=1&amp;showplayer=always&amp;showloading=always&amp;loadingcolor=aaaaaa&amp;slidercolor1=bbbbbb&amp;slidercolor2=bbbbbb&amp;sliderovercolor=ffffff&amp;showmouse=autohide`"
              name="FlashVars" >
          </object>
        </div>
        <div class="float-window">
          <div
            v-show="!isSeparated && currentExecStackIndex !== -1"
            class="drag-bar"
            draggable="true"
            title="Double Click To Switch Between Video and Code" />
          <code-viewer-exec
            id="code-viewer-exec"
            :exec-stack="execStack"
            :index="currentExecStackIndex"
            :current-position="currentPosition"
            :is-float="isFloat"
            :dropped="dropped"
            :is-separated="isSeparated"
            :branch="branch"
            view-type="replay"
            @change:exec="changeExec"
            @jump:exception="jumpToException"
            @backToFloat="backToFloat"/>
        </div>
        <el-button
          id="btn-full-screen"
          type="text"
          @click="fullscreen('player')">
          <i
            class="fa fa-television"
            aria-hidden="true" />
          Fullscreen
        </el-button>
      </el-col>
      <el-col
        v-if="platform === 'api'"
        :span="18"
        class="view-box replay-box">
        <div style="height: 293px; overflow-x: hidden; overflow-y: auto;">
          <el-collapse v-model="activeCollapseTabs">
            <el-collapse-item
              title="Request Header"
              name="reqHeader">
              <pre class="language-json code-block">
                <div v-html="currentRequestHeader" />
              </pre>
            </el-collapse-item>
            <el-collapse-item
              v-if="currentRequestBody"
              title="Request Body"
              name="reqBody">
              <pre class="language-json code-block">
                <div v-html="currentRequestBody" />
              </pre>
            </el-collapse-item>
            <el-collapse-item
              v-if="currentResponseHeader"
              title="Response Header"
              name="resHeader">
              <pre class="language-json code-block">
                <div v-html="currentResponseHeader" />
              </pre>
            </el-collapse-item>
            <el-collapse-item
              v-if="currentResponseBody"
              title="Response Body"
              name="resBody">
              <pre class="language-json code-block">
                <lazy-render>
                  <div v-html="currentResponseBody"/>
                  <div v-if="!responseBodyHighlightAvailable">{{ currentResponseBody }}</div>
                  <div slot="tip">Loading...</div>
                </lazy-render>
              </pre>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div style="padding-top: 20px;">
          <code-viewer-exec
            id="code-viewer-exec"
            :exec-stack="execStack"
            :index="currentExecStackIndex"
            :platform="platform"
            :branch="branch"
            view-type="replay"
            @change:exec="changeExec"
            @jump:exception="jumpToException"/>
        </div>
      </el-col>
      <el-col id="fix-code-viewer"/>
    </el-row>
  </v-card-text>
</template>

<script>
import VideoSteps from '@/components/testjob/TheVideoSteps.vue'
import CodeViewerExec from '@/components/testjob/TheCodeViewerExec.vue'
import utilListener from '@/utils/listener.js'
import utilPlatform from '@/utils/platforms.js'
// prismjs
import Prism from 'prismjs'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markup'
import prettifyXml from 'prettify-xml'

export default {

  components: {
    VideoSteps, CodeViewerExec
  },
  props: {
    serial: {
      type: Number,
      default: 0
    },
    platform: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    videoAvailable: {
      type: Boolean,
      default: true
    },
    steps: {
      type: Array,
      default: () => []
    },
    execStack: {
      type: Object,
      default: () => ({})
    },
    branch: {
      type: String,
      default: undefined
    }
  },

  data: () => ({
    currentPosition: 0,
    watchPosition: undefined,
    currentRequest: undefined,
    previousRequestStep: undefined,
    activeCollapseTabs: ['reqHeader', 'reqBody', 'resHeader', 'resBody'],
    draggedWindow: undefined,
    isFloat: true,
    dropped: true,
    isSeparated: false,
    exceptionJumped: false
  }),

  computed: {
    playerHW () {
      const size = utilPlatform.getVideoSize(utilPlatform.platformToNodeType(this.platform))
      if (this.platform === 'Android') {
        return {
          position: 'absolute',
          left: size.width / 2 + 'px',
          width: size.width + 'px',
          height: size.height + 'px'
        }
      } else {
        return {
          width: size.width + 'px',
          height: size.height + 'px'
        }
      }
    },
    currentResponseBody () {
      let result
      if (this.currentRequest && this.currentRequest.response) {
        result = beautifyBody(this.currentRequest.response.headers, this.currentRequest.response.body)
      } else {
        result = ''
      }
      return result.trim()
    },
    responseBodyHighlightAvailable () {
      return this.currentResponseBody &&
        this.currentResponseBody !== this.currentRequest.response.body
    },
    currentRequestBody () {
      let result
      if (this.currentRequest && this.currentRequest.request) {
        result = beautifyBody(this.currentRequest.request.headers, this.currentRequest.request.body)
      } else {
        result = ''
      }
      return result.trim()
    },
    requestBodyHighlightAvailable () {
      return this.currentRequestBody &&
        this.currentRequestBody !== this.currentRequest.request.body
    },
    currentRequestHeader () {
      if (this.currentRequest && this.currentRequest.request) { return Prism.highlight(beautifyJSON(this.currentRequest.request.headers), Prism.languages.json).trim() } else { return '' }
    },
    currentResponseHeader () {
      if (this.currentRequest && this.currentRequest.response) { return Prism.highlight(beautifyJSON(this.currentRequest.response.headers), Prism.languages.json).trim() } else { return '' }
    },
    currentExecStackIndex () {
      if (!this.execStack.execStack) return -1
      for (let i = 0; i < this.execStack.execStack.length; i++) {
        if (this.currentPosition < this.execStack.execStack[i].timestamp) {
          return i - 1
        }
      }
      return this.execStack.execStack.length - 1
    },
    currentStepIndex () {
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
    }
  },

  mounted () {
    if (this.videoAvailable) {
      let _this = this
      _this.watchPosition = setInterval(function () {
        let currentPosition = parseFloat(getAttr(_this.$refs.player.attributes, 'position'))
        if (Number.isInteger(currentPosition)) return
        _this.currentPosition = currentPosition
      }, 30)
    }
    if (this.platform === 'api') {
      // trigger the current step style update
      this.currentPosition = -0.1
      if (this.steps.length >= 1) {
        for (let i = 0; i < this.steps.length; i++) {
          if (this.steps[i].action !== 'Testcase') {
            this.currentRequest = this.steps[i].element
            this.responseBodyExpand = checkExpandBody(this.currentRequest.response)
            break
          }
        }
      }
    }
    if (this.platform !== 'api') {
      utilListener.addCodeViewerListeners(this)
    }
  },

  destroyed () {
    clearInterval(this.watchPosition)
  },

  methods: {
    setPlayerPosition (second) {
      const player = this.$refs.player
      if (typeof second === 'number') {
        player.SetVariable('player:jsPause', '')
        player.SetVariable('player:jsSetPosition', Math.round(second))
        this.currentPosition = second
      }
    },
    changeExec (index) {
      if (this.platform === 'api') {
        this.currentPosition = this.execStack.execStack[index].timestamp
        this.currentRequest = this.steps[this.currentStepIndex].element
        this.responseBodyExpand = checkExpandBody(this.currentRequest.response)
      } else {
        this.setPlayerPosition(this.execStack.execStack[index].timestamp)
      }
    },
    jumpToException (timestamp) {
      if (this.platform === 'api') {
        this.currentPosition = timestamp
        this.currentRequest = this.steps[this.currentStepIndex].element
        this.responseBodyExpand = checkExpandBody(this.currentRequest.response)
      } else {
        this.setPlayerPosition(timestamp)
      }
    },
    setPosition (step) {
      this.setPlayerPosition(step.timestamp)
    },
    getPosition () {
      return this.currentPosition
    },
    fullscreen (id) {
      const target = document.getElementById(id)
      try {
        target.webkitRequestFullScreen()
      } catch (e) {
        return false
      }
    },
    setRequest (step) {
      this.currentRequest = step.element
      this.currentPosition = step.timestamp
      this.responseBodyExpand = checkExpandBody(this.currentRequest.response)
    },
    backToFloat () {
      utilListener.backToFloat(this)
    }
  }
}

const getAttr = (attributes, attrName) => {
  let matchedAttribute = Array.from(attributes)
    .find((attribute) => attribute.name === attrName)
  if (matchedAttribute) {
    return matchedAttribute.value
  }
  return null
}

const beautifyJSON = value => {
  let obj = JSON.parse(value)
  return JSON.stringify(obj, null, 4)
}

const beautifyBody = (request, body) => {
  const headers = JSON.parse(request || {})
  if (headers['content-type'] && body) {
    const contentType = headers['content-type']
    if (contentType.indexOf('application/json') !== -1) {
      return Prism.highlight(beautifyJSON(body), Prism.languages.json)
    } else if (contentType.indexOf('html') !== -1 || contentType.indexOf('xml') !== -1) {
      return Prism.highlight(prettifyXml(body, { indent: 1, newlint: '\n' }), Prism.languages.markup)
    }
  }
  return body
}

const checkExpandBody = response => {
  if (response && response.body) {
    return response.body.length <= 1500
  }
  return false
}

</script>

<style scoped>
  .replay-box {
    flex: 1 1 auto;
    word-break: break-all;
    justify-content: center;
    align-items: center;
  }
  #player:-webkit-full-screen {
    width: 100vw !important;
    height: 100vh !important;
  }
  .code-block {
    max-width: 996px;
    max-height: 300px;
    overflow: auto;
  }
</style>
