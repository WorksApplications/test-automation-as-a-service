<template>
  <el-select
    :value="componentValue"
    :disabled="disabled"
    class="timezone-selection"
    @input="input">
    <el-option-group label="Timezone">
      <el-option
        v-for="item in timezones"
        :key="item"
        :value="item">
        {{ item }}
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script>

import { mapState } from 'vuex'
import store from '@/store'

export default {

  name: 'SelectTimezone',
  components: {},

  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: store.state.sysinfo.timezone
    }
  },

  data: () => ({}),
  computed: {
    ...mapState('sysinfo', {
      timezones: state => state.timezones
    }),
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

  methods: {
    input (v) {
      this.$emit('input', v)
    }
  }

}
</script>
