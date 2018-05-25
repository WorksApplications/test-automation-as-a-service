<template>
  <v-navigation-drawer
    v-model="componentShowSidebar"
    app
    fixed>
    <v-list>
      <img
        alt="logo"
        src="/static/logo.png"
        class="img__logo">
      <v-list-tile
        v-if="isLoggedIn"
        :to="{ name: 'TestJobAdd' }"
        router>
        <v-list-tile-action>
          <v-icon>play_arrow</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Run a test job</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-tooltip
        v-else
        bottom>
        <v-list-tile
          slot="activator"
          disabled>
          <v-list-tile-action>
            <v-icon>play_arrow</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Run a test job</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <span>
          Please log in to create test jobs
        </span>
      </v-tooltip>
      <v-divider />
      <v-list-tile
        :to="{ name: 'Dashboard' }"
        router>
        <v-list-tile-action>
          <v-icon>dashboard</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Dashboard</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile
        :to="{ name: 'TestPlanList', params: { page: 1 } }"
        router>
        <v-list-tile-action>
          <v-icon>assignment</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Test Plans</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile
        :to="{ name: 'TestJobList', params: { page: 1 } }"
        router>
        <v-list-tile-action>
          <v-icon>build</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Test Jobs</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile
        :to="{ name: 'ScheduleList', params: { page: 1 } }"
        router>
        <v-list-tile-action>
          <v-icon>schedule</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Schedules</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile
        :to="{ name: 'LiveList' }"
        router>
        <v-list-tile-action>
          <v-icon>live_tv</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Live</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AppSidebar',
  components: {},

  props: {
    showSidebar: {
      type: Boolean,
      required: true
    }
  },

  data: () => ({}),
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    componentShowSidebar: {
      get: function () {
        return this.showSidebar
      },
      set: function (val) {
        this.$emit('toggleSidebar', val)
      }
    }
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
.img__logo {
  display: block;
  margin: auto;
  width: 300px;
}
</style>
