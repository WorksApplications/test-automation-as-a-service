<template>
  <button-base
    :disabled="disabled"
    :is-icon="isIcon">
    <span slot="text">Edit</span>
    <v-icon slot="icon">mode_edit</v-icon>
    <span slot="tip">Edit task</span>
    <span slot="tipDisabled">Please login to edit task</span>
  </button-base>
</template>

<script>
import ButtonBase from '@/components/forms/ButtonBase.vue'

export default {

  name: 'ButtonTaskToEdit',
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
