<template>
  <button-testjob-run
    v-if="isAuto"
    ref="buttonRun"
    :disabled="disabled"
    :is-icon="isIcon"
    :jump-after-run="false"
    :tooltip="'Start task'"
    :tooltip-disabled="'Please login to start task'"
    @click.native="disabled ? null : start()"/>
  <button-base
    v-else
    :disabled="disabled"
    :is-icon="isIcon"
    @click.native="disabled ? null : start()">
    <span slot="text">Start</span>
    <v-icon slot="icon">play_arrow</v-icon>
    <span slot="tip">Start task</span>
    <span slot="tipDisabled">Please login to start task</span>
  </button-base>
</template>

<script>
import ButtonTestjobRun from '@/components/forms/ButtonTestjobRun.vue'
import ButtonBase from '@/components/forms/ButtonBase.vue'
import { states } from '@/utils/states'
import { EventBus } from '@/utils/eventBus'
import testplanapi from '@/api/testplan'

export default {

  name: 'ButtonTaskToStart',
  components: {
    ButtonTestjobRun,
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
    task: {
      type: Object,
      default: () => ({})
    },
    testjob: {
      type: Object,
      default: () => ({})
    },
    isAuto: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({}),
  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    start: function () {
      if (this.isAuto) {
        let buttonRun = this.$refs.buttonRun
        buttonRun.run(this.testjob)
        EventBus.$emit('testjob-update')
      }
      updateTaskState(this.task.testPlanId, this.task.serial, states['in progress'].value)
      EventBus.$emit('task-edit-saved')
    }
  }
}

const updateTaskState = (testPlanSerial, taskSerial, state) =>
  testplanapi.updateTaskState(testPlanSerial, taskSerial, state)
</script>
