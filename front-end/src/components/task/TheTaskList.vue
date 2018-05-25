<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="tasks"
      no-data-text="No tasks yet, please create one"
      hide-actions
      class="elevation-1">
      <tr
        slot="items"
        slot-scope="props">
        <td style="max-width: 500px; overflow: hidden">
          <el-button
            type="text"
            class="truncate"
            @click="goTo(props.item, props.index)">
            <radio-platform
              v-if="props.item.type === 'Auto'"
              :value="props.item.platform"
              :disabled="true"
              :show-icon="true"
              :show-label="false" />
            {{ props.item.name }}
          </el-button>
        </td>
        <td>
          <user-avatar
            v-if="props.item.assignee && props.item.assignee !== ''"
            :username="props.item.assignee"
            size="24px" />
          {{ props.item.assignee }}
        </td>
        <td>
          <the-state :state="props.item.state"/>
        </td>
        <td>
          <tag-group-selected
            v-if="props.item.type === 'Auto'"
            :items-selected="props.item.testcases"/>
        </td>
        <td>
          <button-task-to-start
            v-if="canStart(props.item.state, props.item.type)"
            :disabled="!isLoggedIn"
            :task="props.item"
            :testjob="testjobFromTask(props.item)"
            :is-auto="props.item.type === 'Auto'"/>
          <button-task-to-close
            v-if="isInProgress(props.item.state)"
            :disabled="!isLoggedIn"
            @click.native="!isLoggedIn ? null : closeTask(props.item)"/>
        </td>
      </tr>
    </v-data-table>

    <p class="list-pagination-container">
      <el-pagination
        v-if="count > pageSize"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="count"
        layout="prev, pager, next"
        background
        @current-change="handleCurrentChange"
      />
    </p>

    <drawer ref="drawerViewTask">
      <task-details
        slot="main"
        :test-plan="testPlan"
        :task="taskToView"
        :testcases-cascade="testcasesCascade"/>
    </drawer>

  </div>
</template>

<script>
import { merge, isEqual, findIndex } from 'lodash'
import { mapGetters } from 'vuex'
import RadioPlatform from '@/components/forms/RadioPlatform.vue'
import TagGroupSelected from '@/components/forms/TagGroupSelected.vue'
import Drawer from '@/components/Drawer.vue'
import TaskDetails from '@/views/TaskDetails.vue'
import TheState from '@/components/testplan/TheState.vue'
import ButtonTestjobRun from '@/components/forms/ButtonTestjobRun.vue'
import ButtonTaskToStart from '@/components/forms/ButtonTaskToStart.vue'
import ButtonTaskToClose from '@/components/forms/ButtonTaskToClose.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import testplanapi from '@/api/testplan'
import TestPlan from '@/models/TestPlan'
import Task from '@/models/Task'
import utilsTask from '@/utils/task'
import utilStates from '@/utils/states'

import router from '@/router'
import { EventBus } from '@/utils/eventBus'

