<template>
  <span>
    <v-tooltip
      v-if="isLoggedIn"
      bottom>
      <v-btn
        slot="activator"
        color="primary"
        fab
        small
        @click="buttonClick">
        <v-icon>flag</v-icon>
      </v-btn>
      <span>Update resolve status</span>
    </v-tooltip>
    <v-tooltip
      v-else
      bottom>
      <v-btn
        slot="activator"
        color="primary"
        fab
        small
        disabled>
        <v-icon>flag</v-icon>
      </v-btn>
      <span>Please login to update resolve status</span>
    </v-tooltip>
    <el-dialog
      :visible.sync="resolveDialogVisible"
      :show-close="false"
      :modal-append-to-body="false">
      <el-form
        ref="formResolve"
        :model="form"
        :rules="rules"
        label-position="up"
        label-width="110px">
        <el-form-item
          label="Reason"
          prop="reason"
          class="sub-form-item">
          <el-input
            v-model="form.reason"
            :maxlength="100"
            placeholder="Resolve Reason"/>
        </el-form-item>
        <el-form-item
          label="Comment"
          prop="comment"
          class="sub-form-item">
          <el-input
            v-model="form.comment"
            :autosize="{ minRows: 2, maxRows: 4 }"
            :maxlength="300"
            class="resolve__textarea"
            type="textarea"
            placeholder="Detail Comment"
          />
        </el-form-item>
        <el-form-item>
          <button-testjob-resolve
            ref="buttonResolve"
            :plain="true"
            type="warning"
            size="small"
            @click.native="toggleResolve">
            {{ buttonStringResolve }}
          </button-testjob-resolve>
          <button-testjob-resolve
            v-show="resolve.resolved"
            ref="buttonUpdate"
            :plain="true"
            type="info"
            size="small"
            @click.native="updateResolve">
            Save
          </button-testjob-resolve>
        </el-form-item>
      </el-form>
    </el-dialog>
  </span>
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonTestjobResolve from '@/components/forms/ButtonTestjobResolve.vue'
import UtilsPropsValidator from '@/utils/propsValidator.js'

export default {

  components: {
    ButtonTestjobResolve
  },

  props: {
    // General form component styling properties
    size: {
      type: String,
      default: undefined,
      validator: UtilsPropsValidator.size
    },
    type: {
      type: String,
      default: 'warning',
      validator: UtilsPropsValidator.type
    },
    plain: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    showTooltip: {
      type: Boolean,
      default: false
    },

    testjob: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    form: {
      reason: '',
      comment: ''
    },
    resolveDialogVisible: false,
    rules: {
      reason: [
        { required: true, message: 'The reason cannot be empty' }
      ]
    },
    buttonStringResolve: ''
  }),

  computed: {
    ...mapGetters('user', [
      'isLoggedIn'
    ]),
    resolve () {
      if (this.testjob.resolve === undefined) {
        return {
          resolved: false
        }
      }
      return this.testjob.resolve
    }
  },

  watch: {
    resolve: function (val) {
      if (val !== undefined) {
        this.buttonStringResolve = val.resolved ? 'Unresolve' : 'Resolve'
        if (val.reason) {
          this.form.reason = val.reason
        }
        if (val.comment) {
          this.form.comment = val.comment
        }
      }
    }
  },

  mounted () {
    const route = this.$route
    if (route.query.resolve) {
      this.resolveDialogVisible = true
    }
  },

  methods: {
    buttonClick () {
      this.resolveDialogVisible = true
    },
    toggleResolveAfterValidate () {
      this.resolveDialogVisible = false
      const buttonResolve = this.$refs.buttonResolve

      this.resolve.resolved = !this.resolve.resolved
      this.buttonStringResolve = this.resolve.resolved ? 'Unresolve' : 'Resolve'
      if (this.resolve.resolved) {
        this.resolve.reason = this.form.reason
        this.resolve.comment = this.form.comment
      } else {
        this.resolve.reason = ''
        this.resolve.comment = ''
      }
      buttonResolve.updateOne(this.testjob.serial, this.resolve)
    },
    toggleResolve () {
      if (this.resolve.resolved) {
        this.toggleResolveAfterValidate()
      } else {
        this.validateForm(this.toggleResolveAfterValidate)
      }
    },
    updateResolve () {
      this.validateForm(() => {
        this.resolveDialogVisible = false
        const buttonUpdate = this.$refs.buttonUpdate

        this.resolve.reason = this.form.reason
        this.resolve.comment = this.form.comment
        buttonUpdate.updateOne(this.testjob.serial, this.resolve)
      })
    },
    validateForm (thenDo) {
      this.$refs.formResolve.validate((valid) => {
        if (valid && typeof thenDo === 'function') {
          thenDo()
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
  .resolve-icon {
    position: absolute;
    left: 250px;
    &:hover {
      cursor: pointer;
    }
    font-size: 20px;
  }

  .unresolved {
    color: #aaaaaa;
  }

  .resolved {
    color: #97cc64;
  }

  .sub-form-item {
    margin-bottom: 22px;
  }
</style>

<style>
  .resolve__textarea textarea {
    font-family: Arial;
    padding: 3px 10px;
  }
</style>
