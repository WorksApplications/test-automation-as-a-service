<template>
  <el-upload
    :size="size"
    :type="type"
    :plain="plain"
    :round="round"
    :disabled="disabled"
    :action="action"
    :on-success="handleUploadSuccess"
    :on-error="handleUploadError"
    :before-upload="beforeUpload"
    :show-file-list="false"
    :http-request="uploadRequest">
    Upload App
  </el-upload>
</template>

<script>
import Vue from 'vue'
import { error } from '@/components/InteractivePushMessage.vue'
import uploadapi from '@/api/upload.js'
import UtilsPropsValidator from '@/utils/propsValidator.js'

export default {

  name: 'ButtonAppUpload',
  components: {},

  props: {
    // Button styling properties
    size: {
      type: String,
      default: undefined,
      validator: UtilsPropsValidator.size
    },
    type: {
      type: String,
      default: 'primary',
      validator: UtilsPropsValidator.type
    },
    plain: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    apkList: [],
    action: ''
  }),
  computed: {},
  watch: {},

  created () {
    this.refresh()
  },
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    refresh () {
      const _this = this
      return uploadapi.fetchApkList().then(
        data => data.map(toApkInfo)
      ).then(data => {
        _this.apkList = data
        return data
      })
    },
    beforeUpload (file) {
      if (isValidApp(file.name)) {
        this.action = toUploaderAction(file.name)
        return Vue.nextTick()
      } else {
        error('Invalid file')
        return false
      }
    },
    triggerInput (url) {
      this.$emit('input', url)
    },
    handleUploadSuccess (response, file, fileList) {
      this.refresh().then((data) => {
        const apk = findByName({ name: file.name }, data)

        if (apk) {
          this.triggerInput(apk.url)
        }
      })
    },
    handleUploadError (err, file, fileList) {
      error('File upload error ' + err)
    },
    uploadRequest (options) {
      return uploadapi.uploadApk(options.file)
    }
  }

}

const toUploaderAction = (filename) => `/files/api/resource/apk/${filename}`

const toApkInfo = (file) => ({
  name: file.name,
  url: `http://${window.location.hostname}/mobile/apps/${file.name}`
})

const findByName = (item, items) => {
  const idx = items.findIndex((ele) => ele.name === item.name)

  if (idx === -1) {
    return null
  } else {
    return items[idx]
  }
}

const isValidApp = (filename = '') => (
  filename.endsWith('.apk') ||
    filename.endsWith('.ipa')
)

</script>
