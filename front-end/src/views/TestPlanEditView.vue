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
          <v-breadcrumbs-item
            :to="{ name: 'TestPlanDetails', params: { id: testPlanSerial } }"
            exact>
            #{{ testPlanSerial }}
          </v-breadcrumbs-item>
          <v-breadcrumbs-item>
            Edit
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-flex>
      <v-flex
        xs4
        class="text-xs-right">
        <button-edit-cancel
          :disabled="!isLoggedIn"
          @click.native="!isLoggedIn ? null : cancel()"/>
        <button-test-plan-to-edit
          v-if="comparing && !comparingEdit"
          :disabled="!isLoggedIn"
          @click.native="comparingEdit = true"/>
        <button-preview
          v-else-if="comparing && comparingEdit"
          :disabled="!isLoggedIn"
          @click.native="comparingEdit = false"/>
        <button-edit-save
          :disabled="!isLoggedIn"
          :color="comparing ? 'error' : 'primary'"
          @click.native="!isLoggedIn ? null : save()"/>
      </v-flex>
    </v-layout>
    <v-flex
      v-if="!comparing"
      xs12>
      <v-card>
        <v-card-text>
          <v-layout row>
            <v-flex
              xs6
              px-2>
              <test-plan-edit-form
                ref="testPlan"
                v-model="testPlan" />
            </v-flex>
            <v-flex
              xs6
              px-2>
              <the-preview
                :value="testPlan"
                :edit="true"/>
              <template v-if="testPlan.verdict && testPlan.verdict.result && testPlan.state === states['finished'].value">
                <div class="verdict-block">
                  <h3>Verdict</h3>
                  <p>
                    <strong>Result:</strong>
                    {{ testPlan.verdict.result }}
                  </p>
                  <p>
                    <strong>Reason:</strong>
                    <span style="white-space: pre-line">
                      {{ testPlan.verdict.reason }}
                    </span>
                  </p>
                </div>
              </template>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex
      v-else
      xs12>
      <v-card>
        <v-card-text>
          <div
            v-if="errorChangedByOthers"
            class="error-changed-by-others">
            Test plan has been changed by
            <span class="highlight"> {{ errorChangedByOthers.lastUpdatedBy }}</span>
            at
            <field-time
              v-model="errorChangedByOthers.lastUpdatedAt"
              class="highlight"
              format-type="fullDateTime"/>
            !
          </div>
          <v-layout row>
            <v-flex
              xs6
              px-2>
              Local Version
              <div
                ref="local-version-container"
                class="local-version-container"
                @scroll="previewScroll">
                <template v-if="comparingEdit">
                  <test-plan-edit-form
                    ref="testPlan"
                    v-model="testPlan" />
                </template>
                <template v-else>
                  <the-preview
                    :value="testPlan"
                    :edit="true"/>
                </template>
              </div>
            </v-flex>
            <v-flex
              xs6
              px-2>
              Remote Version
              <div
                ref="remote-version-container"
                class="remote-version-container"
                @scroll="previewScroll">
                <the-preview
                  :value="errorChangedByOthers"
                  :diff="errorDiff"
                  :edit="true"/>
              </div>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

import { mapState, mapGetters } from 'vuex'
import { merge } from 'lodash'

import { states } from '@/utils/states'
import { EventBus } from '@/utils/eventBus'

import TestPlan from '@/models/TestPlan'

import testplanapi from '@/api/testplan'
import { submitNotice } from '@/components/InteractivePushMessage.vue'
import ThePreview from '@/components/testplan/ThePreview.vue'
import TestPlanEditForm from '@/components/testplan/TheEditForm.vue'
import ButtonBack from '@/components/forms/ButtonBack.vue'
import FieldTime from '@/components/FieldTime.vue'
import ButtonEditCancel from '@/components/forms/ButtonEditCancel.vue'
import ButtonEditSave from '@/components/forms/ButtonEditSave.vue'
import ButtonTestPlanToEdit from '@/components/forms/ButtonTestPlanToEdit.vue'
import ButtonPreview from '@/components/forms/ButtonPreview.vue'

