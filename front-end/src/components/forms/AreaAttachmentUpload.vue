<template>
  <el-upload
    :size="size"
    :type="type"
    :plain="plain"
    :round="round"
    :disabled="disabled"
    :action="action"
    :on-success="handleUploadSuccess"
    :on-remove="handleRemove"
    :on-error="handleUploadError"
    :on-preview="handlePreview"
    :before-upload="beforeUpload"
    :before-remove="beforeRemove"
    :http-request="uploadRequest"
    :file-list="attachmentList"
    :drag="allowUpload"
    multiple>
    <div v-if="allowUpload">
      <i class="el-icon-upload"/>
      <div>
        Drop file here or <em>click to upload</em>
        <br>
        Size limitation: 10MB
      </div>
    </div>
  </el-upload>
</template>

<script>
import Vue from 'vue'
import { error } from '@/components/InteractivePushMessage.vue'
import UtilsPropsValidator from '@/utils/propsValidator.js'
import uploadapi from '@/api/upload.js'
import testplanapi from '@/api/testplan.js'

export default {

  name: 'AreaAttachmentUpload',
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
    },
    testPlanSerial: {
      type: Number,
      default: undefined
    },
    taskSerial: {
      type: Number,
      default: undefined
    },
    taskName: {
      type: String,
      default: undefined
    },
    allowUpload: {
      type: Boolean,
      default: true
    },
    syncHandle: {
      type: String,
      default: undefined
    },
    fileList: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    attachmentList: [],
    action: ''
  }),
  computed: {},
  watch: {
    testPlanSerial: function (newValue) {
      if (newValue && !this.allowUpload) {
        this.refresh()
      }
    },
    taskSerial: async function (newValue, oldValue) {
      if (this.taskSerial && !this.allowUpload) {
        this.refresh()
      }
    }
  },

  created () {},
  mounted () {
    if (this.testPlanSerial && !this.allowUpload) {
      this.refresh()
    }
    if (this.fileList.length > 0) {
      this.attachmentList = this.fileList
    }
  },
  updated () {},
  destroyed () {},

  methods: {
    refresh () {
      const _this = this
      if (this.testPlanSerial) {
        return uploadapi.fetchAttachmentList(this.testPlanSerial, this.taskSerial).then(data => {
          if (data) {
            return data.filter(file => !file.isDir).map(this.toAttachmentInfo)
          } else {
            return []
          }
        }).then(data => {
          _this.attachmentList = data
          _this.$emit('changed')
          return data
        })
      }
    },
    beforeUpload (file) {
      if (file.size > 10 * 1000 * 1000) return false
      this.action = toUploaderAction(file.name)
      return Vue.nextTick()
    },
    beforeRemove (file, fileList) {
      return this.$confirm(
        `Are you sure to delete the attachment ${file.name}?`,
        'Confirm Delete',
        {
          confirmButtonText: 'Yes. Delete It',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
    },
    handleUploadSuccess (response, file, fileList) {
      this.attachmentList = fileList.map(this.toAttachmentInfo)
      this.$emit('input')
    },
    handleRemove (file, fileList) {
      this.attachmentList = fileList.map(this.toAttachmentInfo)
      uploadapi.removeAttachment(file.name, this.testPlanSerial, this.taskSerial)
      if (!this.allowUpload) {
        recordAttachmentActivity(this.testPlanSerial, this.taskSerial, this.taskName, [this.toAttachmentInfo(file)], false)
      }
      this.$emit('changed')
    },
    handleUploadError (err, file, fileList) {
      error('File upload error ' + err)
    },
    uploadRequest (options) {
      return uploadapi.uploadAttachment(options.file, this.testPlanSerial, this.taskSerial)
    },
    handlePreview (file) {
      let attachment = this.attachmentList.find(attachment => {
        return attachment.name === file.name
      })
      window.open(attachment.url)
    },
    toAttachmentInfo (file) {
      let url = `http://${window.location.hostname}/attachment`
      if (this.testPlanSerial) {
        url += `/${this.testPlanSerial}`
        if (this.taskSerial) {
          url += `/${this.taskSerial}`
        }
      }
      url += `/${file.name}`
      return {
        name: file.name,
        url: url
      }
    }
  }

}

const toUploaderAction = (filename) => `/files/api/resource/attachment/${filename}`

const recordAttachmentActivity = (testPlanSerial, taskSerial, taskName, attachments, isUpload) =>
  testplanapi.recordAttachmentActivity(testPlanSerial, taskSerial, taskName, attachments, isUpload)
</script>
