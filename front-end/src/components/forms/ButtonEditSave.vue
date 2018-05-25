<template>
  <button-base
    :disabled="disabled"
    :is-icon="isIcon"
    :color="color">
    <span slot="text">Save</span>
    <v-icon slot="icon">save</v-icon>
    <span slot="tip">Save edit</span>
    <span slot="tipDisabled">Please login to save edit</span>
  </button-base>
</template>

<script>
import ButtonBase from '@/components/forms/ButtonBase.vue'

export default {

  name: 'ButtonEditSave',
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
