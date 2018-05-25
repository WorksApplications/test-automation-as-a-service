<template>
  <el-tooltip
    :disabled="!showTooltip"
    content="Live">
    <el-button
      :size="size"
      :type="type"
      :plain="plain"
      :round="round"
      :disabled="disabled"
      @click="buttonClick">
      <i
        v-if="showIcon"
        class="fa fa-television" />
      <span v-if="showLabel">Live</span>
    </el-button>
  </el-tooltip>
</template>

<script>

import router from '@/router'
import UtilsPropsValidator from '@/utils/propsValidator.js'

export default {

  name: 'ButtonTestjobToLive',
  components: {},

  props: {
    // General form component styling properties
    size: {
      type: String,
      default: undefined,
      validator: UtilsPropsValidator.size
    },
    type: {
      type: String,
      default: 'info',
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
    showIcon: {
      type: Boolean,
      default: true
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    showTooltip: {
      type: Boolean,
      default: false
    },

    id: {
      type: Number,
      required: true
    }
  },

  data: () => ({}),
  computed: {},
  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    buttonClick () {
      router.push({ path: `/testjobs/details/${this.id}/#live` })
    }
  }

}

</script>
