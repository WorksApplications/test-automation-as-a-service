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
            Profile
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
            <el-form v-if="user">
              <el-form-item
                label="Username"
                prop="username">
                {{ user.username }}
              </el-form-item>
              <el-form-item
                v-if="user.email"
                label="Email"
                prop="email">
                {{ user.email }}
              </el-form-item>
              <el-form-item
                v-if="user.email"
                label="API token"
                prop="email">
                <template v-if="showApiToken">
                  {{ user.api_token }}
                </template>
                <template v-else>
                  {{ '*'.repeat(32) }}
                </template>
              </el-form-item>
              <span>
                <el-button
                  v-if="user && user.api_token"
                  type="info"
                  @click="showApiToken = !showApiToken">
                  {{ showApiToken ? 'Hide': 'Show' }}
                </el-button>
                <el-button
                  type="warning"
                  @click="generateApiToken">
                  Generate API Token
                </el-button>
              </span>
            </el-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import ButtonSharePage from '@/components/forms/ButtonSharePage.vue'

import { mapState } from 'vuex'
import store from '@/store'

export default {
  name: 'UserInfo',
  components: {
    ButtonSharePage
  },

  props: {},

  data () {
    return {
      showApiToken: false
    }
  },
  computed: {
    ...mapState('user', ['user']),
    urlParams () {
      return {}
    }
  },

  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    generateApiToken () {
      const _this = this
      store.dispatch('user/generateApiToken').then(apiToken => {
        if (apiToken) {
          _this.showApiToken = true
        }
      })
    }
  }
}
</script>

<style>

</style>