const getTestPlan = (serial) => testplanapi.getOneTestPlan(serial)
const saveTestPlan = (testPlan, confirmApply = false) => testplanapi.saveTestPlan(testPlan, confirmApply)

export default {
  components: {
    ThePreview,
    TestPlanEditForm,
    ButtonBack,
    FieldTime,
    ButtonEditCancel,
    ButtonEditSave,
    ButtonTestPlanToEdit,
    ButtonPreview
  },
  props: {
    testPlanSerial: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      comparing: false,
      comparingEdit: false,
      errorChangedByOthers: undefined,
      errorDiff: undefined,
      confirmApply: false,
      testPlan: new TestPlan(),
      editing: true,
      dirty: false,
      states
    }
  },
  computed: {
    ...mapState('user', ['user']),
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
  mounted () {
    const _this = this
    if (_this.testPlanSerial) {
      getTestPlan(_this.testPlanSerial).then(res => {
        if (res.success) {
          res.test_plan.start = new Date(res.test_plan.start)
          res.test_plan.end = new Date(res.test_plan.end)
          _this.testPlan = JSON.parse(JSON.stringify(merge(new TestPlan(), res.test_plan)))
          _this.$nextTick(() => {
            // the first time set testPlan, we need the dirty to be false
            _this.dirty = false
          })
        }
      })
    }
  },
  methods: {
    previewScroll (e) {
      let scrollLeft = e.target.scrollLeft
      this.$refs['local-version-container'].scrollLeft = scrollLeft
      this.$refs['remote-version-container'].scrollLeft = scrollLeft
    },
    saveTestPlan () {
      const _this = this

      _this.$refs.testPlan.$refs.testPlan.validate((valid) => {
        if (valid) {
          let saveData = saveTestPlan(_this.testPlan, _this.confirmApply)
          submitNotice(saveData, _this.$el).then(res => {
            if (res && res.success) {
              _this.dirty = false
              _this.$router.push({ path: `/testplans/${_this.testPlanSerial}` })
              EventBus.$emit('test-plan-edit-saved')
            }
          }).catch(errResponse => {
            if (errResponse.status === 409) {
              errResponse.json().then(data => {
                _this.comparing = true
                _this.errorChangedByOthers = data.info
                _this.errorDiff = data.diff
              })
            }
            _this.confirmApply = false
          })
        } else {
          _this.comparingEdit = true
          return false
        }
      })
    },
    saveTestPlanWithOverride () {
      const _this = this
      _this.$confirm('Remote data will be overrided', 'Confirm Save Your Changes?', {
        confirmButtonText: 'Confirm To Save',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        if (!_this.comparingEdit) {
          _this.comparingEdit = true
        }
        _this.$nextTick(() => {
          _this.confirmApply = true
          _this.saveTestPlan()
        })
      }).catch(() => {})
    },
    save () {
      if (this.comparing) {
        this.saveTestPlanWithOverride()
      } else {
        this.saveTestPlan()
      }
    },
    cancel () {
      this.$router.push({ path: `/testplans/${this.testPlanSerial}` })
      EventBus.$emit('test-plan-edit-canceled')
    },
    confirmLeave () {
      return this.$confirm('Are you sure to leave without saving ?', 'Confirm Discard', {
        confirmButtonText: 'Yes. Discard It',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.dirty) {
      this.confirmLeave().then(() => {
        next()
      }).catch(() => {
        next(false)
      })
    } else {
      next()
    }
  }

}
</script>

<style lang="scss" scoped>
  .verdict-block {
    border-top: 1px solid #eef0f2;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 2s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    opacity: 0
  }

  .error-changed-by-others {
    color: #F56C6C;
    text-align: center;
    font-size: 18px;

    .highlight {
      font-weight: bold;
    }
    a {
      color: #F56C6C;
    }
  }
  .local-version-container,
  .remote-version-container {
    overflow-x: auto;
  }
</style>
