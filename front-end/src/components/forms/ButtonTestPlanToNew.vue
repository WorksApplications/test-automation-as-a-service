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
      <v-icon>add</v-icon>
    </v-btn>
    <span>Create test plan</span>
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
      <v-icon>add</v-icon>
    </v-btn>
    <span>Please login to create test plan</span>
  </v-tooltip>
</template>

<script>
import { mapState } from 'vuex'
import router from '@/router'

export default {

  name: 'ButtonTestPlanToNew',
  components: {},

  props: {},

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
    buttonClick: () => router.push({ name: 'TestPlanAdd' })
  }

}
</script>
