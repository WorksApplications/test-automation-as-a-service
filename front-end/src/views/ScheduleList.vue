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
            Schedules
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-flex>
      <v-flex
        xs4
        class="text-xs-right">
        <button-schedule-to-new />
        <button-share-page :params="urlParams" />
      </v-flex>
      <v-flex
        xs12
        px-2>
        <list
          :schedules="schedules"
          :count="count"
          :current-page="currentPage"
          @updatePageList="changeSchedulesList" />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>

import api from '@/api/schedules.js'

import List from '@/components/schedule/TheList.vue'
import { loadingData } from '@/components/InteractivePushMessage.vue'
import { mapState } from 'vuex'
import ButtonScheduleToNew from '@/components/forms/ButtonScheduleToNew.vue'
import ButtonSharePage from '@/components/forms/ButtonSharePage.vue'

export default {
  name: 'ScheduleList',
  components: {
    List,
    ButtonScheduleToNew,
    ButtonSharePage
  },
  data () {
    return {
      schedules: [],
      count: 0,
      isCountChange: false,
      currentPage: 1
    }
  },
  computed: {
    ...mapState('socket', ['socket']),
    urlParams () {
      return {}
    }
  },
  mounted () {
    const _this = this
    this.updateScheduleForPage(this.currentPage)

    this.socket.on('update_schedule_trigger', serial => {
      _this.updateScheduleForPage(_this.currentPage)
    })
  },
  destroyed () {
    this.socket.off('update_schedule_trigger')
  },
  methods: {
    changeSchedulesList (currentPage) {
      this.currentPage = currentPage
      this.updateScheduleForPage(currentPage)
    },
    updateScheduleForPage (currentPage) {
      const _this = this
      const remoteDataNew = fetchSchedules(currentPage)
      loadingData(remoteDataNew, _this.$el).then((newSchedules) => {
        _this.count = newSchedules.count
        _this.schedules = newSchedules.schedules
      })
    }
  }
}

const fetchSchedules = (indPage) => api.getList({ showAll: 1, skip: 15 * (indPage - 1), limit: 15 })

</script>
