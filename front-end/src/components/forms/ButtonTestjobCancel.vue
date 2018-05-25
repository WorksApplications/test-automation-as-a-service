
<template>
  <v-tooltip
    v-if="user !== null"
    bottom>
    <v-btn
      slot="activator"
      color="primary"
      fab
      small
      @click="buttonClick">
      <v-icon>clear</v-icon>
    </v-btn>
    <span>Cancel test job</span>
  </v-tooltip>
  <v-tooltip
    v-else
    bottom>
    <v-btn
      slot="activator"
      color="primary"
      fab
      small
      disabled>
      <v-icon>clear</v-icon>
    </v-btn>
    <span>Please login to cancel test job</span>
  </v-tooltip>
</template>

<script>
import { mapState } from 'vuex'
import { submitNotice } from '@/components/InteractivePushMessage.vue'
import api from '@/api/testjobs.js'

export default {

  name: 'ButtonCancel',
  components: {},

  props: {
    testjob: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    closeShow: true
  }),
  computed: {
    ...mapState('user', [
      'user'
    ])
  },
  watch: {},

  created () {},
  mounted () {},
  destroyed () {},

  methods: {
    buttonClick () {
      const testjob = this.testjob
      const dom = this.$el
      const remoteData = api.stopOne(testjob.serial)
      const messages = [
        'Cancalling the testjob......',
        'The testjob is canceled!',
        'Error'
      ]

      if (!this.canBeStopped) {
        return false
      } else {
        const _this = this
        this.closeShow = false
        submitNotice(remoteData, dom, messages).catch(() => {
          // if there an errer, keep close button displayed
          _this.closeShow = true
        })
      }
    }
  }

}

</script>
