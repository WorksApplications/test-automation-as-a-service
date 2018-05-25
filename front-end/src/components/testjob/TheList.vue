<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="displayedTestjobs"
      hide-actions
      class="elevation-1">
      <template
        slot="items"
        slot-scope="props">
        <tr>
          <td>{{ props.item.serial }}</td>
          <td>
            <span v-if="props.item.scheduleSerial">
              <v-avatar size="24px">
                <v-icon>schedule</v-icon>
              </v-avatar>
              Scheduler
            </span>
            <span v-else>
              <user-avatar
                :username="props.item.operator"
                size="24px" />
              {{ props.item.operator }}
            </span>
          </td>
          <td>
            <router-link
              :to="{
                name: 'TestJobDetails',
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
              {{ props.item.params.name }}
            </router-link>
          </td>
          <td>
            <v-tooltip bottom>
              <span slot="activator">
                {{ dateDisplay(serverDate, props.item.create) }}
              </span>
              <span>{{ props.item.create }}</span>
            </v-tooltip>
          </td>
          <td>
            {{ dateDuration(serverDate, props.item.start, props.item.finish) }}
          </td>
          <td>
            <verdict
              :value="props.item.status"
              :result="props.item.result"
              :link="props.item.report"
              :resolve="props.item.resolve"
              :show-details="false" />
          </td>
        </tr>
      </template>
    </v-data-table>
    <p class="list-pagination-container">
      <el-pagination
        v-if="!localPagination && count > pageSize"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="count"
        layout="prev, pager, next"
        background
        @current-change="handleCurrentChange" />
      <el-pagination
        v-if="localPagination"
        :current-page="localPage"
        :page-size="pageSize"
        :total="testjobs.length"
        layout="prev, pager, next"
        background
        @current-change="changeLocalPage" />
    </p>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import Verdict from '@/components/testjob/Verdict.vue'
import ButtonTestjobToLog from '@/components/forms/ButtonTestjobToLog.vue'
import ButtonTestjobToLive from '@/components/forms/ButtonTestjobToLive.vue'
import ButtonTestjobToReplay from '@/components/forms/ButtonTestjobToReplay.vue'
import ButtonTestjobToResolve from '@/components/forms/ButtonTestjobToResolve.vue'
import ButtonTestjobCancel from '@/components/forms/ButtonTestjobCancel.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import FieldTime from '@/components/FieldTime.vue'
import RadioPlatform from '@/components/forms/RadioPlatform.vue'

import utilsTime from '@/utils/time.js'
import router from '@/router'

export default {
  name: 'TestjobList',
  components: {
    Verdict,
    ButtonTestjobToLog,
    ButtonTestjobToLive,
    ButtonTestjobToReplay,
    ButtonTestjobToResolve,
    ButtonTestjobCancel,
    UserAvatar,
    FieldTime,
    RadioPlatform
  },

  props: {
    testjobs: {
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
        text: 'Operator',
        sortable: false,
        value: 'operator',
        width: '160px'
      }, {
        text: 'Name',
        sortable: false,
        value: 'name'
      }, {
        text: 'Date',
        sortable: false,
        value: 'date',
        width: '150px'
      }, {
        text: 'Duration',
        sortable: false,
        value: 'duration',
        width: '150px'
      }, {
        text: 'Verdict',
        sortable: false,
        value: 'verdict',
        width: '120px'
      }
    ],
    localPage: 1
  }),
  computed: {
    ...mapState('sysinfo', [
      'serverDate'
    ]),
    localPagination () {
      return this.testjobs.length > this.pageSize
    },
    displayedTestjobs () {
      if (this.testjobs.length > this.pageSize) {
        return this.testjobs.filter((testjob, index) => index >= this.pageSize * (this.localPage - 1) && index < this.pageSize * this.localPage)
      } else {
        return this.testjobs
      }
    }
  },
  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    // Event emitter
    handleCurrentChange (page) {
      this.$emit('paginatedTo', page)
    },
    changeLocalPage (page) {
      this.localPage = page
    },

    goTo: (id) => router.push({ path: '/testjobs/details/' + id }),

    getResolve (testjob) {
      if (testjob.resolve) {
        return testjob.resolve
      } else if (testjob.result['passed'] !== testjob.result.total) {
        return {
          resolved: false,
          reason: '',
          comment: ''
        }
      } else {
        return {}
      }
    },
    needResolve (testjob) {
      if (testjob.resolve || testjob.result['passed'] !== testjob.result.total) {
        return true
      } else {
        return false
      }
    },
    classResolved (testjob) {
      if (this.needResolve(testjob)) {
        const resolve = this.getResolve(testjob)
        return {
          'btn-unresolved': !resolve.resolved,
          'btn-resolved': resolve.resolved
        }
      }
    },
    dateDuration: utilsTime.dateDuration,
    dateDisplay: utilsTime.dateDisplay
  }
}

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
  .my-list-pagination>.el-pagination>ul>li {
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
