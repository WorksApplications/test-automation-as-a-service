<template>
  <button-base
    :disabled="disabled"
    :is-icon="isIcon"
    @click.native="disabled ? null : buttonClick()">
    <span slot="text">Run</span>
    <v-icon slot="icon">play_arrow</v-icon>
    <span slot="tip">{{ tooltip }}</span>
    <span slot="tipDisabled">{{ tooltipDisabled }}</span>
  </button-base>
</template>

<script>
import { SubmitFlow } from '@/components/InteractivePushMessage.vue'
import ButtonBase from '@/components/forms/ButtonBase.vue'
import router from '@/router'
import store from '@/store'

export default {

  name: 'ButtonRun',
  components: {
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
    tooltip: {
      type: String,
      default: 'Run test job'
    },
    tooltipDisabled: {
      type: String,
      default: 'Please login to run test job'
    },
    testjob: {
      type: Object,
      default: () => ({})
    },
    needEdit: {
      type: Boolean,
      default: false
    },
    jumpAfterRun: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({}),
  computed: {},
  watch: {},

  created () {},
  mounted () {},
  destroyed () {},

  methods: {
    run (testjob) {
      const _this = this

      const flow = new SubmitFlow(_this.$el)

      const jumpToTestjob = (res) => {
        if (_this.jumpAfterRun) {
          goToTestjob(res.serial)
        }
      }

      flow.submitting()

      runATest(testjob).then(flow.promiseSuccess())
        .then(jumpToTestjob)
        .catch(flow.promiseFail())
    },
    buttonClick () {
      const testjob = this.testjob
      if (testjob && testjob.name) {
        if (this.needEdit) {
          gotoEdit(testjob)
        } else {
          this.run(testjob)
        }
      }
    }
  }

}

const runATest = (form) => store.dispatch(
  'testjob/run', form
)

const goToTestjob = (id) => {
  router.push({
    path: `/testjobs/details/${id}`
  })
}

const gotoEdit = (testjob) => {
  router.push({
    name: 'TestJobAdd',
    params: {
      form: JSON.stringify(testjob)
    }
  })
}

</script>
