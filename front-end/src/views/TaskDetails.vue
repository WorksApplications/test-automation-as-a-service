<template>
  <div>
    <v-layout
      row
      wrap>
      <v-flex
        xs12
        class="text-xs-right">
        <button-task-to-edit
          :disabled="!isLoggedIn"
          @click.native="!isLoggedIn ? null : goEdit()"/>
        <button-task-to-start
          v-if="canStart(task.state, task.type)"
          :disabled="!isLoggedIn"
          :task="task"
          :testjob="testjobFromTask"
          :is-auto="task.type === 'Auto'"/>
        <button-share-page :params="urlParams" />
      </v-flex>
      <v-flex
        xs12
        px-2>
        <v-card>
          <v-card-text>
            <task-details
              :value="task"
              :test-plan="testPlan"
              :testcases-cascade="testcasesCascade"/>
            <template v-if="task.verdict && task.verdict.result && task.state === states['finished'].value">
              <div class="verdict-block">
                <h3 class="detail-header">Verdict</h3>
                <p>
                  <strong>Result:</strong>
                  {{ task.verdict.result }}
                </p>
                <p>
                  <strong>Reason:</strong>
                  <span style="white-space: pre-line">
                    {{ task.verdict.reason }}
                  </span>
                </p>
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <drawer
      ref="drawerEditTask"
      :before-close-handler="confirmLeave"
      @confirm="afterConfirm">
      <task-edit-view
        ref="viewTaskEdit"
        slot="main"
        :test-plan="testPlan"
        :task="task"
        :testcases-cascade="testcasesCascade"/>
    </drawer>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import utilTask from '@/utils/task'
import utilStates from '@/utils/states'
import { EventBus } from '@/utils/eventBus'

import TestPlan from '@/models/TestPlan'
import Task from '@/models/Task'

import ButtonSharePage from '@/components/forms/ButtonSharePage.vue'
import TaskDetails from '@/components/task/TheDetails.vue'
import Drawer from '@/components/Drawer.vue'
import TaskEditView from '@/views/TaskEditView.vue'
import ButtonTestjobRun from '@/components/forms/ButtonTestjobRun.vue'
import ButtonTaskToEdit from '@/components/forms/ButtonTaskToEdit.vue'
import ButtonTaskToStart from '@/components/forms/ButtonTaskToStart.vue'

export default {
  components: {
    ButtonSharePage,
    TaskDetails,
    Drawer,
    TaskEditView,
    ButtonTestjobRun,
    ButtonTaskToEdit,
    ButtonTaskToStart
  },

  props: {
    testPlan: {
      type: Object,
      default: () => new TestPlan()
    },
    task: {
      type: Object,
      default: () => new Task()
    },
    testcasesCascade: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      states: utilStates.states
    }
  },

  computed: {
    ...mapState('user', ['user']),
    ...mapGetters('user', ['isLoggedIn']),
    urlParams () {
      return {}
    },
    testjobFromTask () {
      if (this.testPlan.serial && this.task.serial && this.testcasesCascade.length > 0) {
        return utilTask.testjobFromTask(this.testPlan, this.task, this.testcasesCascade)
      } else {
        return undefined
      }
    }
  },

  watch: {
    'testPlan.serial': function (newValue) {
      if (newValue) {
        const _this = this
        const op = _this.$route.query.op
        switch (op) {
          case 'edit_task':
            this.$refs.drawerEditTask.openDrawer(`/testplans/${newValue}`)
            break
          default:
            break
        }
      }
    },
    '$route' (to, from) {
      if (from.query.op === 'edit_task' &&
        to.query.op === 'view_task') {
        this.$refs.drawerEditTask.closeDrawer()
        this.$router.push({
          path: to.path,
          query: to.query
        })
      }
    }
  },

  mounted () {},

  methods: {
    canStart (state, type) {
      return type === 'Auto' ? !utilStates.isClosed(state) : utilStates.isNew(state)
    },
    goEdit () {
      this.$refs.drawerEditTask.openDrawer(`/testplans/${this.testPlan.serial}`)
      this.$router.push({
        path: `/testplans/${this.testPlan.serial}`,
        query: { op: 'edit_task', id: this.task.serial }
      })
    },
    confirmLeave () {
      if (this.$refs.viewTaskEdit.dirty) {
        return this.$confirm(
          'Are you sure to leave without saving ?',
          'Confirm Discard',
          {
            confirmButtonText: 'Yes. Discard It',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
      }
      return new Promise((resolve, reject) => resolve('confirm'))
    },
    afterConfirm (confirm) {
      if (confirm) {
        this.$refs.viewTaskEdit.dirty = false
        this.$router.push({
          path: `/testplans/${this.testPlan.serial}`,
          query: { op: 'view_task', id: this.task.serial }
        })
        EventBus.$emit('task-edit-canceled')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.verdict-block {
  border-top: 1px solid #eef0f2;
}
.detail-header {
  padding: 18px 0 8px 0;
}
</style>
