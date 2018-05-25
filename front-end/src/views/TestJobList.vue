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
            Test Jobs
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-flex>
      <v-flex
        xs4
        class="text-xs-right">
        <button-testjob-to-new />
        <button-share-page :params="urlParams" />
      </v-flex>
      <v-flex
        xs12
        px-2>
        <list
          :testjobs="testjobs"
          :count="count"
          :current-page="page"
          :page-size="pageSize"
          @paginatedTo="handlePagination" />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import router from '@/router'
import ApiTestjobs from '@/api/testjobs.js'
import UtilsPushMessages from '@/utils/pushMessages.js'
import List from '@/components/testjob/TheList.vue'
import ButtonTestjobToNew from '@/components/forms/ButtonTestjobToNew.vue'
import ButtonSharePage from '@/components/forms/ButtonSharePage.vue'

export default {

  name: 'Testjobs',
  components: {
    List,
    ButtonTestjobToNew,
    ButtonSharePage
  },

  props: {
    page: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 15
    }
  },

  data: () => ({
    responseJson: {},
    count: 0,
    testjobs: []
  }),
  computed: {
    ...mapState('socket', ['socket']),
    urlParams () {
      return {}
    }
  },
  watch: {
    page () {
      this.updateTestJobList(this.page)
    },
    responseJson (responseJson) {
      if (responseJson.success === true) {
        this.count = responseJson.count
        this.testjobs = responseJson.testjobs
      } else {
        UtilsPushMessages.error(responseJson.info)
      }
    }
  },

  created () {},
  mounted () {
    const _this = this
    _this.updateTestJobList(this.page)
    this.socket.on('update_test_job', args => {
      let updateKey = args[0]
      let serial = parseInt(args[1])
      let updateValue = args[2]
      let inList = _this.testjobs.map(testjob => testjob.serial).includes(serial)
      if ((updateKey === 'progress' && inList) ||
        (updateKey === 'status' && (updateValue[0] === 'Running' || inList))) {
        _this.updateTestJobList(_this.page)
      }
    })
  },
  updated () {},
  destroyed () {
    this.socket.off('update_test_job')
  },

  methods: {
    // Event handlers
    handlePagination: (page) => router.push(`/testjobs/list/${page}`),

    // Utility & Methods
    updateTestJobList: async function (page) {
      const pageSize = this.pageSize
      this.responseJson = await ApiTestjobs.query({
        skip: pageSize * (page - 1),
        limit: pageSize
      })
    }
  }
}

</script>

<style lang="scss" scoped>
</style>
