<template>
  <v-btn
    color="primary"
    flat
    small>
    Save preset
  </v-btn>
</template>

<script>

import UtilsPropsValidator from '@/utils/propsValidator.js'
import { submitNotice } from '@/components/InteractivePushMessage.vue'
import store from '@/store'

export default {

  name: 'ButtonPresetCreate',
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

    // Input data
    preset: {
      type: Object,
      default: () => ({})
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
    createOne (preset) {
      const dom = this.$el

      const ps = createOne(preset)
      return submitNotice(ps, dom)
    }
  }

}

const createOne = (preset) => store.dispatch('preset/createOne', preset)

</script>
