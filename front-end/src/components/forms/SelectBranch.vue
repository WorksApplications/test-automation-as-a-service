<template>
  <div>
    <v-select
      v-model="componentValue"
      :items="branches"
      :disabled="disabled"
      autocomplete
      item-text="label"
      item-value="value"
      label="Version" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UtilsPropsValidator from '@/utils/propsValidator.js'

export default {
  name: 'SelectBranch',
  components: {},

  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: 'develop',
      validator: UtilsPropsValidator.branch
    }
  },

  data: () => ({}),
  computed: {
    ...mapState('branch', [
      'branches'
    ]),
    componentValue: {
      get: function () {
        return this.value
      },
      set: function (val) {
        this.$emit('input', val)
      }
    }
  },

  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {}
}
</script>
