<template>
  <v-layout
    row
    wrap>
    <v-layout>
      <v-flex xs8>
        <v-breadcrumbs>
          <v-icon slot="divider">chevron_right</v-icon>
          <v-breadcrumbs-item disabled>
            TaaS
          </v-breadcrumbs-item>
          <v-breadcrumbs-item
            :to="{ name: 'TestPlanList', params: { page: 1 } }"
            exact>
            Test Plans
          </v-breadcrumbs-item>
          <v-breadcrumbs-item>
            Create
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-flex>
      <v-flex
        xs4
        class="text-xs-right">
        <button-preview
          :disabled="false"
          @click.native="preview = !preview"/>
        <button-edit-submit
          :disabled="!isLoggedIn"
          @click.native="!isLoggedIn ? null : submitTestPlan()"/>
      </v-flex>
    </v-layout>
    <v-flex
      xs12>
      <v-card>
        <v-card-text>
          <v-layout row>
            <v-flex
              v-bind="{ [`offset-xs${preview ? 0 : 3}`]: true }"
              xs6
              px-2>
              <transition name="el-fade-in">
                <test-plan-edit-form
                  ref="testPlan"
                  :value.sync="testPlan"/>
              </transition>
            </v-flex>
            <v-flex
              v-bind="{ [`xs${preview ? 6 : 0}`]: true }"
              px-2>
              <transition name="el-fade-in">
                <the-preview
                  v-show="preview"
                  :value="testPlan"
                  :edit="true" />
              </transition>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { merge } from 'lodash'
import { mapGetters } from 'vuex'
import { submitNotice } from '@/components/InteractivePushMessage.vue'
import ThePreview from '@/components/testplan/ThePreview.vue'
import TestPlanEditForm from '@/components/testplan/TheEditForm.vue'
import ButtonBack from '@/components/forms/ButtonBack.vue'
import ButtonEditSubmit from '@/components/forms/ButtonEditSubmit.vue'
import ButtonPreview from '@/components/forms/ButtonPreview.vue'
import testplanapi from '@/api/testplan'
import TestPlan from '@/models/TestPlan'
import { EventBus } from '@/utils/eventBus'

const getTestPlan = serial => testplanapi.getOneTestPlan(serial)
const createTestPlan = testPlan => testplanapi.createTestPlan(testPlan)

export default {
  components: {
    ThePreview,
    TestPlanEditForm,
    ButtonBack,
    ButtonEditSubmit,
    ButtonPreview
  },

  props: {
    needPreview: {
      type: Boolean,
      default: false
    },
    testPlanSerial: {
      type: Number,
      default: undefined
    }
  },

  data () {
    return {
      preview: this.needPreview,
      testPlan: new TestPlan(),
      dirty: false // testPlan is edited, the dirty is set to true
    }
  },

  computed: {
    ...mapGetters('user', ['isLoggedIn'])
  },

  watch: {
    testPlan: {
      deep: true,
      handler () {
        this.dirty = true
      }
    }
  },

  created () {
    const _this = this
    if (_this.preview && _this.testPlanSerial) {
      getTestPlan(_this.testPlanSerial).then(res => {
        if (res.success) {
          _this.testPlan = JSON.parse(
            JSON.stringify(merge(new TestPlan(), res.test_plan))
          )
        }
      })
    }
  },

  methods: {
    submitTestPlan () {
      const _this = this
      _this.$refs.testPlan.$refs.testPlan.validate(valid => {
        if (valid) {
          let submitData = createTestPlan(_this.testPlan)
          submitNotice(submitData, _this.$el).then(res => {
            if (res && res.success) {
              _this.dirty = false
              _this.$router.push({ path: `/testplans/${res.test_plan.serial}` })
              EventBus.$emit('test-plan-edit-saved')
            }
          })
          // submit
        } else {
          return false
        }
      })
    },
    confirmLeave () {
      return this.$confirm(
        'Are you sure to leave without saving ?',
        'Confirm Discard',
        {
          confirmButtonText: 'Yes. Discard It',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
    }
  },

  beforeRouteLeave (to, from, next) {
    if (this.dirty) {
      this.confirmLeave()
        .then(() => {
          next()
        })
        .catch(() => {
          next(false)
        })
    } else {
      next()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
