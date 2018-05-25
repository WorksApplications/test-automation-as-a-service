<template>
  <div>
    <h3 class="preview-header">Objective</h3>
    <div
      :class="{'diff-field': isFieldUpdated('objective')}"
      class="preview-block">
      <pre :style="{whiteSpace: 'pre-wrap'}">{{ objective }}</pre>
    </div>

    <div v-if="description !== ''">
      <h3 class="preview-header">Description</h3>
      <vue-markdown
        :class="{'diff-field': isFieldUpdated('description')}"
        :html="false"
        :source="description"
        :anchor-attributes="{target: '_blank'}"
        class="preview-block"
        table-class="markdown-table"/>
    </div>

    <div v-if="environment && environment.url !== ''">
      <h3
        :style="{display: 'inline-block'}"
        class="preview-header">
        Environment
      </h3>
      <el-tag
        v-if="environment.inherit"
        size="mini"
        type="info">
        Inherited by Tasks
      </el-tag>
      <div
        :class="{'diff-field': isFieldUpdated('environment')}"
        class="preview-block">
        {{ environment.url }} ({{ environment.username }}/{{ environment.password }})
      </div>
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  components: {
    VueMarkdown
  },

  props: {
    objective: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    environment: {
      type: Object,
      default: () => {}
    }
  },

  data: () => ({}),

  methods: {
    isFieldUpdated: function (fieldName) {
      let diff = this.diff
      if (diff) {
        return diff.some(diffItem => diffItem.key === fieldName)
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
