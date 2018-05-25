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
            Test Plans
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-flex>
      <v-flex
        xs4
        class="text-xs-right">
        <button-test-plan-to-new />
        <button-share-page :params="urlParams" />
      </v-flex>
      <v-flex
        xs12
        px-2>
        <test-plan-list :value="testPlans"/>
        <v-btn
          :disabled="!hasMore"
          flat
          block
          color="primary"
          @click="loadMore">
          <v-icon>more_vert</v-icon>
          {{ hasMore ? 'Load More' : 'No More Data' }}
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import testplanapi from '@/api/testplan'
import TestPlanList from '@/components/testplan/TheList.vue'
import ButtonSharePage from '@/components/forms/ButtonSharePage.vue'
import ButtonTestPlanToNew from '@/components/forms/ButtonTestPlanToNew.vue'

export default {
  components: {
    TestPlanList,
    ButtonSharePage,
    ButtonTestPlanToNew
  },
  data () {
    return {
      pageNo: 1,
      pageSize: 12,
      testPlans: [],
      hasMore: true
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    urlParams () {
      return {}
    }
  },
  created () {
    const _this = this
    _this.loadMore()
  },
  methods: {
    loadMore () {
      const _this = this
      testplanapi.getTestPlanPaginated(_this.pageNo, _this.pageSize).then(res => {
        if (res.success) {
          _this.testPlans = _this.testPlans.concat(res.test_plans)
          _this.hasMore = res.test_plans.length === _this.pageSize
          if (_this.hasMore) {
            _this.pageNo++
          }
        }
      })
    },
    goCreateTestPlan () {
      this.$router.push({ path: '/testplans/add' })
    }
  }
}
</script>
