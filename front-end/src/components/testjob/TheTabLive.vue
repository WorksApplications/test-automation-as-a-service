<template>
  <v-card-text class="drag-area">
    <el-row :gutter="10">
      <el-col :span="6">
        <video-steps
          :steps="steps"
          :platform="platform"
          :exceptions="execStack.exceptions"
          :current-position="steps.length - 1"
          view-type="live" />
      </el-col>
      <el-col
        v-if="videoAvailable"
        :span="18"
        class="view-box live-box"
        style="text-align: center;">
        <div class="fix-window">
          <live-window
            v-if="vncHost && vncPort"
            id="live"
            :style="playerHW"
            :host="vncHost"
            :port="vncPort"
            :password="vncPassword"
            :node-type="nodeType" />
        </div>
        <div class="float-window">
          <div
            v-show="!isSeparated && currentExecStackIndex !== -1"
            class="drag-bar"
            draggable="true"
            title="Double Click To Switch Between Video and Code"/>
          <code-viewer-exec
            id="code-viewer-exec"
            :exec-stack="execStack"
            :index="currentExecStackIndex"
            :is-float="isFloat"
            :dropped="dropped"
            :is-separated="isSeparated"
            :branch="branch"
            view-type="live"
            @backToFloat="backToFloat"/>
        </div>
        <el-button
          id="btn-full-screen"
          type="text"
          @click="fullscreen('live')">
          <i
            class="fa fa-television"
            aria-hidden="true" />
          Fullscreen
        </el-button>
      </el-col>
      <el-col
        v-else
        :span="18"
        class="view-box live-box">
        <div
          v-if="currentRequest"
          style="height: 293px; overflow-x: hidden; overflow-y: auto;">
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
            view-type="live" />
        </div>
      </el-col>
      <el-col id="fix-code-viewer"/>
    </el-row>
  </v-card-text>
</template>

<script>

import Prism from 'prismjs'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markup'
import prettifyXml from 'prettify-xml'

import VideoSteps from '@/components/testjob/TheVideoSteps.vue'
import LiveWindow from '@/components/LiveWindow.vue'
import CodeViewerExec from '@/components/testjob/TheCodeViewerExec.vue'
import utilListener from '@/utils/listener.js'
import utilPlatform from '@/utils/platforms.js'

export default {

  components: {
    VideoSteps, LiveWindow, CodeViewerExec
  },
  // Todo: Fix the properties
  props: {
    vncHost: {
      type: String,
      default: undefined
    },
    vncPort: {
      type: String,
      default: undefined
    },
    vncPassword: {
      type: String,
      default: undefined
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
    activeCollapseTabs: ['reqHeader', 'reqBody', 'resHeader', 'resBody'],
    draggedWindow: undefined,
    isFloat: true,
    dropped: true,
    isSeparated: false
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
    nodeType () {
      return utilPlatform.platformToNodeType(this.platform)
    },
    currentExecStackIndex () {
      return this.execStack.execStack ? this.execStack.execStack.length - 1 : -1
    },
    currentRequest () {
      if (this.steps.length <= 1) {
        return null
      }
      for (let i = this.steps.length - 1; i >= 0; i--) {
        if (this.steps[i].action !== 'Testcase') {
          return this.steps[i].element
        }
      }
    },
    currentResponseBody () {
      if (!this.currentRequest.response) {
        return undefined
      }
      const result = beautifyBody(this.currentRequest.response.headers, this.currentRequest.response.body)
      return result.trim()
    },
    responseBodyHighlightAvailable () {
      return this.currentResponseBody !== this.currentRequest.response.body
    },
    currentRequestBody () {
      if (!this.currentRequest.request) {
        return undefined
      }
      const result = beautifyBody(this.currentRequest.request.headers, this.currentRequest.request.body)
      return result.trim()
    },
    requestBodyHighlightAvailable () {
      return this.currentRequestBody !== this.currentRequest.request.body
    },
    currentRequestHeader () {
      if (!this.currentRequest.request) {
        return undefined
      }
      return Prism.highlight(beautifyJSON(this.currentRequest.request.headers), Prism.languages.json).trim()
    },
    currentResponseHeader () {
      if (!this.currentRequest.response) {
        return undefined
      }
      return Prism.highlight(beautifyJSON(this.currentRequest.response.headers), Prism.languages.json).trim()
    }
  },

  mounted () {
    utilListener.addCodeViewerListeners(this)
  },

  destroyed () {},

  methods: {
    fullscreen (id) {
      const target = document.getElementById(id)
      try {
        target.webkitRequestFullScreen()
      } catch (e) {
        return false
      }
    },
    backToFloat () {
      utilListener.backToFloat(this)
    }
  }
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

</script>
