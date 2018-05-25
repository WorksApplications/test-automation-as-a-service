<template>
  <div @click="goToRef($event)">
    <div class="comment-list">
      <div
        v-for="comment in comments"
        :key="comment._id">
        <v-layout
          row
          class="timeline-entry comment-list-item">
          <v-flex
            xs1
            class="text-xs-center">
            <user-avatar
              :username="comment.creator"
              size="48px" />
          </v-flex>
          <v-flex
            v-if="!isEditing(comment._id)"
            xs11>
            <v-layout
              row
              class="comment-header">
              <v-flex xs7>
                {{ comment.creator }}
                <span class="text-minor">comment at</span>
                <field-time
                  :value="comment.create"
                  format-type="fullDateTime" />
                <span v-if="comment.edit">
                  <span class="text-minor">Last edited at</span>
                  <field-time
                    :value="comment.edit"
                    format-type="fullDateTime" />
                </span>
              </v-flex>
              <v-flex
                xs5
                class="text-xs-right">
                <v-tooltip
                  v-if="needEllipsis[comment._id]"
                  bottom>
                  <a
                    slot="activator"
                    class="comment-list-item-action"
                    @click="toggleExpand(comment._id)">
                    <v-icon medium>{{ expanded[comment._id] ? 'expand_less' : 'expand_more' }}</v-icon>
                  </a>
                  {{ expanded[comment._id] ? 'Collapse' : 'Expand' }}
                </v-tooltip>
                <v-tooltip
                  v-if="user && user.username === comment.creator"
                  bottom>
                  <a
                    slot="activator"
                    class="comment-list-item-action"
                    @click="editComment(comment)">
                    <v-icon small>mode_edit</v-icon>
                  </a>
                  Edit Comment
                </v-tooltip>
              </v-flex>
            </v-layout>
            <div
              :id="`comment-${comment._id}`"
              class="comment-body">
              <vue-markdown
                :source="refPreviewParser(comment.content)"
                :anchor-attributes="{target: '_blank'}"
                table-class="markdown-table"
                class="content-preview"/>
            </div>
          </v-flex>
          <v-flex
            v-else
            xs11>
            <text-area-write-preview
              :content.sync="updateContent"
              :ref-items="refItems"
              :ref-items-handler="refItemsHandler"
              :ref-preview-parser="refPreviewParser"
              :ref-limit="refLimit">
              <v-list-tile-sub-title
                slot="menu-item"
                slot-scope="props">
                <div
                  v-if="refType === refTypes.TASK"
                  class="menu-item-wrapper">
                  #{{ props.item.serial }}
                  <span class="text--primary">
                    {{ props.item.name }}
                  </span>
                </div>
              </v-list-tile-sub-title>
            </text-area-write-preview>
            <v-flex
              row
              class="text-xs-right comment-form-action">
              <v-btn
                :disabled="updateContent === comment.content"
                color="primary"
                @click="updateComment(comment._id)">
                Save Comment
              </v-btn>
              <v-btn @click="cancelEdit(comment._id)">
                Cancel
              </v-btn>
            </v-flex>
          </v-flex>
        </v-layout>
      </div>
    </div>
    <v-flex
      v-if="!isLoggedIn"
      class="timeline-entry text-xs-center">
      <a
        href="http://genius.internal.worksap.com/users/new"
        target="_blank">
        Register Genius Center
      </a>
      to join this conversation.
      Already have an account?
      <a
        :href="urlGeniusCenterLogin"
        target="_self">
        Log in to comment
      </a>
    </v-flex>
    <v-layout
      v-else
      row
      class="timeline-entry">
      <v-flex
        xs1
        class="text-xs-center">
        <user-avatar
          :username="user.username"
          size="48px" />
      </v-flex>
      <v-flex xs11>
        <text-area-write-preview
          ref="textAreaWritePreviewSubmit"
          :content.sync="submitContent"
          :ref-items="refItems"
          :ref-items-handler="refItemsHandler"
          :ref-preview-parser="refPreviewParser"
          :ref-limit="refLimit">
          <v-list-tile-sub-title
            slot="menu-item"
            slot-scope="props">
            <div
              v-if="refType === refTypes.TASK"
              class="menu-item-wrapper">
              #{{ props.item.serial }}
              <span class="text--primary">
                {{ props.item.name }}
              </span>
            </div>
          </v-list-tile-sub-title>
        </text-area-write-preview>
        <v-flex
          row
          class="text-xs-right comment-form-action">
          <v-btn
            :disabled="submitContent === ''"
            color="primary"
            @click="submitComment">
            Comment
          </v-btn>
        </v-flex>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { mapGetters, mapState } from 'vuex'
