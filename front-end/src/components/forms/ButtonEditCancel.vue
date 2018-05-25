<template>
  <button-base
    :disabled="disabled"
    :is-icon="isIcon">
    <span slot="text">Cancel</span>
    <v-icon slot="icon">clear</v-icon>
    <span slot="tip">Cancel edit</span>
    <span slot="tipDisabled">Please login to cancel edit</span>
  </button-base>
</template>

<script>
import ButtonBase from '@/components/forms/ButtonBase.vue'

export default {

  name: 'ButtonEditCancel',
  components: {
    ButtonBase
  },

  props: {
    disabled: {
      type: Boolean,
      default: true
    },
    isIcon: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({}),
  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {}
}
</script>
