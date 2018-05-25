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
      <v-icon>delete</v-icon>
    </v-btn>
    <span>Delete schedule</span>
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
      <v-icon>delete</v-icon>
    </v-btn>
    <span>Please login to delete schedule</span>
  </v-tooltip>
</template>

<script>
import { mapState } from 'vuex'
import { submitNotice } from '@/components/InteractivePushMessage.vue'
import api from '@/api/schedules.js'

export default {

  name: 'ButtonScheduleDelete',
  components: {},

  props: {
    schedule: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    dialogVisible: false
  }),
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
    buttonClick () {
      this.$confirm('This action cannot be undone.  Are you sure to delete "' + this.schedule.name + '"?', 'Delete Schedule', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.deleteOne(this.schedule)
      }).catch(() => {})
    },

    deleteOne (schedule) {
      const dom = this.$el
      const messages = ['Deleting...', 'Schedule deleted!', 'Error!']
      const result = deleteOne(schedule.serial)
      return submitNotice(result, dom, messages)
    }
  }
}

const deleteOne = (id) => api.deleteOne(id)

</script>
