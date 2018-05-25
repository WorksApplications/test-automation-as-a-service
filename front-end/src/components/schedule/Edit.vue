<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-position="right"
    label-width="110px">
    <el-form-item
      label="Name"
      prop="name">
      <el-input
        v-model="form.name"
        :maxlength="80"
        placeholder="Schedule Name"/>
    </el-form-item>
    <el-form-item
      label="Repeat on"
      prop="cron">
      <input-cron v-model="form.cron" />
    </el-form-item>
    <el-form-item label="Status">
      <switch-schedule-active
        v-model="form"
        :auto-submit="false" />
    </el-form-item>

    <h3>Parameters</h3>
    <testjob-form-details
      ref="params"
      :is-sub-form="true" />

    <el-form-item>
      <button-schedule-create
        v-show="!isEditForm"
        ref="buttonCreate"
        @click.native="create" />
      <button-schedule-update
        v-show="isEditForm"
        ref="buttonUpdate"
        @click.native="update" />
      <button-back />
    </el-form-item>
  </el-form>
</template>

<script>

import ButtonScheduleCreate from '@/components/forms/ButtonScheduleCreate.vue'
import ButtonScheduleUpdate from '@/components/forms/ButtonScheduleUpdate.vue'
import SwitchScheduleActive from '@/components/forms/SwitchScheduleActive.vue'
import InputCron from '@/components/forms/InputCron.vue'
import ButtonBack from '@/components/forms/ButtonBack.vue'
import TestjobFormDetails from '@/components/testjob/TheFormDetails.vue'
import { cloneDeep } from 'lodash'

export default {

  name: 'Edit',
  components: {
    ButtonScheduleCreate,
    ButtonScheduleUpdate,
    ButtonBack,
    SwitchScheduleActive,
    InputCron,
    TestjobFormDetails
  },

  props: {
    viewType: {
      type: String,
      default: 'new',
      validator: (val) => ['new', 'edit'].indexOf(val) !== -1
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      form: this.value,
      rules: {
        name: {
          required: true,
          message: 'The name cannot be empty'
        }
      }
    }
  },
  computed: {
    isNewForm () {
      return this.viewType === 'new'
    },
    isEditForm () {
      return this.viewType === 'edit'
    }
  },
  watch: {
    'value': function (val) {
      this.setFormFromValue(val)
    }
  },

  created () {
    if (this.value) {
      this.setFormFromValue(this.value)
    }
  },
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    create () {
      const buttonCreate = this.$refs.buttonCreate
      const schedule = this.getScheduleFromForm()

      this.validateForm(() => {
        buttonCreate.createOne(schedule)
      })
    },
    update () {
      const buttonUpdate = this.$refs.buttonUpdate
      const schedule = this.getScheduleFromForm()

      this.validateForm(() => {
        buttonUpdate.updateOne(schedule)
      })
    },

    selectCron (newForm) {
      const _this = this
      Object.keys(newForm).forEach(function (p) {
        _this.form[p] = newForm[p]
      })
    },

    // validate both of the form
    validateForm (thenDo) {
      const form = this.$refs.form
      const params = this.$refs.params

      form.validate((valid) => {
        if (valid) {
          params.validateForm(thenDo)
        }
      })
    },

    // set/get value from form && its sub form
    setFormFromValue (schedule) {
      try {
        let form = cloneDeep(schedule)
        this.form = form
        this.$refs['params'].form = form.params
      } catch (e) {
        return false
      }
    },
    getScheduleFromForm () {
      let form = cloneDeep(this.form)
      form.params = cloneDeep(this.$refs['params'].form)
      return form
    }
  }

}

</script>
