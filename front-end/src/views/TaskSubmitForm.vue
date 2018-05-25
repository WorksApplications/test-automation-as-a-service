<template>
  <v-layout
    row
    wrap>
    <v-flex
      xs12
      class="text-xs-right">
      <button-edit-submit
        :disabled="!isLoggedIn"
        @click.native="!isLoggedIn ? null : submitTask()"/>
    </v-flex>
    <v-flex
      xs12
      px-2>
      <v-card>
        <v-card-text>
          <h2>Create Task</h2>
          <task-edit-form
            ref="task"
            :value.sync="task"
            :test-plan="testPlan"
            :testcases-cascade="testcasesCascade"/>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { submitNotice } from '@/components/InteractivePushMessage.vue'
import TaskEditForm from '@/components/task/TheEditForm.vue'
import ButtonEditSubmit from '@/components/forms/ButtonEditSubmit.vue'
import Task from '@/models/Task'
import TestPlan from '@/models/TestPlan'
import testplanapi from '@/api/testplan'
import testcasesapi from '@/api/testcases'
import { EventBus } from '@/utils/eventBus'
import utilTestcase from '@/utils/testcase'

export default {
  components: {
    TaskEditForm,
    ButtonEditSubmit
  },

  props: {
    testPlan: {
      type: Object,
      default: new TestPlan()
    }
  },

  data: () => ({
    task: new Task(),
    testcasesCascade: []
  }),

  computed: {
    ...mapState('user', ['user']),
    ...mapGetters('user', ['isLoggedIn'])
  },

  watch: {
    user () {
      if (this.user) {
        this.task.assignee = this.user.username
      }
    }
  },

  mounted () {
    const _this = this
    testcasesapi.fetchAll(_this.testPlan.branch).then(res => {
      if (res.testcases) {
        _this.testcasesCascade = utilTestcase.testcasesToCascade(res.testcases, true).items
      }
    })
    if (this.user && this.task.assignee === '') {
      this.task.assignee = this.user.username
    }
  },

  methods: {
    submitTask () {
      const _this = this
      _this.$refs.task.$refs.task.validate(valid => {
        if (valid) {
          _this.task.start = _this.testPlan.start
          _this.task.end = _this.testPlan.end
          let submitData = createTask(_this.task, _this.testPlan.serial)
          submitNotice(submitData, _this.$el).then(res => {
            if (res && res.success) {
              _this.dirty = false
              _this.$router.push({ path: `/testplans/${this.testPlan.serial}`, query: { op: 'view_task', id: res.task.serial } })
              EventBus.$emit('task-edit-saved')
            }
          })
          // submit
        } else {
          return false
        }
      })
    }
  }
}

const createTask = (task, testPlanSerial) =>
  testplanapi.createTask(task, testPlanSerial)
</script>
