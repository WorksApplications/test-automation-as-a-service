<template>
  <div>
    <v-layout
      row
      wrap>
      <v-flex xs8>
        <v-breadcrumbs>
          <v-icon slot="divider">chevron_right</v-icon>
          <v-breadcrumbs-item disabled>
            TaaS
          </v-breadcrumbs-item>
          <v-breadcrumbs-item>
            Dashboard
            <span v-if="testcasesSubscribed && testcasesSubscribed.length > 0">
              &nbsp;(Filtered by Subscription)
            </span>
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-flex>
      <v-flex
        xs4
        class="text-xs-right">
        <button-test-case-subscribe
          :disabled="!isLoggedIn"
          @click.native="!isLoggedIn ? null : goToSubscribe()"/>
        <v-tooltip bottom>
          <v-btn
            slot="activator"
            color="primary"
            fab
            small
            @click.stop="toggleFilterDialog">
            <v-icon>filter_list</v-icon>
          </v-btn>
          <span>Dashboard filter</span>
        </v-tooltip>
        <button-share-page :params="urlParams" />
      </v-flex>
      <v-flex
        xs12
        px-2>
        <v-card>
          <v-card-text>
            <testcases-table
              :branch="branch"
              :platforms-to-show="platformsToShow"
              :subsystems-to-show="subsystemsToShow"
              :testcases-subscribed="testcasesSubscribed" />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <testcases-filter
      :is-filter-dialog-opened="isFilterDialogOpened"
      :branch="branch"
      :platforms-to-show="platformsToShow"
      :subsystems-to-show="subsystemsToShow"
      @toggleFilterDialog="toggleFilterDialog"
      @updateBranch="handleBranchUpdate"
      @updatePlatform="handlePlatformUpdate"
      @updateSubsystem="handleSubsystemUpdate"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TestcasesTable from '@/components/dashboard/TheTestcasesTable.vue'
import TestcasesFilter from '@/components/dashboard/TheTestcasesFilter.vue'
import SelectBranch from '@/components/forms/SelectBranch.vue'
import ButtonSharePage from '@/components/forms/ButtonSharePage.vue'
import ButtonTestCaseSubscribe from '@/components/forms/ButtonTestCaseSubscribe.vue'
import settingsapi from '@/api/settings.js'

export default {
  name: 'Dashboard',
  components: {
    TestcasesTable,
    SelectBranch,
    TestcasesFilter,
    ButtonSharePage,
    ButtonTestCaseSubscribe
  },

  props: {},

  data: () => ({
    isFilterDialogOpened: false,

    lastUpdate: undefined,
    subsystemsToShow: [],
    testcasesSubscribed: [],
    platformsToShow: [],
    branch: 'develop'
  }),
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    urlParams () {
      return {
        branch: this.branch,
        subsystemsToShow: this.subsystemsToShow.join(','),
        platformsToShow: this.platformsToShow.join(',')
      }
    }
  },

  watch: {},

  async created () {
    const route = this.$route
    // Manage ?subsystemsToShow=...
    if (route.query.branch) {
      this.branch = route.query.branch
    }
    // Manage ?subsystemsToShow=...
    if (route.query.subsystemsToShow) {
      this.subsystemsToShow = route.query.subsystemsToShow.split(',')
    }
    // Manage ?platformsToShow=...
    if (route.query.platformsToShow) {
      this.platformsToShow = route.query.platformsToShow.split(',')
    }
    let ret = await getTestcasesSubscribed()
    if (ret && ret.success) {
      this.testcasesSubscribed = ret.testcases
    }
  },
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    toggleFilterDialog () {
      this.isFilterDialogOpened = !this.isFilterDialogOpened
    },
    handleSubsystemUpdate (subsystemsToShow) {
      this.subsystemsToShow = subsystemsToShow
    },
    handlePlatformUpdate (platformsToShow) {
      this.platformsToShow = platformsToShow
    },
    handleBranchUpdate (branch) {
      this.branch = branch
    },
    goToSubscribe () {
      this.$router.push({ path: `/settings` })
    }
  }
}
const getTestcasesSubscribed = () => settingsapi.getTestcases()
</script>
