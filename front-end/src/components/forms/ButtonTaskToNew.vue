<template>
  <button-base
    :disabled="disabled"
    :is-icon="isIcon">
    <span slot="text">Create</span>
    <v-icon slot="icon">add</v-icon>
    <span slot="tip">Create task</span>
    <span slot="tipDisabled">Please login to create task</span>
  </button-base>
</template>

<script>
import ButtonBase from '@/components/forms/ButtonBase.vue'

export default {

  name: 'ButtonTaskToNew',
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
