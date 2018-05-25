<template>
  <div>
    <span
      v-for="preset in presets"
      :key="preset.name"
      class="preset">
      <span @click="select(preset)">
        <el-tag
          :closable="true"
          @close.stop="showConfirmDialog(preset)">
          {{ preset.name }}
        </el-tag>
      </span>
    </span>
    <el-dialog
      :visible="showConfirm"
      title="Confirm To Delete?"
      @update:visible="val => showConfirm = val">
      <span>Delete preset can not be undone. Are you sure?</span>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button @click="showConfirm = false">Cancel</el-button>
        <el-button
          type="danger"
          @click="confirmDelete">Delete</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import store from '@/store'
import { cloneDeep } from 'lodash'
import { submitNotice } from '@/components/InteractivePushMessage.vue'

export default {

  name: 'List',
  components: {},

  props: {
    form: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    showConfirm: false,
    presetToDelete: undefined
  }),
  computed: {
    ...mapState('preset', [
      'presets'
    ])
  },
  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    select (preset) {
      this.$emit('update:form', cloneDeep(preset))
    },
    deleteOne (preset) {
      const dom = this.$el
      const remoteData = deleteApreset(preset)
      const messages = [
        'Deleting preset...',
        'Delete preset successfully',
        'Delete preset with error'
      ]

      submitNotice(remoteData, dom, messages)
    },
    showConfirmDialog (preset) {
      this.showConfirm = true
      this.presetToDelete = preset
    },
    confirmDelete () {
      this.showConfirm = false
      this.deleteOne(this.presetToDelete)
    }
  }

}

const deleteApreset = (preset) => store.dispatch(
  'preset/deleteOne', preset
)
store.dispatch('preset/getList')

</script>

<style>
  .preset {
    margin-right: 5px;
    cursor: pointer
  }
</style>
