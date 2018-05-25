<template>
  <v-layout
    row
    wrap>
    <v-flex
      xs12
      class="text-xs-right">
      <button-edit-cancel
        :disabled="!isLoggedIn"
        @click.native="!isLoggedIn ? null : cancel()"/>
      <button-edit-save
        :disabled="!isLoggedIn"
        @click.native="!isLoggedIn ? null : saveTask()"/>
    </v-flex>
    <v-flex
      xs12
      px-2>
      <v-card>
        <v-card-text>
          <h2>Edit Task</h2>
          <task-edit-form
            ref="task"
            :test-plan="testPlan"
            v-model="task"
            :testcases-cascade="testcasesCascade"
            @change="dirty = true"/>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import { states } from '@/utils/states'
import { EventBus } from '@/utils/eventBus'

import TestPlan from '@/models/TestPlan'
import Task from '@/models/Task'

import testplanapi from '@/api/testplan'

import { submitNotice } from '@/components/InteractivePushMessage.vue'
import TaskEditForm from '@/components/task/TheEditForm.vue'
import ButtonBack from '@/components/forms/ButtonBack.vue'
import FieldTime from '@/components/FieldTime.vue'
import ButtonEditCancel from '@/components/forms/ButtonEditCancel.vue'
import ButtonEditSave from '@/components/forms/ButtonEditSave.vue'

export default {
  components: {
    TaskEditForm,
    ButtonBack,
    FieldTime,
    ButtonEditCancel,
    ButtonEditSave
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
      comparing: false,
      comparingEdit: false,
      errorChangedByOthers: undefined,
      errorDiff: undefined,
      confirmApply: false,
      dirty: false,
      states
    }
  },

  computed: {
    ...mapState('user', ['user']),
    ...mapGetters('user', ['isLoggedIn'])
  },

  watch: {},

  mounted () {},

  methods: {
    saveTask () {
      const _this = this

      _this.$refs.task.$refs.task.validate(valid => {
        if (valid) {
          let saveData = saveTask(
            _this.testPlan.serial,
            _this.task,
            _this.confirmApply
          )
          submitNotice(saveData, _this.$el)
            .then(res => {
              if (res && res.success) {
                _this.dirty = false
                _this.$router.push({
                  path: `/testplans/${_this.testPlan.serial}`,
                  query: { op: 'view_task', id: this.task.serial }
                })
                EventBus.$emit('task-edit-saved')
              }
            })
            .catch(errResponse => {
              if (errResponse.status === 409) {
                errResponse.json().then(data => {
                  _this.comparing = true
                  _this.errorChangedByOthers = data.info
                  _this.errorDiff = data.diff
                })
              }
              _this.confirmApply = false
            })
        } else {
          _this.comparingEdit = true
          return false
        }
      })
    },
    saveTaskWithOverride () {
      const _this = this
      _this
        .$confirm(
          'Remote data will be overrided',
          'Confirm Save Your Changes?',
          {
            confirmButtonText: 'Confirm To Save',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
        .then(() => {
          if (!_this.comparingEdit) {
            _this.comparingEdit = true
          }
          _this.$nextTick(() => {
            _this.confirmApply = true
            _this.saveTask()
          })
        })
        .catch(() => {})
    },
    cancel () {
      this.$router.push({
        path: `/testplans/${this.testPlan.serial}`,
        query: { op: 'view_task', id: this.task.serial }
      })
      EventBus.$emit('task-edit-canceled')
    }
  }
}

const saveTask = (testPlanSerial, task, confirmApply = false) =>
  testplanapi.saveTask(testPlanSerial, task, confirmApply)

</script>

<style lang="scss" scoped>
.verdict-block {
  border-top: 1px solid #eef0f2;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.error-changed-by-others {
  color: #f56c6c;
  text-align: center;
  font-size: 18px;

  .highlight {
    font-weight: bold;
  }
  a {
    color: #f56c6c;
  }
}
.local-version-container,
.remote-version-container {
  overflow-x: auto;
}
</style>
