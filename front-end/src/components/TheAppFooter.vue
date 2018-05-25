<template>
  <v-footer
    app
    inset>
    <div>
      Developed by Shanghai QE Team | Version: {{ version }} b{{ buildNum }} ({{ buildDate }}) | Commit: {{ commit }}
    </div>
  </v-footer>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AppFooter',
  components: {},

  props: {},

  data: () => ({}),
  computed: {
    ...mapState('sysinfo', [
      'version', 'commit', 'buildNum', 'buildDate'
    ])
  },

  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {}
}
</script>

<style lang="scss" scoped>
footer {
  margin-left: 16px;
}
</style>
