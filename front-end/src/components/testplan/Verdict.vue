<template>
  <v-tooltip
    v-if="verdict === 'new'"
    bottom>
    <v-icon
      slot="activator"
      small
      color="warning">
      info
    </v-icon>
    <span>New</span>
  </v-tooltip>
  <v-tooltip
    v-else-if="verdict === 'in progress'"
    bottom>
    <v-icon
      slot="activator"
      small
      color="info">
      timelapse
    </v-icon>
    <span>In progress</span>
  </v-tooltip>
  <v-tooltip
    v-else-if="verdict === 'finished'"
    bottom>
    <v-icon
      slot="activator"
      small
      color="success">
      check_circle
    </v-icon>
    <span>Finished</span>
  </v-tooltip>
  <v-tooltip
    v-else-if="verdict === 'destructed'"
    bottom>
    <v-icon
      slot="activator"
      small
      color="error">
      error
    </v-icon>
    <span>Destructed</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'TestPlanVerdict',
  components: {},

  props: {
    verdict: {
      type: String,
      required: true
    }
  },

  data: () => ({}),
  computed: {},

  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {}
}
</script>
