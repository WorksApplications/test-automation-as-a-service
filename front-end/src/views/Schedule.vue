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
          <v-breadcrumbs-item
            :to="{ name: 'ScheduleList', params: { page: 1 } }"
            exact>
            Schedules
          </v-breadcrumbs-item>
          <v-breadcrumbs-item>
            #{{ schedule.serial }}
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-flex>
      <v-flex
        xs4
        class="text-xs-right">
        <button-testjob-run
          :testjob="schedule.params"
          :disabled="!isLoggedIn" />
        <button-schedule-to-edit :schedule="schedule" />
        <button-schedule-delete :schedule="schedule" />
        <button-share-page :params="urlParams" />
      </v-flex>
      <v-flex
        xs12
        px-2>
        <v-card>
          <v-card-title>
            <h2>
              Schedule #{{ schedule.serial }}:
              <small>
                <radio-platform
                  :value="schedule.params.platform"
                  :disabled="true"
                  :show-icon="true"
                  :show-label="false" />
                {{ schedule.name }}
              </small>
            </h2>
          </v-card-title>
          <v-card-text>
            <info
              ref="info"
              :schedule="schedule" />

            <h3>Running History</h3>
            <testjob-list
              ref="testjob"
              :testjobs="testjobs"
              :count="count"
              :current-page="currentPage"
              @updatePageList="changeTestjobs" />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Schedule from '@/models/Schedule.js'

import api from '@/api/schedules.js'
import testjobsapi from '@/api/testjobs.js'

import { loadingData, warning } from '@/components/InteractivePushMessage.vue'
import Info from '@/components/schedule/TheInfo.vue'
import TestjobList from '@/components/testjob/TheList.vue'
import RadioPlatform from '@/components/forms/RadioPlatform.vue'
import ButtonBack from '@/components/forms/ButtonBack.vue'
import ButtonScheduleToEdit from '@/components/forms/ButtonScheduleToEdit.vue'
import ButtonTestjobRun from '@/components/forms/ButtonTestjobRun.vue'
import ButtonScheduleDelete from '@/components/forms/ButtonScheduleDelete.vue'
import ButtonSharePage from '@/components/forms/ButtonSharePage.vue'

export default {
  name: 'ScheduleDetails',
  components: {
    Info,
    TestjobList,
    RadioPlatform,
    ButtonScheduleToEdit,
    ButtonTestjobRun,
    ButtonBack,
    ButtonScheduleDelete,
    ButtonSharePage
  },

  props: {
    serial: {
      type: Number,
      required: true
    }
  },

  data: () => ({
    schedule: new Schedule(),
    testjobs: [],
    count: 0,
    currentPage: 1
  }),
  computed: {
    ...mapState('socket', ['socket']),
    ...mapGetters('user', ['isLoggedIn']),
    urlParams () {
      return {}
    }
  },

  watch: {},

  created () {},
  mounted () {
    const _this = this
    this.updateSchedule()
    this.updateTestjobs()
    this.socket.on('update_schedule_trigger', serial => {
      if (serial === _this.serial) {
        _this.updateSchedule()
      }
    })
    this.socket.on('update_test_job', args => {
      let updateKey = args[0]
      let serial = parseInt(args[1])
      let updateValue = args[2]
      let inList = _this.testjobs.map(testjob => testjob.serial).includes(serial)
      if ((updateKey === 'progress' && inList) ||
        (updateKey === 'status' && (updateValue[0] === 'Running' || inList))) {
        _this.updateTestjobs()
      }
    })
  },
  updated () {},
  destroyed () {
    this.socket.off('update_schedule_trigger')
    this.socket.off('update_test_job')
  },

  methods: {
    updateSchedule () {
      const _this = this
      const remoteSchedule = fetchOne(this.serial)

      loadingData(remoteSchedule, this.$el).then((newSchedule) => {
        _this.schedule = newSchedule
        if (newSchedule === undefined) {
          warning(`Schedule #${_this.serial} not found!`)
          _this.$router.push({ name: 'schedules' })
        }
      })
    },
    updateTestjobs () {
      const _this = this
      const remoteTestjobsNew = fetchTestjobs(_this.serial, _this.currentPage)

      loadingData(remoteTestjobsNew, _this.$refs.testjobs).then((newTestjobs) => {
        _this.count = newTestjobs.count
        _this.testjobs = newTestjobs.testjobs
      })
    },
    changeTestjobs (currentPage) {
      this.currentPage = currentPage
      this.updateTestjobs()
    }
  }
}

const fetchOne = (id) => api.fetchOne(id)
const fetchTestjobs = (schedule, indPage) => testjobsapi.getList({ schedule: schedule, skip: 15 * (indPage - 1), limit: 15 })

</script>
