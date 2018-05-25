<template>
  <el-tooltip
    :disabled="!showTooltip"
    content="Create">
    <el-button
      :size="size"
      :type="type"
      :plain="plain"
      :round="round"
      :disabled="disabled"
      @click="buttonClick">
      <i
        v-if="showIcon"
        class="el-icon-circle-plus" />
      <span v-if="showLabel">Create</span>
    </el-button>
  </el-tooltip>
</template>

<script>

import { submitNotice } from '@/components/InteractivePushMessage.vue'
import api from '@/api/schedules.js'
import router from '@/router'
import UtilsPropsValidator from '@/utils/propsValidator.js'

export default {

  name: 'ButtonScheduleCreate',
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
    createOne (schedule) {
      schedule.params.name = schedule.name
      const dom = this.$el
      const messages = [
        'Creating schedule ...',
        'Schedule created!',
        'Fail to create a schedule!'
      ]

      const ps = createOne(schedule)

      return submitNotice(ps, dom, messages)
        .then((data) => {
          if (data.serial) {
            gotoSchedules(data.serial)
          } else {
            gotoSchedules('')
          }
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

const createOne = (schedule) => api.createOne(schedule)
const gotoSchedules = (id) => router.push({ path: `/schedules/${id}` })

</script>
