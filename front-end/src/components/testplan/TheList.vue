<template>
  <v-data-iterator
    :items="value"
    content-tag="v-layout"
    hide-actions
    row
    wrap>
    <v-flex
      slot="item"
      slot-scope="props"
      xs4
      px-2
      py-2>
      <v-card height="177px">
        <v-card-title>
          <h4 style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%">
            <router-link
              :to="{
                path: `/testplans/${props.item.serial}`
              }"
              tag="a">
              {{ props.item.name }}
            </router-link>
          </h4>
          <div class="grey--text text--darken-2">
            <v-icon>date_range</v-icon>
            {{ dateString(props.item.start) }} to {{ dateString(props.item.end) }}
          </div>
          <v-spacer />
          <test-plan-verdict :verdict="props.item.state" />
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-layout row>
            <v-flex
              xs2
              class="text-xs-center">
              <v-tooltip
                bottom>
                <user-avatar
                  slot="activator"
                  :username="props.item.creator"
                  size="48px" />
                <span>{{ props.item.creator }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs10>
              <div style="max-height: 40px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; text-overflow: ellipsis;">
                <span class="grey--text text--darken-2">
                  Objective:
                </span>
                {{ props.item.objective }}
              </div>
              <div v-if="props.item.collaborators && props.item.collaborators.length > 0">
                <span class="grey--text text--darken-2">
                  Collaborators:
                </span>
                <user-ellipsis
                  :users="props.item.collaborators"
                  :limit="6"
                  :users-per-row="10"
                  bottom
                  right/>
              </div>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-data-iterator>
</template>

<script>
import { getDateTimeFromObjectId } from '../../utils/date'
import UtilsTime from '@/utils/time.js'
import TheState from './TheState.vue'
import FieldTime from '@/components/FieldTime.vue'
import TestPlanVerdict from '@/components/testplan/Verdict.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import UserEllipsis from '@/components/UserEllipsis.vue'

export default {
  components: {
    TheState,
    FieldTime,
    TestPlanVerdict,
    UserAvatar,
    UserEllipsis
  },

  props: {
    value: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({}),

  computed: {},

  methods: {
    goDetail (serial) {
      this.$router.push({ path: `/testplans/${serial}` })
    },
    getStartTime: function (objectId) {
      return getDateTimeFromObjectId(objectId).toUTCString()
    },
    isObsolete: function (item) {
      let now = new Date()
      let endDate = new Date(item.end)
      return now > endDate
    },
    showCountdownTag: function (item) {
      return (
        !this.isObsolete(item) &&
        (item.state === 'new' || item.state === 'in progress')
      )
    },
    dateString: UtilsTime.dateString
  }
}
</script>
