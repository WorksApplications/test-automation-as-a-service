<template>
  <div>
    <div
      v-for="(param, index) in params"
      :key="index">
      <el-form-item
        :label="param.nickname ? param.nickname : param.key"
        :key="param.key + index"
        :title="param.key">
        <el-input
          v-if="editable"
          v-model="param.value">
          <template slot="append">
            <el-button
              title="Remove this parameter"
              @click="delAParam(index)">
              <i class="el-icon-close"/>
            </el-button>
          </template>
        </el-input>
        <span v-else>
          {{ param.value }}
        </span>
      </el-form-item>
    </div>

    <el-form-item v-if="editable">
      <el-button
        style="width: 100%"
        title="Add a customized parameter"
        @click="openDialog">
        <i class="el-icon-plus" /> Add a customized parameter
      </el-button>
    </el-form-item>

    <el-dialog
      v-if="editable"
      ref="dialog"
      :visible.sync="dialogVisible"
      title="Add a customized parameter"
      width="20%">

      <el-form label-width="80px">
        <el-form-item
          label="Key"
          required>
          <el-input
            v-model="form.key"
            placeholder="taas.username" />
        </el-form-item>
        <el-form-item
          label="Value"
          required>
          <el-input
            v-model="form.value"
            placeholder="hue-root" />
        </el-form-item>
        <el-form-item label="Label">
          <el-input
            v-model="form.nickname"
            placeholder="Username" />
        </el-form-item>
      </el-form>
      <el-button
        :plain="true"
        type="primary"
        size="small"
        @click="addAParam">Add</el-button>
      <el-button
        :plain="true"
        type="warning"
        size="small"
        @click="closeDialog">Cancel</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'

const Param = function () {
  this.key = ''
  this.value = ''
  this.nickname = ''
}

export default {
  props: {
    params: {
      type: Array,
      default: () => []
    },
    editable: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({
    form: (new Param()),
    dialogVisible: false
  }),

  methods: {
    addAParam () {
      let params = cloneDeep(this.params)
      params.push(cloneDeep(this.form))
      this.$emit('update:params', params)

      this.closeDialog()
      this.form = new Param()
    },
    delAParam (index) {
      let params = cloneDeep(this.params)
      params.splice(index, 1)
      this.$emit('update:params', params)
    },
    openDialog () {
      this.dialogVisible = true
    },
    closeDialog () {
      this.dialogVisible = false
    }
  }
}
</script>
