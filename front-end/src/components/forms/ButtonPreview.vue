<template>
  <button-base
    :disabled="disabled"
    :is-icon="isIcon">
    <span slot="text">Preview</span>
    <v-icon slot="icon">remove_red_eye</v-icon>
    <span slot="tip">Preview</span>
  </button-base>
</template>

<script>
import ButtonBase from '@/components/forms/ButtonBase.vue'

export default {

  name: 'ButtonPreview',
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
