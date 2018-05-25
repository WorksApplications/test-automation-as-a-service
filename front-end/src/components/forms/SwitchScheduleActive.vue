<template>
  <v-switch
    v-model="value.enabled"
    :disabled="user === null"
    @change="click"
  />
</template>

<script>
import { mapState } from 'vuex'
import { cloneDeep } from 'lodash'
import api from '@/api/schedules.js'
import { submitNotice } from '@/components/InteractivePushMessage.vue'

export default {
  name: 'SwitchScheduleActive',
  components: {},

  props: {
    value: {
      type: Object,
      required: true
    },
    autoSubmit: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({}),
  computed: {
    ...mapState('user', [
      'user'
    ])
  },
  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    update (schedule) {
      const dom = this.$el
      const messages = [
        null,
        null,
        'Error!'
      ]
      return submitNotice(updateOne(schedule), dom, messages)
    },
    click (switchState) {
      const _this = this
      const schedule = this.value
      if (!this.autoSubmit) {
        schedule.enabled = switchState
      } else {
        const newSchedule = cloneDeep(schedule)
        newSchedule.enabled = switchState
        this.update(newSchedule).then(res => {
          _this.$emit('update:nextRun', res.nextRun)
        })
      }
    }
  }

}

const updateOne = (schedule) => api.updateOne(schedule.serial, schedule)

</script>

<style>
  .el-switch__core .el-switch__button {
    z-index: 0;
  }
</style>
