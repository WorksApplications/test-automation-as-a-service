<template>
  <v-dialog
    v-model="componentIsFilterDialogOpened"
    scrollable
    max-width="800px"
    style="background-color: red;">
    <v-card>
      <v-card-title>
        <div class="title">Dashboard filter</div>
      </v-card-title>
      <v-card-text>
        <v-layout
          row
          wrap>
          <v-flex xs8>
            <select-branch v-model="componentBranch" />
          </v-flex>
          <v-flex xs4>
            <v-btn-toggle
              v-model="componentPlatformsToShow"
              multiple>
              <v-tooltip
                v-for="platform in platforms"
                :key="platform.value"
                top>
                <v-btn
                  slot="activator"
                  :value="platform.value"
                  flat>
                  <icon
                    :name="platform.icon.replace('fa-', '')"
                    scale="1.3" />
                </v-btn>
                <span>
                  {{ platform.label }}
                </span>
              </v-tooltip>
            </v-btn-toggle>
          </v-flex>
          <v-flex xs12>
            <v-tabs
              v-model="activeTab"
              show-arrows>
              <v-tabs-slider color="primary" />
              <v-tab
                v-for="license in licenses"
                :key="license"
                :href="`#tab-${license}`">
                {{ testcases[license].taas_metadata.name }}
              </v-tab>
              <v-tabs-items>
                <v-tab-item
                  v-for="license in licenses"
                  :key="license"
                  :id="`tab-${license}`">
                  <v-card flat>
                    <v-card-text>
                      <v-layout
                        row
                        wrap>
                        <v-flex
                          v-for="subsystem in subsystems[license]"
                          :key="subsystem.value"
                          xs4>
                          <v-switch
                            v-model="componentSubsystemsToShow"
                            :label="subsystem.label"
                            :value="subsystem.value" />
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-tabs>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="warning"
          flat
          @click.stop="clearFilter">
          Clear
        </v-btn>
        <v-btn
          color="primary"
          flat
          @click.stop="componentIsFilterDialogOpened = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import SelectBranch from '@/components/forms/SelectBranch.vue'
import TestcasesAPI from '@/api/testcases.js'
import PlatformUtils from '@/utils/platforms.js'

export default {
  name: 'TestcasesFilter',
  components: {
    SelectBranch
  },

  props: {
    isFilterDialogOpened: {
      type: Boolean,
      required: true
    },
    branch: {
      type: String,
      required: true
    },
    platformsToShow: {
      type: Array,
      default: () => []
    },
    subsystemsToShow: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    testcases: {},
    licenses: [],
    subsystems: {},
    activeTab: undefined,

    platforms: PlatformUtils.platforms
  }),
  computed: {
    componentIsFilterDialogOpened: {
      get: function () {
        return this.isFilterDialogOpened
      },
      set: function (val) {
        this.$emit('toggleFilterDialog', val)
      }
    },
    componentBranch: {
      get: function () {
        return this.branch
      },
      set: function (val) {
        this.$emit('updateBranch', val)
      }
    },
    componentPlatformsToShow: {
      get: function () {
        return this.platformsToShow
      },
      set: function (val) {
        this.$emit('updatePlatform', val)
      }
    },
    componentSubsystemsToShow: {
      get: function () {
        return this.subsystemsToShow
      },
      set: function (val) {
        this.$emit('updateSubsystem', val)
      }
    }
  },

  watch: {
    branch () {
      this.componentSubsystemsToShow = []
      this.componentPlatformsToShow = []
      this.getTestcases()
    },
    testcases () {
      this.licenses = Object.keys(this.testcases).sort()
      this.activeTab = `tab-${this.licenses[0]}`
      this.subsystems = {}
      this.licenses.forEach(license => {
        this.subsystems[license] = Object.keys(this.testcases[license])
          .sort()
          .filter(subsystem => subsystem !== 'taas_metadata')
          .map(subsystem => ({
            value: `${license}.${subsystem}.`,
            label: this.testcases[license][subsystem].taas_metadata.name
          }))
      })
    }
  },

  created () {},
  mounted () {
    this.getTestcases()
  },
  updated () {},
  destroyed () {},

  methods: {
    clearFilter () {
      this.componentPlatformsToShow = []
      this.componentSubsystemsToShow = []
    },
    getTestcases: async function () {
      const response = (await TestcasesAPI.fetchAll(this.branch)).testcases
      this.testcases = response
    }
  }
}
</script>
