<template>
  <el-main>
    <el-card class="box-card">
      <el-row
        type="flex"
        justify="center">
        <el-col
          :xs="24"
          :sm="21"
          :md="18"
          :lg="15">
          <h1>Schedule</h1>
          <edit
            :value="schedule"
            :view-type="viewType"/>
        </el-col>
      </el-row>
    </el-card>
  </el-main>
</template>

<script>

import Schedule from '@/models/Schedule.js'

import api from '@/api/schedules.js'

import Edit from '@/components/schedule/Edit.vue'
import { loadingData } from '@/components/InteractivePushMessage.vue'

const fetchOne = (id) => api.fetchOne(id)

export default {
  components: {
    Edit
  },
  data: () => ({
    schedule: new Schedule(),
    viewType: 'new'
  }),
  mounted () {
    const route = this.$route
    this.viewType = route.path.startsWith('/schedules/edit') ? 'edit' : 'new'
    if (this.viewType === 'edit') {
      const id = route.params.id
      if (id) {
        const _this = this
        const dom = this.$el
        const remoteData = fetchOne(id)

        const resetSchedule = (newSchedule) => {
          _this.schedule = newSchedule
        }

        loadingData(remoteData, dom).then(resetSchedule)
      }
    }
  }
}
</script>
