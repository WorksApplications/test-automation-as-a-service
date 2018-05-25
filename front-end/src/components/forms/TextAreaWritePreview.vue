<template>
  <div
    :class="isFocus ? 'focused' : ''"
    class="edit-preview-area">
    <v-tabs
      ref="tabsWritePreview"
      v-model="tabActive">
      <v-tab href="#tab-write">Write</v-tab>
      <v-tab href="#tab-preview">Preview</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabActive">
      <v-tab-item id="tab-write">
        <v-text-field
          ref="textField"
          v-model="contentInner"
          label="Write a comment"
          full-width
          multi-line
          single-line
          hide-details
          @focus="onFocusTextField"
          @blur="onBlurTextField"/>
        <div
          ref="cursorOffsetRect"
          class="cursor-offset-rect">
          <span/>
        </div>
        <v-menu
          v-model="showMenuRef"
          :position-x="cursorLeft"
          :position-y="cursorTop"
          offset-y
          absolute
          content-class="menu-items">
          <v-list v-if="refItems.length > 0">
            <v-list-tile
              v-for="(refItem, index) in refItems"
              :key="index"
              :class="index === focusedRef ? 'focused' : ''"
              @click="selectRef(refItem.serial.toString())"
              @mouseover="onHoverMenuItem(index)">
              <slot
                :item="refItem"
                name="menu-item"/>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-tab-item>
      <v-tab-item id="tab-preview">
        <vue-markdown
          :source="contentPreview === '' ? 'Nothing to preview' : contentPreview"
          :anchor-attributes="{target: '_blank'}"
          table-class="markdown-table"
          class="content-preview"/>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  components: {
    VueMarkdown
  },

  props: {
    content: {
      type: String,
      default: ''
    },
    refItems: {
      type: Array,
      default: () => []
    },
    refItemsHandler: {
      type: Function,
      default: undefined
    },
    refPreviewParser: {
      type: Function,
      default: undefined
    },
    refLimit: {
      type: Number,
      default: 5
    }
  },

  data: () => ({
    contentInner: '',
    tabActive: 'tab-write',
    isFocus: false,
    cursorTop: 0,
    cursorLeft: 0,
    refStart: 0,
    showMenuRef: false,
    focusedRef: 0
  }),

  computed: {
    contentPreview () {
      if (this.refPreviewParser) {
        return this.refPreviewParser(this.contentInner)
      } else {
        return this.contentInner
      }
    }
  },

  watch: {
    content (newValue) {
      this.contentInner = this.content
    },
    contentInner (newValue) {
      this.$emit('update:content', newValue)
    },
    showMenuRef (newValue) {
      if (!newValue) {
        this.focusedRef = 0
      }
    }
  },

  mounted () {
    this.contentInner = this.content
    const _this = this
    this.$el.querySelector('textarea').addEventListener('scroll', event => {
      _this.updateCursorOffsetByEvent(event)
    }, false)
    this.$el.querySelector('textarea').addEventListener('keydown', event => {
      if (_this.showMenuRef && _this.isMenuControlKey(event.key)) {
        switch (event.key) {
          case 'Enter':
            _this.selectRef(_this.refItems[_this.focusedRef].serial.toString())
            break
          case 'ArrowUp':
            _this.focusedRef = (_this.focusedRef + _this.refItems.length - 1) % _this.refItems.length
            break
          case 'ArrowDown':
            _this.focusedRef = (_this.focusedRef + _this.refItems.length + 1) % _this.refItems.length
            break
          default:
            break
        }
        event.preventDefault()
      }
    }, false)
    this.$el.querySelector('textarea').addEventListener('keyup', event => {
      _this.updateCursorOffsetByEvent(event)
    }, false)
    this.$el.querySelector('textarea').addEventListener('mouseup', event => {
      _this.updateCursorOffsetByEvent(event)
    }, false)
  },

  methods: {
    isMenuControlKey (key) {
      return key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter'
    },
    onFocusTextField () {
      this.isFocus = true
    },
    onBlurTextField () {
      this.isFocus = false
    },
    onHoverMenuItem (index) {
      this.focusedRef = index
    },
    updateCursorOffset (index) {
      let textField = this.$el.querySelector('textarea')
      let cursorOffsetRect = this.$refs.cursorOffsetRect.firstChild
      cursorOffsetRect.innerHTML = textField.value
        .substr(0, index)
        .replace(/\n$/, '\n\x01')
      let rects = cursorOffsetRect.getClientRects()
      let lastRect = rects[rects.length - 1]
      this.cursorTop = lastRect.top - textField.scrollTop + lastRect.height
      this.cursorLeft = lastRect.left + lastRect.width
    },
    updateCursorOffsetByEvent (event) {
      if (this.refItemsHandler) {
        let textField = this.$el.querySelector('textarea')
        this.refStart = textField.selectionStart
        if (event.type !== 'scroll') {
          let hasRefItems = false
          for (let i = textField.selectionStart - 1; i >= 0; i--) {
            let ch = textField.value.charAt(i)
            if (' \f\n\r\t\v'.indexOf(ch) >= 0) {
              break
            } else {
              hasRefItems = this.refItemsHandler(textField.value, i)
              if (hasRefItems) {
                this.refStart = i + 1
                this.$nextTick(() => {
                  if (this.refItems.length > 0) {
                    this.showMenuRef = true
                  }
                })
                break
              }
            }
          }
          this.$nextTick(() => {
            if (!hasRefItems || this.refItems.length === 0) {
              this.showMenuRef = false
            }
          })
        } else {
          this.showMenuRef = false
        }
        this.updateCursorOffset(this.refStart)
      }
    },
    selectRef (ref) {
      let textField = this.$el.querySelector('textarea')
      let refStr = this.contentInner.substring(this.refStart)
      let firstWhiteSpace = refStr.search(/[ \f\n\r\t\v]/)
      let newContent = this.contentInner.substring(0, this.refStart) + ref + ' '
      if (firstWhiteSpace >= 0) {
        newContent += refStr.substring(firstWhiteSpace)
      }
      this.contentInner = newContent
      let selectionStart = this.refStart + ref.length + 1
      this.$nextTick(() => {
        textField.focus()
        textField.setSelectionRange(selectionStart, selectionStart)
      })
      this.focusedRef = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-preview-area {
  border: solid 1px #dddddd;
  border-radius: 3px;
  padding: 0 15px;
  transition: border-color ease-in-out 0.2s, box-shadow ease-in-out 0.2s;

  .tabs {
    border-bottom: solid 1px;
    border-color: inherit;
  }

  &.focused {
    border-color: #4db6ac;
    box-shadow: inset 0 1px 1px rgba($color: #000000, $alpha: 0.075),
      0 0 8px rgba($color: #4db6ac, $alpha: 0.6);
  }
  .content-preview {
    font-size: 16px;
    min-height: 205px;
    padding: 20px 16px 14px 16px;
  }
  .cursor-offset-rect {
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    padding: 20px 16px 16px 16px;
    font-size: 16px;
    white-space:pre;
    span {
      opacity:0;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  }
}
</style>

<style lang="scss">
.menu-items {
  .list {
    padding: 0;
    min-width: 200px;
    max-width: 600px;
    .focused {
      color: #ffffff;
      background: #4db6ac;
    }
  }

  .list__tile {
    padding: 5px 10px;
    height: auto;
    border-bottom: solid 1px #dddddd;
  }

  .menu-item-wrapper {
    white-space: initial;
    word-wrap: break-word;
  }
}
</style>
