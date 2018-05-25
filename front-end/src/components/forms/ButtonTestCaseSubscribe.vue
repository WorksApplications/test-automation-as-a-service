<template>
  <button-base
    :disabled="disabled"
    :is-icon="isIcon"
    :color="color">
    <span slot="text">Subscribe Test Case</span>
    <v-icon slot="icon">filter_center_focus</v-icon>
    <span slot="tip">Subscribe Test Case</span>
    <span slot="tipDisabled">Please login to subscribe test case</span>
  </button-base>
</template>

<script>
import ButtonBase from '@/components/forms/ButtonBase.vue'

export default {

  name: 'ButtonTestCaseSubscribe',
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
    },
    color: {
      type: String,
      default: 'primary'
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
