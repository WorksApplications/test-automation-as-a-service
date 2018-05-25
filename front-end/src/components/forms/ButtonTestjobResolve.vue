<template>
  <el-tooltip
    :disabled="!showTooltip"
    content="New">
    <el-button
      :size="size"
      :type="type"
      :plain="plain"
      :round="round"
      :disabled="disabled"
      @click="buttonClick">
      <i
        v-if="showIcon"
        class="fa fa-check-square-o" />
      <slot v-if="showLabel">Resolve</slot>
    </el-button>
  </el-tooltip>
</template>

<script>
import { submitNotice } from '@/components/InteractivePushMessage.vue'
import store from '@/store'
import UtilsPropsValidator from '@/utils/propsValidator.js'

export default {

  name: 'ButtonResolve',
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
      default: undefined
    },
    resolve: {
      type: Object,
      default: () => undefined
    }
  },

  data: () => ({}),
  computed: {},
  watch: {},

  created () {},
  mounted () {},
  destroyed () {},

  methods: {
    updateOne (id, resolve) {
      const dom = this.$el

      const ps = updateOne(id, resolve)
      return submitNotice(ps, dom)
    },

    buttonClick () {
      const id = this.id
      const resolve = this.resolve

      if (id && resolve) {
        this.updateOne(id, resolve)
      }
    }
  }

}

const updateOne = (id, resolve) => store.dispatch('testjob/updateResolve', { id, resolve })

</script>
