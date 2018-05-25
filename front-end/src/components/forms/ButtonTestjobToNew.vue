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
    <span>Add test job</span>
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
    <span>Please login to add test job</span>
  </v-tooltip>
</template>

<script>
import { mapState } from 'vuex'
import router from '@/router'

export default {

  name: 'ButtonTestjobToNew',
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
    buttonClick: () => router.push({ name: 'TestJobAdd' })
  }

}

</script>
