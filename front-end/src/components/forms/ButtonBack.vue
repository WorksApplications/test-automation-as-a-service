<template>
  <el-button
    :size="size"
    :type="type"
    :plain="plain"
    :round="round"
    :disabled="disabled"
    @click="buttonClick">
    <i class="fa fa-reply" /> Back
  </el-button>
</template>

<script>

import router from '@/router'
import UtilsPropsValidator from '@/utils/propsValidator.js'

export default {

  name: 'ButtonBack',
  components: {},

  props: {
    // General element styling properties
    size: {
      type: String,
      default: undefined,
      validator: UtilsPropsValidator.size
    },
    type: {
      type: String,
      default: 'info',
      validator: UtilsPropsValidator.type
    },
    plain: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
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
    buttonClick () {
      router.go(-1)
    }
  }

}

</script>
