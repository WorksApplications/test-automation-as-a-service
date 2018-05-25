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
            Live
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
              v-model="activeTab"
              show-arrows>
              <v-tab
                v-for="item in liveList"
                :key="item.name"
                :href="`#tab-${item.name}`">
                {{ item.name }}
              </v-tab>
              <v-tabs-items>
                <v-tab-item
                  v-for="item in liveList"
                  :key="item.name"
                  :id="`tab-${item.name}`">
                  <v-card flat>
                    <v-card-text>
                      <live-window
                        :id="item.id"
                        :host="item.vncHost"
                        :port="item.vncPort"
                        :password="item.vncPassword"
                        :node-type="item.platform"
                      />
                      <v-btn
                        flat
                        block
                        color="primary"
                        @click="fullscreen(item.id)">
                        <v-icon>fullscreen</v-icon>
                        Fullscreen
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>

import api from '@/api/sysinfo'

import ButtonSharePage from '@/components/forms/ButtonSharePage.vue'
import LiveWindow from '@/components/LiveWindow.vue'

export default {
  name: 'Live',
  components: {
    ButtonSharePage,
    LiveWindow
  },

  props: {},

  data: () => ({
    liveList: [],
    activeTab: undefined
  }),
  computed: {
    urlParams () {
      return {}
    }
  },

  watch: {},

  created () {},
  mounted () {
    const _this = this
    api.fetchLiveUrls().then(res => {
      _this.liveList = res
      _this.activeTab = `tab-${res[0].name}`
    })
  },
  updated () {},
  destroyed () {},

  methods: {
    goLive (url) {
      window.open(url)
    },
    fullscreen (id) {
      const target = document.getElementById(id)
      try {
        target.webkitRequestFullScreen()
      } catch (e) {
        return false
      }
    }
  }
}
</script>

<style scoped>
.el-tab-pane {
  text-align: center;
}
</style>
