<!--

Usage:
  <radio-platform
    v-model="platform"
    :platforms="platformSet"
    :disabled="false"
    :showIcon="true" :showLabel="true"
  />

-->

<template>
  <span>
    <span v-if="!disabled">
      <el-radio
        v-for="platform in platformSet"
        v-model="componentValue"
        :key="platform.value"
        :label="platform.value"
        @change="handleChanged">
        {{ platform.label }}
      </el-radio>
    </span>
    <span v-else>
      <span
        v-for="platform in platformSet"
        :key="platform.value">
        <span v-if="platform.value === value">
          <i
            v-if="showIcon"
            :title="platform.label"
            :class="['fa', platform.icon]" />
          <span v-if="showLabel">
            {{ platform.label }}
          </span>
        </span>
      </span>
    </span>
  </span>
</template>

<script>

import utilPlatforms from '@/utils/platforms.js'

export default {

  name: 'Platform',
  components: {},

  props: {
    // General element styling properties
    disabled: {
      type: Boolean,
      default: false
    },

    // Component specific styling properties
    showIcon: {
      type: Boolean,
      default: true
    },
    showLabel: {
      type: Boolean,
      default: true
    },

    // Model-related properties
    value: {
      type: String,
      required: true
    },
    platforms: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
  }),
  computed: {
    componentValue: {
      get: function () {
        return this.value
      },
      set: function (val) {
        this.$emit('input', val)
      }
    },
    platformSet () {
      if (this.platforms.length > 0) {
        return this.platforms
      } else {
        return utilPlatforms.platforms
      }
    }
  },
  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    handleChanged () {
      this.$emit('change')
    }
  }

}

</script>
