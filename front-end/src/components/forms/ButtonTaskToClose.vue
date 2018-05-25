<template>
  <button-base
    :disabled="disabled"
    :is-icon="isIcon">
    <span slot="text">Close</span>
    <v-icon slot="icon">done</v-icon>
    <span slot="tip">Close task</span>
    <span slot="tipDisabled">Please login to close task</span>
  </button-base>
</template>

<script>
import ButtonBase from '@/components/forms/ButtonBase.vue'

export default {

  name: 'ButtonTaskToClose',
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

  methods: {
    buttonClick: () => {}
  }

}
</script>
