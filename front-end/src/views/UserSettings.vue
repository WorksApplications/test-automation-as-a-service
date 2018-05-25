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
            Settings
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-flex>
      <v-flex
        xs4
        class="text-xs-right">
        <button-share-page :params="urlParams" />
      </v-flex>
      <v-flex
        xs12
        px-2>
        <v-card>
          <v-card-text>
            <v-tabs
              v-if="false"
              v-model="tabActive">
              <v-tab @click="setTab('subscribe-test-cases')">Subscribe Test Cases</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tabActive">
              <v-tab-item/>
            </v-tabs-items>
            <the-tab-subscribe-test-cases/>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import router from '@/router'
import ButtonSharePage from '@/components/forms/ButtonSharePage.vue'
import TheTabSubscribeTestCases from '@/components/setting/TheTabSubscribeTestCases.vue'

import { mapState } from 'vuex'

export default {
  name: 'UserInfo',
  components: {
    ButtonSharePage,
    TheTabSubscribeTestCases
  },

  props: {},

  data: () => ({
    tabActive: '0',
    tabMapping: {
      subscribeTestCases: '0'
    }
  }),
  computed: {
    ...mapState('user', ['user']),
    urlParams () {
      return {}
    }
  },

  watch: {
    user () {
      if (this.user === null) {
        this.$router.push({
          path: '/dashboard'
        })
      }
    }
  },

  created () {},
  mounted () {
    if (this.user === null) {
      this.$router.push({
        path: '/dashboard'
      })
    }
    let tab = router.currentRoute.hash.replace('#', '')
    if (tab === '') {
      tab = 'subscribe-test-cases'
    }
    this.tabActive = this.tabMapping[tab]
  },
  updated () {},
  destroyed () {},

  methods: {
    setTab (tabView) {
      window.location.hash = `#${router.currentRoute.path}#${tabView}`
    }
  }
}
</script>

<style>

</style>
