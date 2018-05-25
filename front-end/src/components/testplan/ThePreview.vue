<template>
  <div class="the-test-plan-preview">
    <v-layout
      row
      class="heading">
      <v-flex xs7>
        <h2
          :class="{'diff-field': isFieldUpdated('name')}">
          Test Plan : {{ value.name }}
        </h2>
      </v-flex>
      <v-flex
        xs5
        class="text-xs-right">
        <div
          v-if="value.creator"
          class="create-info">
          Created at
          <field-time
            :value="getStartTime(value._id)"
            format-type="fullDateTime" />
          <span>by</span>
          <user-avatar
            slot="activator"
            :username="value.creator"
            size="24px" />
          <span>{{ value.creator }}</span>
        </div>
        <v-flex
          v-if="value.collaborators.length > 0"
          xs12
          class="text-xs-right">
          <span style="font-size: 12px">
            Collaborators:
          </span>
          <user-ellipsis
            :users="value.collaborators"
            :limit="5"
            bottom
            right/>
        </v-flex>
      </v-flex>
    </v-layout>
    <div>
      <the-state
        :state="value.state"
        :class="{'diff-field': isFieldUpdated('state')}"
        class="state-tag"/>
    </div>

    <span :class="{'diff-field': isFieldUpdated('start')}">{{ formatedStartDate }}</span>
    ~
    <span :class="{'diff-field': isFieldUpdated('end')}">{{ formatedEndDate }}</span>

    <v-tabs
      v-if="!edit"
      v-model="tabActive"
      style="margin-top: 5px">
      <v-tab @click="setTab('basic')">Basic</v-tab>
      <v-tab @click="setTab('tasks')">Tasks</v-tab>
      <v-tab
        v-if="showTabResults"
        @click="setTab('results')">
        Results
      </v-tab>
      <v-tab @click="setTab('activities')">Activities</v-tab>
      <v-tab @click="setTab('comments')">Comments</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabActive">
      <v-tab-item>
        <the-tab-basic
          :objective="value.objective"
          :description="value.description"
          :environment="value.environment"/>
      </v-tab-item>
      <v-tab-item v-if="!edit">
        <the-tab-tasks
          ref="tabTasks"
          :test-plan="value"
          :testcases-cascade="testcasesCascade"/>
      </v-tab-item>
      <v-tab-item v-if="showTabResults && !edit">
        <the-tab-results
          ref="tabResults"
          :serial="value.serial"
          :branch="value.branch"
          :testcases="value.testcases"
          :platforms="value.platforms"
          :testcases-cascade="testcasesCascade"
          :verdict="value.verdict"
          :state="value.state"/>
      </v-tab-item>
      <v-tab-item v-if="!edit">
        <the-tab-activities
          :activities="activitiesReverse"
          class="tab-activities"/>
      </v-tab-item>
      <v-tab-item v-if="!edit">
        <the-tab-comments
          :serial="value.serial"
          :comments="value.comments"
          :active="tabActive === tabMapping['comments']"
          class="tab-comment"/>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import router from '@/router'
import moment from 'moment'
import { getDateTimeFromObjectId } from '@/utils/date'
import TheState from './TheState.vue'
import FieldTime from '@/components/FieldTime.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import UserEllipsis from '@/components/UserEllipsis.vue'
import TheTabBasic from '@/components/testplan/TheTabBasic.vue'
import TheTabTasks from '@/components/testplan/TheTabTasks.vue'
import TheTabResults from '@/components/testplan/TheTabResults.vue'
import TheTabActivities from '@/components/testplan/TheTabActivities.vue'
import TheTabComments from '@/components/testplan/TheTabComments.vue'
import testcasesapi from '@/api/testcases'
import utilTestcase from '@/utils/testcase'
import { states } from '@/utils/states'

export default {
  components: {
    TheState,
    FieldTime,
    UserAvatar,
    UserEllipsis,
    TheTabBasic,
    TheTabTasks,
    TheTabResults,
    TheTabActivities,
    TheTabComments
  },

  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    diff: {
      type: Array,
      default: () => []
    },
    edit: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      testcasesCascade: [],
      tabActive: '0',
      states,
      tabMapping: {
        basic: '0',
        tasks: '1',
        activities: '2',
        comments: '3',
        results: '4'
      }
    }
  },

  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    formatedStartDate () {
      const _this = this
      if (_this.value && _this.value.start) {
        return moment(_this.value.start).format('YYYY-MM-DD')
      } else {
        return ''
      }
    },
    formatedEndDate () {
      const _this = this
      if (_this.value && _this.value.end) {
        return moment(_this.value.end).format('YYYY-MM-DD')
      } else {
        return ''
      }
    },
    showTabResults () {
      return this.value.testcases.length > 0 ||
        (this.$refs.tabResults && this.$refs.tabResults.countAttachment > 0) ||
        (this.value.verdict && this.value.verdict.result && this.value.state === this.states['finished'].value)
    },
    activitiesReverse () {
      if (this.value.activities) {
        return this.value.activities.slice(0).reverse()
      }
      return []
    }
  },

  watch: {
    'value.branch' () {
      this.updateTestcases()
    },
    '$route' (to, from) {
      if (to.query.op === 'view_task') {
        this.tabActive = this.tabMapping['tasks']
      }
    }
  },

  mounted () {
    const _this = this
    _this.updateTestcases()
    let tab = router.currentRoute.hash.replace('#', '')
    if (tab === '') {
      tab = 'basic'
    }
    this.tabActive = this.tabMapping[tab]
    if (_this.$route.query.op === 'view_task') {
      _this.tabActive = this.tabMapping['tasks']
    }
  },

  methods: {
    firstToUpperCase (str) {
      return str.substr(0, 1).toUpperCase() + str.substr(1)
    },
    updateTestcases () {
      const _this = this
      testcasesapi.fetchAll(_this.value.branch).then(res => {
        if (res.testcases) {
          _this.testcasesCascade = utilTestcase.testcasesToCascade(res.testcases, true).items
        }
      })
    },
    getStartTime: function (objectId) {
      return getDateTimeFromObjectId(objectId).toISOString()
    },
    isFieldUpdated: function (fieldName) {
      let diff = this.diff
      if (diff) {
        return diff.some(diffItem => diffItem.key === fieldName)
      } else {
        return false
      }
    },
    setTab (tabView) {
      window.location.hash = `#${router.currentRoute.path}#${tabView}`
    }
  }
}
</script>

<style lang="scss" scoped>
.the-test-plan-preview {
  min-width: 600px;

  .heading {
    margin-bottom: 5px;
  }

  .create-info {
    line-height: 24px;
    font-size: 12px;
  }
  .state-tag {
    float: right;
  }
  .tabs__content {
    padding: 0 20px;
  }
  .tab-comment, .tab-activities {
    margin: 0 50px;
  }
}
</style>

<style lang="scss">
.preview-header {
  padding: 18px 0 8px 0;
}
.diff-field {
  border: 1px solid red !important;
}
.preview-block {
  overflow: hidden;
  padding: 20px;
  background-color: #f6f8fa;
}
</style>
