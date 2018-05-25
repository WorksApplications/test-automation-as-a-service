<template>
  <v-tooltip
    bottom>
    <v-btn
      slot="activator"
      :fab="isIcon"
      :disabled="disabled"
      :color="color"
      small
      @click="buttonClick">
      <slot
        v-if="isIcon"
        name="icon"/>
      <slot
        v-else
        name="text"/>
    </v-btn>
    <slot
      v-if="disabled"
      name="tipDisabled"/>
    <slot
      v-else
      name="tip"/>
  </v-tooltip>
</template>

<script>
export default {

  name: 'ButtonBase',
  components: {},

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

  methods: {
    buttonClick: () => {}
  }

}
</script>
