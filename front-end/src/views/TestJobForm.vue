<template>
  <div>
    <v-layout
      row
      wrap>
      <v-flex xs12>
        <v-breadcrumbs>
          <v-icon slot="divider">chevron_right</v-icon>
          <v-breadcrumbs-item disabled>
            TaaS
          </v-breadcrumbs-item>
          <v-breadcrumbs-item
            :to="{ name: 'TestJobList', params: { page: 1 } }"
            exact>
            Test Jobs
          </v-breadcrumbs-item>
          <v-breadcrumbs-item>
            New
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-flex>
      <v-flex
        xs12
        px-2>
        <v-card>
          <v-card-text>
            <form-details />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>

import FormDetails from '@/components/testjob/TheFormDetails.vue'

export default {
  components: {
    FormDetails
  }
}
</script>
