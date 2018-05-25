<template>
  <div>
    <v-layout
      row
      wrap>
      <v-flex
        xs12
        class="text-xs-right">
        <button-task-to-new
          :disabled="!isLoggedIn"
          :is-icon="true"
          @click.native="!isLoggedIn ? null : createTask()"/>
      </v-flex>
    </v-layout>
    <task-list
      :test-plan="testPlan"
      :tasks="tasks"
      :testcases-cascade="testcasesCascade"
      :count="countTask"
      :current-page="page"
      :page-size="pageSize"
      @paginatedTo="paginatedTo"/>
    <drawer ref="drawerSubmitTask">
      <task-submit-form
        slot="main"
        :test-plan="testPlan" />
    </drawer>
  </div>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import ButtonTaskToNew from '@/components/forms/ButtonTaskToNew.vue'
import TaskList from '@/components/task/TheTaskList.vue'
import Drawer from '@/components/Drawer.vue'
import TaskSubmitForm from '@/views/TaskSubmitForm.vue'
import { EventBus } from '@/utils/eventBus'
import testplanapi from '@/api/testplan'

export default {
  components: {
    ButtonTaskToNew,
    TaskList,
    Drawer,
    TaskSubmitForm
  },

  props: {
    testPlan: {
      type: Object,
      default: () => ({})
    },
    testcasesCascade: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    tasks: [],
    countTask: 0,
    page: 1,
    pageSize: 9
  }),

  computed: {
    ...mapGetters('user', ['isLoggedIn'])
  },

  mounted () {
    const _this = this
    _this.updateTasks()
    _this.$nextTick(() => {
      EventBus.$on('testjob-update', () => {
        _this.updateTasks()
        return true
      })
      EventBus.$on('task-edit-saved', () => {
        _this.updateTasks()
        store.dispatch('cache/updateTasksName', _this.testPlan.serial)
        return true
      })
    })
  },

  destroyed () {
    EventBus.$off('testjob-update')
    EventBus.$off('task-edit-saved')
  },

  methods: {
    updateTasks: async function () {
      let testPlanSerial = this.$route.params.id
      if (!testPlanSerial) return
      let response = await getTasks(testPlanSerial, {
        limit: this.pageSize
      })
      this.tasks = response.tasks
      this.countTask = response.count
      await this.paginatedTo(this.page)
    },
    paginatedTo: async function (page) {
      let testPlanSerial = this.$route.params.id
      this.page = page
      let response = await getTasks(testPlanSerial, {
        skip: this.pageSize * (this.page - 1),
        limit: this.pageSize
      })
      this.tasks = response.tasks
    },
    createTask () {
      this.$refs.drawerSubmitTask.openDrawer(`/testplans/${this.testPlan.serial}`)
      this.$router.push({ path: `/testplans/${this.testPlan.serial}`, query: { op: 'add_task' } })
    }
  }
}
const getTasks = (testPlanSerial, params) =>
  testplanapi.getTasks(testPlanSerial, params)
</script>

<style lang="scss" scoped>

</style>
