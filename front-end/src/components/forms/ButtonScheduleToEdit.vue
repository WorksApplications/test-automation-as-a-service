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
      <v-icon>mode_edit</v-icon>
    </v-btn>
    <span>Edit schedule</span>
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
      <v-icon>mode_edit</v-icon>
    </v-btn>
    <span>Please login to edit schedule</span>
  </v-tooltip>
</template>

<script>
import { mapState } from 'vuex'
import router from '@/router'

export default {
  name: 'ButtonScheduleToEdit',
  components: {},

  props: {
    schedule: {
      type: Object,
      default: () => ({})
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
    buttonClick () {
      router.push({ path: `/schedules/edit/${this.schedule.serial}` })
    }
  }

}

</script>
