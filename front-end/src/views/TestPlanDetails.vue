<template>
  <div>
    <v-layout
      row
      wrap>
      <v-layout>
        <v-flex xs8>
          <v-breadcrumbs>
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item disabled>
              TaaS
            </v-breadcrumbs-item>
            <v-breadcrumbs-item
              :to="{ name: 'TestPlanList', params: { page: 1 } }"
              exact>
              Test Plans
            </v-breadcrumbs-item>
            <v-breadcrumbs-item>
              #{{ testPlanSerial }}
            </v-breadcrumbs-item>
          </v-breadcrumbs>
        </v-flex>
        <v-flex
          xs4
          class="text-xs-right">
          <button-test-plan-to-edit
            :disabled="!isLoggedIn"
            :test-plan="testPlan"
            @click.native="!isLoggedIn ? null : editTestPlan()"/>
          <button-share-page :params="urlParams" />
        </v-flex>
      </v-layout>
      <v-flex
        xs12
        px-2>
        <v-card>
          <v-card-text>
            <the-preview
              ref="testPlanPreview"
              :value="testPlan" />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import store from '@/store'
import { mapState, mapGetters } from 'vuex'
import { merge } from 'lodash'

import { EventBus } from '@/utils/eventBus'

import TestPlan from '@/models/TestPlan'
import testplanapi from '@/api/testplan'
import ThePreview from '@/components/testplan/ThePreview.vue'
import ButtonSharePage from '@/components/forms/ButtonSharePage.vue'
import ButtonTestPlanToEdit from '@/components/forms/ButtonTestPlanToEdit.vue'

const getTestPlan = (serial) => testplanapi.getOneTestPlan(serial)

export default {
  components: {
    ThePreview,
    ButtonTestPlanToEdit,
    ButtonSharePage
  },
  props: {
    testPlanSerial: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      testPlan: new TestPlan()
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapGetters('user', ['isLoggedIn']),
    urlParams () {
      return {}
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.query.op === 'add_task' &&
          to.query.op === 'view_task') {
        this.$refs.testPlanPreview.$refs.tabTasks.$refs.drawerSubmitTask.closeDrawer()
        this.$router.push({ path: to.path, query: to.query })
      }
    }
  },
  mounted () {
    const _this = this
    if (_this.testPlanSerial) {
      _this.updateTestPlan()
      store.dispatch('cache/updateTasksName', _this.testPlanSerial)
    }
    EventBus.$on('add-collaborator', () => {
      _this.updateTestPlan()
    })
    const route = this.$route
    const op = route.query.op
    switch (op) {
      case 'add_task':
        this.$refs.testPlanPreview.$refs.tabTasks.$refs.drawerSubmitTask.openDrawer(`/testplans/${this.testPlanSerial}`)
        break
      case 'edit_task':
      default:
        break
    }
  },
  destroyed () {
    EventBus.$off('add-collaborator')
  },
  methods: {
    editTestPlan () {
      this.$router.push({ path: `/testplans/edit/${this.testPlan.serial}` })
    },
    updateTestPlan () {
      const _this = this
      getTestPlan(_this.testPlanSerial).then(res => {
        if (res.success) {
          res.test_plan.start = new Date(res.test_plan.start)
          res.test_plan.end = new Date(res.test_plan.end)
          _this.testPlan = JSON.parse(JSON.stringify(merge(new TestPlan(), res.test_plan)))
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .testplan-preview-container {
    overflow-x: auto;
  }
</style>
