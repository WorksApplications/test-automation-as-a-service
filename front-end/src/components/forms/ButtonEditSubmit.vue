<template>
  <button-base
    :disabled="disabled"
    :is-icon="isIcon">
    <span slot="text">Submit</span>
    <v-icon slot="icon">assignment_turned_in</v-icon>
    <span slot="tip">Submit</span>
    <span slot="tipDisabled">Please login to submit</span>
  </button-base>
</template>

<script>
import ButtonBase from '@/components/forms/ButtonBase.vue'

export default {

  name: 'ButtonEditSubmit',
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
