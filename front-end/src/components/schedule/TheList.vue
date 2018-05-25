<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="schedules"
      hide-actions
      class="elevation-1">
      <template
        slot="items"
        slot-scope="props">
        <tr>
          <td>{{ props.item.serial }}</td>
          <td>
            <v-avatar size="24px">
              <img
                src="static/avatar.png"
                alt="avatar">
            </v-avatar>
            Anonymous
          </td>
          <td>
            <router-link
              :to="{
                name: 'ScheduleDetails',
                params: {
                  serial: props.item.serial
                }
              }"
              tag="a">
              <radio-platform
                v-model="props.item.params.platform"
                :disabled="true"
                :show-icon="true"
                :show-label="false" />
              {{ props.item.name }}
            </router-link>
          </td>
          <td>
            <input-cron
              v-model="props.item.cron"
              :disabled="true" />
          </td>
          <td>
            <field-time
              v-if="props.item.enabled"
              :value="props.item.nextRun"
              format-type="fullDateTime" />
            <em v-else>
              Not activated
            </em>
          </td>
          <td>
            <switch-schedule-active
              v-model="props.item"
              :next-run.sync="props.item.nextRun"/>
          </td>
        </tr>
      </template>
    </v-data-table>
    <p class="list-pagination-container">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="count"
        layout="prev, pager, next"
        background
        @current-change="handleCurrentChange" />
    </p>

  </div>
</template>

<script>
import router from '@/router'
import SwitchScheduleActive from '@/components/forms/SwitchScheduleActive.vue'
import ButtonScheduleToEdit from '@/components/forms/ButtonScheduleToEdit.vue'
import ButtonScheduleDelete from '@/components/forms/ButtonScheduleDelete.vue'
import InputCron from '@/components/forms/InputCron.vue'
import FieldTime from '@/components/FieldTime.vue'
import RadioPlatform from '@/components/forms/RadioPlatform.vue'

export default {
  name: 'ScheduleList',
  components: {
    SwitchScheduleActive,
    ButtonScheduleToEdit,
    ButtonScheduleDelete,
    InputCron,
    FieldTime,
    RadioPlatform
  },

  props: {
    schedules: {
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
      default: 15
    }
  },

  data: () => ({
    headers: [
      {
        text: '#',
        sortable: false,
        value: 'id',
        width: '80px'
      }, {
        text: 'Owner',
        sortable: false,
        value: 'owner',
        width: '160px'
      }, {
        text: 'Name',
        sortable: false,
        value: 'name'
      }, {
        text: 'Schedule',
        sortable: false,
        value: 'cron',
        width: '150px'
      }, {
        text: 'Next run',
        sortable: false,
        value: 'nextRun',
        width: '200px'
      }, {
        text: 'Active',
        sortable: false,
        value: 'active',
        width: '120px'
      }
    ]
  }),
  computed: {},
  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    jumpToEdit (id) {
      gotoEditSchedule(id)
    },
    jumpToDetails (id) {
      gotoDetails(id)
    },
    handleCurrentChange (myCurrentPage) {
      this.$emit('updatePageList', myCurrentPage)
    }
  }

}

const gotoEditSchedule = (id) => router.push({ path: `/schedules/edit/${id}` })
const gotoDetails = (id) => router.push({ path: `/schedules/${id}` })

</script>

<style scoped>
  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .list-pagination-container {
    padding: 5px 0px;
    text-align: center;
  }
</style>
