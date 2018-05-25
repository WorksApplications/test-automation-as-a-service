<template>
  <el-tag
    v-if="state"
    :type="states[state].type"
    size="small">
    {{ states[state].label }}
  </el-tag>
</template>

<script>
import { states } from '@/utils/states'
export default {
  props: {
    state: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      states
    }
  }
}
</script>