export default {
  components: {
    RadioPlatform,
    TagGroupSelected,
    Drawer,
    TaskDetails,
    TheState,
    ButtonTestjobRun,
    ButtonTaskToStart,
    ButtonTaskToClose,
    UserAvatar
  },

  props: {
    testPlan: {
      type: Object,
      default: () => new TestPlan()
    },
    tasks: {
      type: Array,
      default: () => []
    },
    testcasesCascade: {
      type: Array,
      default: () => []
    },
    count: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },

  data: () => ({
    taskToView: new Task(),
    taskIndex: -1,
    newTask: true,
    headers: [
      {
        text: 'Name',
        sortable: false,
        value: 'name',
        width: '400px'
      }, {
        text: 'Assignee',
        sortable: false,
        value: 'assignee',
        width: '150px'
      }, {
        text: 'State',
        sortable: false,
        value: 'state',
        width: '100px'
      }, {
        text: 'Test Cases',
        sortable: false,
        value: 'testcases',
        width: '400px'
      }, {
        text: 'Operations',
        sortable: false,
        value: 'operations',
        width: '200px'
      }
    ]
  }),

  computed: {
    ...mapGetters('user', ['isLoggedIn'])
  },

  watch: {
    'testPlan.serial': function (newValue) {
      if (newValue) {
        this.showTask()
      }
    },
    '$route' (to, from) {
      if (from.query.op === 'view_task' &&
        to.query.op === 'edit_task') {
        this.$refs.drawerViewTask.closeDrawer()
        this.$router.push({ path: to.path, query: to.query })
      } else if (from.query.op && to.query.op === 'view_task') {
        if (from.query.op === 'add_task') {
          this.newTask = true
        }
      }
      if (to.query.op === 'view_task') {
        this.showTask()
      }
    },
    tasks: function (newValue, oldValue) {
      if (!isEqual(newValue, oldValue)) {
        if (!this.newTask) {
          if (this.taskIndex !== -1 && this.$route.query.id === this.tasks[this.taskIndex].serial) {
            this.taskToView = this.tasks[this.taskIndex]
          }
        } else {
          this.newTask = false
        }
      }
    }
  },

  mounted () {
    if (this.testPlan.serial) {
      this.showTask()
    }
  },

  methods: {
    isInProgress (state) {
      return utilStates.isInProgress(state)
    },
    canStart (state, type) {
      return type === 'Auto' ? !utilStates.isClosed(state) : utilStates.isNew(state)
    },
    goTo (task, index) {
      this.taskToView = task
      this.taskIndex = index
      this.newTask = false
      this.$refs.drawerViewTask.openDrawer(`/testplans/${this.testPlan.serial}`)
      router.push({ path: `/testplans/${this.testPlan.serial}`, query: { op: 'view_task', id: task.serial } })
    },
    showTask () {
      const _this = this
      const op = this.$route.query.op
      switch (op) {
        case 'view_task':
          getTask(_this.testPlan.serial, _this.$route.query.id).then(res => {
            if (res.success) {
              res.task.start = new Date(res.task.start)
              res.task.end = new Date(res.task.end)
              _this.taskToView = JSON.parse(JSON.stringify(merge(new Task(), res.task)))
              _this.taskIndex = findIndex(_this.tasks, task => {
                return isEqual(task.serial, _this.taskToView.serial)
              })
              if (_this.taskIndex === -1) {
                _this.taskIndex = 0
              }
              _this.newTask = false
            }
          })
          _this.$refs.drawerViewTask.openDrawer(`/testplans/${_this.testPlan.serial}`)
          break
        case 'edit_task':
          getTask(_this.testPlan.serial, _this.$route.query.id).then(res => {
            if (res.success) {
              res.task.start = new Date(res.task.start)
              res.task.end = new Date(res.task.end)
              _this.taskToView = JSON.parse(JSON.stringify(merge(new Task(), res.task)))
            }
          })
          break
        default:
          break
      }
    },
    handleCurrentChange (page) {
      this.$emit('paginatedTo', page)
    },
    testjobFromTask (task) {
      if (this.testPlan.serial && this.testcasesCascade.length > 0) {
        return utilsTask.testjobFromTask(this.testPlan, task, this.testcasesCascade)
      } else {
        return undefined
      }
    },
    closeTask (task) {
      updateTaskState(this.testPlan.serial, task.serial, utilStates.states.finished.value)
      EventBus.$emit('task-edit-saved')
    }
  }
}

const getTask = (testPlanSerial, taskSerial) =>
  testplanapi.getTask(testPlanSerial, taskSerial)
const updateTaskState = (testPlanSerial, taskSerial, state) =>
  testplanapi.updateTaskState(testPlanSerial, taskSerial, state)
</script>

<style>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.my-list-pagination {
  margin: 10px 0 0 0;
}
.my-list-pagination > .el-pagination > ul > li {
  margin-top: 0;
}
.my-list-pagination-el {
  padding: 0px;
}
</style>

<style scoped>
.list-pagination-container {
  padding: 5px 0px;
  text-align: center;
}
</style>