import VueMarkdown from 'vue-markdown'
import UserAvatar from '@/components/UserAvatar.vue'
import FieldTime from '@/components/FieldTime.vue'
import TextAreaWritePreview from '@/components/forms/TextAreaWritePreview.vue'
import UtilsUrl from '@/utils/url.js'
import { getDateTimeFromObjectId } from '@/utils/date'
import testplanapi from '@/api/testplan.js'

export default {
  components: {
    VueMarkdown,
    UserAvatar,
    FieldTime,
    TextAreaWritePreview
  },

  props: {
    serial: {
      type: Number,
      default: undefined
    },
    comments: {
      type: Array,
      default: () => []
    },
    active: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    submitContent: '',
    updateContent: '',
    editingCommentId: undefined,
    needEllipsis: {},
    expanded: {},
    refStr: '',
    refType: '',
    refTypes: {
      TASK: 'task',
      USER: 'user'
    },
    refLimit: 5
  }),

  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    ...mapState('user', ['user']),
    ...mapState('sysinfo', ['appId']),
    ...mapState('cache', ['tasksName']),
    refItems () {
      switch (this.refType) {
        case this.refTypes.TASK:
          return this.filteredTasksName
        default:
          return []
      }
    },
    filteredTasksName () {
      let serialNameDivide = this.refStr.search(/(\d\D|\d$)/) + 1
      let serialPart = this.refStr.substring(0, serialNameDivide)
      let namePart = this.refStr.substring(serialNameDivide)
      let filterBySerial = taskName => {
        return serialPart === '' || taskName.serial.toString().startsWith(serialPart)
      }
      let filterByName = taskName => {
        if (namePart === '') return true
        let namePartLowerCase = namePart.toLowerCase()
        let taskNameLowerCase = taskName.name.toLowerCase()
        let j = 0
        for (let i = 0; i < taskNameLowerCase.length; i++) {
          if (j < namePart.length && namePartLowerCase.charAt(j) === taskNameLowerCase.charAt(i)) {
            j++
          }
        }
        return j === namePart.length
      }
      return this.tasksName.filter(filterBySerial).filter(filterByName).slice(0, this.refLimit)
    },
    urlGeniusCenterLogin () {
      const appId = this.appId
      let path = this.$route.path
      let query = this.$route.query
      let hash = this.$route.hash
      let redirectUri = encodeURIComponent(
        UtilsUrl.getRelativeUrl(path, query, hash)
      )
      return `http://genius.internal.worksap.com/login?app_id=${appId}&redirect_uri=${redirectUri}`
    }
  },

  watch: {
    active () {
      if (this.active && Object.keys(this.needEllipsis).length === 0) {
        this.updateExpandInfo()
        if (this.$refs.textAreaWritePreviewSubmit) {
          this.$refs.textAreaWritePreviewSubmit.$refs.tabsWritePreview.callSlider()
          this.$refs.textAreaWritePreviewSubmit.$refs.tabsWritePreview.genSlider([])
        }
      }
    },
    comments: {
      deep: true,
      handler: function () {
        if (this.active && this.comments) {
          this.$nextTick(() => {
            this.updateExpandInfo()
          })
        }
      }
    }
  },

  mounted () {},

  methods: {
    submitComment () {
      submitComment(this.serial, this.submitContent)
      this.submitContent = ''
    },
    editComment (comment) {
      let commentBody = this.$el.querySelector(`#comment-${comment._id}.comment-body`)
      commentBody.style.height = 'auto'
      this.updateContent = comment.content
      this.editingCommentId = comment._id
    },
    cancelEdit (id) {
      this.updateContent = ''
      this.editingCommentId = undefined
      if (!this.expanded[id] && this.needEllipsis[id]) {
        this.$nextTick(() => {
          let commentBody = this.$el.querySelector(`#comment-${id}.comment-body`)
          commentBody.style.height = '300px'
        })
      }
    },
    updateComment (id) {
      updateComment(this.serial, id, this.updateContent)
      this.cancelEdit(id)
    },
    getTime: function (objectId) {
      return getDateTimeFromObjectId(objectId).toISOString()
    },
    isEditing (id) {
      return id === this.editingCommentId
    },
    updateExpandInfo () {
      const _this = this
      let expanded = {}
      let needEllipsis = {}
      this.comments.forEach((comment) => {
        expanded[comment._id] = false
        let commentBody = _this.$el.querySelector(`#comment-${comment._id}.comment-body`)
        let content = _this.$el.querySelector(`#comment-${comment._id} .content-preview`)
        let contentHeight = content.clientHeight
        needEllipsis[comment._id] = contentHeight > 300
        if (needEllipsis[comment._id]) {
          commentBody.style.height = '300px'
        }
      })
      this.expanded = cloneDeep(expanded)
      this.needEllipsis = cloneDeep(needEllipsis)
    },
    toggleExpand (id) {
      let commentBody = this.$el.querySelector(`#comment-${id}.comment-body`)
      let content = this.$el.querySelector(`#comment-${id} .content-preview`)
      if (this.expanded[id]) {
        commentBody.style.height = '300px'
      } else {
        commentBody.style.height = content.clientHeight + 'px'
      }
      this.expanded[id] = !this.expanded[id]
    },
    refItemsHandler (str, curSelection) {
      switch (str.charAt(curSelection)) {
        case '#':
          this.refType = this.refTypes.TASK
          this.refStr = this.getRefStr(str, curSelection)
          return true
        default:
          return false
      }
    },
    getRefStr (str, curSelection) {
      let refStr = str.substring(curSelection + 1)
      let refStrEnd = refStr.search(/[ \f\n\r\t\v]/)
      if (refStrEnd >= 0) {
        return refStr.substring(0, refStrEnd)
      } else {
        return refStr
      }
    },
    goToRef (event) {
      if (event.target.nodeName === 'A') {
        let ref = event.target.id.split('-')
        let refType = ref[0]
        let refId = ref[1]
        switch (refType) {
          case this.refTypes.TASK:
            this.$router.push({ path: `/testplans/${this.serial}`, query: { op: 'view_task', id: refId } })
            break
          default:
            break
        }
      }
    },
    refPreviewParser (content) {
      if (!this.tasksName || this.tasksName.length === 0) return content
      const _this = this
      return content.replace(/(#(\d+))(\s)/g, (str, p1, p2, p3, offset, s) => {
        return `<a id="task-${p2}">Task: ${_this.tasksName.find(taskName => {
          return taskName.serial.toString() === p2
        }).name}</a>${p3}`
      })
    }
  }
}

const submitComment = (serial, content) =>
  testplanapi.submitComment(serial, content)
const updateComment = (serial, id, content) =>
  testplanapi.updateComment(serial, id, content)
</script>

<style lang="scss" scoped>
.comment-list {
  list-style: none;
  padding: 0;
}
.timeline-entry {
  padding: 20px 10px 15px 10px;

  &.comment-list-item {
    border-bottom: solid 1px #dddddd
  }
}
.content-preview {
  font-size: 16px;
}
.comment-form-action {
  margin-top: 10px;
  height: auto;
}
.comment-list-item-action {
  text-decoration: none;
}
.text-minor {
  color: rgba($color: #000000, $alpha: 0.54)
}
.comment-header {
  padding-bottom: 5px;
}
.comment-body {
  overflow: hidden;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

<style lang="scss">
.edit-preview-area .input-group .input-group__input textarea {
  min-height: 150px;
  max-height: 300px;
}
</style>
