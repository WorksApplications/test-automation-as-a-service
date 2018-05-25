<template>
  <el-tooltip
    :disabled="!showTooltip"
    content="Save">
    <el-button
      :size="size"
      :type="type"
      :plain="plain"
      :round="round"
      :disabled="disabled"
      @click="buttonClick">
      <i
        v-if="showIcon"
        class="fa fa-save" />
      <span v-if="showLabel">Save</span>
    </el-button>
  </el-tooltip>
</template>

<script>

import { submitNotice } from '@/components/InteractivePushMessage.vue'
import api from '@/api/schedules.js'
import router from '@/router'
import UtilsPropsValidator from '@/utils/propsValidator.js'

export default {

  name: 'ButtonScheduleUpdate',
  components: {},

  props: {
    // General form component styling properties
    size: {
      type: String,
      default: undefined,
      validator: UtilsPropsValidator.size
    },
    type: {
      type: String,
      default: 'success',
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
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    showTooltip: {
      type: Boolean,
      default: false
    },

    // Input data
    schedule: {
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
    updateOne (schedule) {
      const dom = this.$el
      const messages = [
        'Updating schedule ...',
        'Schedule updated!',
        'Fail to update!'
      ]

      const ps = updateOne(schedule.serial, schedule)

      return submitNotice(ps, dom, messages)
        .then((data) => {
          goToScheduleDetail(schedule.serial)
          return data
        })
    },

    buttonClick () {
      const schedule = this.schedule

      if (schedule) {
        this.createOne(schedule)
      }
    }
  }

}

const updateOne = (id, schedule) => api.updateOne(id, schedule)

const goToScheduleDetail = (id) => {
  if (id !== undefined) {
    router.push({ path: `/schedules/${id}` })
  }
}

</script>
