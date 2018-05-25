<template>
  <span>
    <el-tag
      v-for="item in itemsSelected"
      :key="item.map(path => path.label).join('_')"
      class="tag-group-selected__tag">
      {{ toString(item) }}
    </el-tag>
  </span>
</template>

<script>
export default {

  name: 'TagGroupSelected',

  props: {
    itemsSelected: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    toString (item) {
      return item.map(path => path.label).join(' : ')
    }
  }
}
</script>

<style scoped>
  .tag-group-selected__tag {
    margin: 3px;
  }
</style>
