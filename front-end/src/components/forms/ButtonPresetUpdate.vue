<template>
  <v-btn
    color="primary"
    flat
    small>
    Update preset
  </v-btn>
</template>

<script>
import { submitNotice } from '@/components/InteractivePushMessage.vue'
import store from '@/store'

export default {

  name: 'ButtonPresetUpdate',
  components: {},

  props: {
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
    updateOne (preset) {
      const dom = this.$el

      const ps = updateOne(preset)
      return submitNotice(ps, dom)
    },

    buttonClick () {
      const preset = this.preset

      if (preset) {
        this.updateOne(preset)
      }
    }
  }

}

const updateOne = (preset) => store.dispatch('preset/updateOne', preset)

</script>
