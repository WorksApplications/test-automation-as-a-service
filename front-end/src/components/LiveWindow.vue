<template>
  <div
    :style="styleWH"
    class="live-window-container">
    <canvas :id="id">
      Canvas not supported.
    </canvas>
  </div>
</template>

<script>

import RFB from '@novnc/novnc/core/rfb.js'
import utilPlatform from '@/utils/platforms.js'

export default {

  name: 'LiveWindow',
  components: {},

  props: {
    id: {
      type: String,
      required: true
    },
    host: {
      type: String,
      required: true
    },
    port: {
      type: String,
      required: true
    },
    password: {
      type: String,
      default: undefined
    },
    nodeType: {
      type: String,
      default: 'chrome'
    },
    ratio: {
      type: Number,
      default: 1
    }
  },

  data: () => ({}),
  computed: {
    styleWH () {
      const size = utilPlatform.getVideoSize(this.nodeType)
      return {
        width: size.width / this.ratio + 'px',
        height: size.height / this.ratio + 'px'
      }
    }
  },
  watch: {},

  created () {},
  mounted () {
    const _this = this
    this.$nextTick(() => {
      connectLive(_this.id, _this.host, _this.port, _this.password, _this.width, _this.height)
    })
  },
  updated () {},
  destroyed () {},

  methods: {}

}

const connectLive = (canvasId, host, port, password, width, height) => {
  let canvas = document.getElementById(canvasId)
  let widthObserver = new MutationObserver(function (mutations) {
    if (canvas.style.height !== '100%') {
      canvas.style.height = '100%'
    }
    if (canvas.style.width !== '100%') {
      canvas.style.width = '100%'
    }
  })

  widthObserver.observe(canvas, {
    attributes: true,
    childList: true,
    characterData: true
  })
  // Refer: https://github.com/novnc/noVNC/wiki/Modules-API
  let rfb
  var handle = setInterval(() => {
    if (!rfb || !rfb._rfb_connection_state || rfb._rfb_connection_state === 'disconnected') {
      rfb = new RFB({
        target: canvas,
        encrypt: false,
        local_cursor: true,
        shared: true,
        view_only: true
      })
    }
    if (rfb._rfb_connection_state === 'connected') {
      clearInterval(handle)
      return
    }
    rfb.connect(
      window.location.host.split(':')[0],
      '80',
      password || '',
      'websockify/' + host + '/' + port
    )
  }, 3000)
}

</script>

<style scoped>
  .live-window-container {
    margin: 0 auto;
  }
</style>
