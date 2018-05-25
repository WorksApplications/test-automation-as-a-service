<template>
  <div>
    <v-layout
      row
      wrap>
      <v-flex xs8>
        <v-breadcrumbs style="display: inline-flex;">
          <v-icon slot="divider">chevron_right</v-icon>
          <v-breadcrumbs-item disabled>
            TaaS
          </v-breadcrumbs-item>
          <v-breadcrumbs-item>
            Test Cases
          </v-breadcrumbs-item>
          <v-breadcrumbs-item>
            {{ branch }}
          </v-breadcrumbs-item>
          <v-breadcrumbs-item>
            {{ locator }}
          </v-breadcrumbs-item>
        </v-breadcrumbs>
        <code-viewer-static
          v-if="dashboardResultLoaded"
          :branch="branch"
          :testcase="dashboardResult"
          style="position: relative; top: -4px; left: -8px;" />
      </v-flex>
      <v-flex
        xs4
        class="text-xs-right">
        <button-share-page :params="urlParams" />
      </v-flex>
      <v-flex
        xs10
        pa-2>
        <rating-graph :test-results="testResults" />
      </v-flex>
      <v-flex
        xs2
        pa-2>
        <v-card>
          <v-card-title>
            <h3 class="title">
              Test Case Rating
            </h3>
          </v-card-title>
          <v-card-text>
            <v-tooltip
              max-width="300"
              bottom>
              <div
                v-if="dashboardResult.rating === undefined || dashboardResult.rating === null"
                slot="activator"
                class="display-4 grey--text"
                style="text-align: center;">
                ?
              </div>
              <div
                v-else-if="dashboardResult.rating >= 80"
                slot="activator"
                class="display-4 green--text"
                style="text-align: center;">
                A
              </div>
              <div
                v-else-if="dashboardResult.rating >= 60"
                slot="activator"
                class="display-4 yellow--text"
                style="text-align: center;">
                B
              </div>
              <div
                v-else-if="dashboardResult.rating >= 40"
                slot="activator"
                class="display-4 orange--text"
                style="text-align: center;">
                C
              </div>
              <div
                v-else-if="dashboardResult.rating >= 20"
                slot="activator"
                class="display-4 red--text"
                style="text-align: center;">
                D
              </div>
              <div
                v-else
                slot="activator"
                class="display-4 red--text text--darken-2"
                style="text-align: center;">
                E
              </div>
              <span>
                The grade is given based on the past execution history.  This is a primary indicator on how much attention you should pay to the test script.
              </span>
            </v-tooltip>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex
        xs12
        pa-2>
        <v-card>
          <v-tabs>
            <v-tab ripple>Reminders</v-tab>
            <v-tab ripple>Summary</v-tab>
            <v-tab ripple>Test Jobs</v-tab>
            <v-tab-item>
              <reminders-list
                v-if="dashboardResultLoaded && testResultsLoaded"
                :dashboard-result="dashboardResult"
                :test-results="testResults" />
            </v-tab-item>
            <v-tab-item>
              <statistics-table
                v-if="dashboardResultLoaded && testResultsLoaded"
                :dashboard-result="dashboardResult"
                :test-results="testResults" />
            </v-tab-item>
            <v-tab-item>
              <test-job-list
                :testjobs="testJobs"
                :page-size="5" />
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import TestResultsAPI from '@/api/testresults.js'
import TestJobsAPI from '@/api/testjobs.js'
import DashboardAPI from '@/api/dashboard.js'
import ButtonSharePage from '@/components/forms/ButtonSharePage.vue'
import RatingGraph from '@/components/testcase/TheRatingGraph.vue'
import StatisticsTable from '@/components/testcase/TheStatisticsTable.vue'
import RemindersList from '@/components/testcase/TheRemindersList.vue'
import TestJobList from '@/components/testjob/TheList.vue'
import CodeViewerStatic from '@/components/testcase/TheCodeViewerStatic.vue'

export default {
  name: 'TestCaseDetails',
  components: {
    ButtonSharePage,
    RatingGraph,
    TestJobList,
    StatisticsTable,
    RemindersList,
    CodeViewerStatic
  },

  props: {
    branch: {
      type: String,
      required: true
    },
    locator: {
      type: String,
      required: true
    }
  },

  data: () => ({
    testResults: [],
    testJobs: [],
    dashboardResult: {},
    testResultsLoaded: false,
    dashboardResultLoaded: false
  }),
  computed: {
    urlParams () {
      return {}
    }
  },

  watch: {},

  created () {
    this.fetchTestResults()
    this.fetchTestJobs()
    this.fetchDashboardResult()
  },
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    fetchTestResults: async function () {
      const response = await TestResultsAPI.getTestResultsForLocatorAndBranch(this.branch, this.locator)
      this.testResults = response.testResults
      this.testResultsLoaded = true
    },
    fetchTestJobs: async function () {
      this.testJobs = await TestJobsAPI.getAllByBranchAndLocator(this.branch, this.locator)
    },
    fetchDashboardResult: async function () {
      const response = await DashboardAPI.getDashboard(this.branch)
      const dashboardRoot = response.dashboard.testresults
      const searchFor = (locator, dashboardNode) => {
        for (let key in dashboardNode) {
          if (key !== 'taas_metadata' && key !== 'testcases') {
            const matchedTestCase = searchFor(locator, dashboardNode[key])
            if (matchedTestCase !== undefined) {
              return matchedTestCase
            }
          }
        }
        if (dashboardNode.testcases !== undefined) {
          const matchedTestCase = dashboardNode.testcases.find(testCase => testCase.locator === locator)
          if (matchedTestCase !== undefined) {
            return matchedTestCase
          }
        }
      }
      this.dashboardResult = searchFor(this.locator, dashboardRoot)
      this.dashboardResultLoaded = true
    }

  }
}
</script>

<style lang="scss">
</style>
