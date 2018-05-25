<template>
  <el-checkbox-group v-model="checkList">
    <el-table
      :data="items"
      :show-header="false"
      :cell-style="cellStyle"
      :span-method="spanMethod"
      :empty-text="emptyText"
      class="select-cascade-table">
      <el-table-column
        v-if="!header"
        min-width="40">
        <el-checkbox
          :indeterminate="checkAllChildren[scope.$index] === checkBoxStatus.INDETERMINATE"
          :label="scope.row.label"
          :style="{fontWeight: 400}"
          slot-scope="scope"
          @change="updateCheck($event, scope.$index)" />
      </el-table-column>
      <el-table-column
        v-else
        min-width="40">
        <span
          :style="{fontWeight: 'bold', lineHeight: '60px'}"
          slot-scope="scope">
          {{ scope.row.label }}
        </span>
      </el-table-column>
      <el-table-column min-width="180">
        <select-cascade
          v-if="scope.row.children"
          :items="scope.row.children"
          :items-selected="getItemsSelectedChildren(scope.$index)"
          :index="scope.$index"
          :header="header"
          slot-scope="scope"
          @updateCheckChildren="updateCheckChildren" />
      </el-table-column>
    </el-table>
  </el-checkbox-group>
</template>

<script>
import _ from 'lodash'
import SelectCascade from '@/components/forms/SelectCascade.vue'

export default {

  name: 'SelectCascade',

  components: {
    SelectCascade
  },

  props: {
    /*
    * Format of items:
    * [{
    *   value: 'valueRelated',
    *   label: 'labelToShow',
    *   children: [items]
    * },
    * ...
    * ]
    */
    items: {
      type: Array,
      default: () => []
    },
    /*
    * itemsSelected is an array of path of selected items
    */
    itemsSelected: {
      type: Array,
      default: () => []
    },
    index: {
      type: Number,
      default: 0
    },
    header: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String,
      default: 'No Data'
    }
  },

  data: () => ({
    checkList: [],
    checkAllChildren: [],
    checkBoxStatus: {
      CHECK_NONE: 0,
      CHECK_ALL: 1,
      INDETERMINATE: 2
    }
  }),

  computed: {
    countNotCheckNone () {
      return this.checkAllChildren.filter(
        item => item !== this.checkBoxStatus.CHECK_NONE
      ).length
    },
    countNotCheckAll () {
      return this.checkAllChildren.filter(
        item => item !== this.checkBoxStatus.CHECK_ALL
      ).length
    }
  },

  watch: {
    itemsSelected: function (newValue) {
      this.updateSelected(newValue)
    }
  },

  mounted () {
    this.updateSelected(this.itemsSelected)
  },

  methods: {
    getItemsSelectedChildren (index) {
      const _this = this
      let itemsSelectedChildren = []
      _this.itemsSelected.some(item => {
        // Match item in itemsSelect with items[index]
        if (item[0].value === _this.items[index].value) {
          if (item.length === 1) {
            // All children are selected, push all
            _this.items[index].children.forEach(child =>
              itemsSelectedChildren.push([{
                label: child.label,
                value: child.value
              }]))
            return true
          } else {
            // Part of children are selected, push one by one
            let itemsSelectedChild = item.slice(1)
            if (itemsSelectedChild.length > 0) {
              itemsSelectedChildren.push(itemsSelectedChild)
            }
            return false
          }
        }
        return false
      })
      return itemsSelectedChildren
    },
    updateCheck (checked, index) {
      let newCheckAllChildren = _.cloneDeep(this.checkAllChildren)
      newCheckAllChildren[index] = checked ? this.checkBoxStatus.CHECK_ALL : this.checkBoxStatus.CHECK_NONE
      this.checkAllChildren = _.cloneDeep(newCheckAllChildren)
      let itemPath = []
      let item = this.items[index]
      itemPath.unshift({
        value: item.value,
        label: item.label
      })
      this.$emit('updateCheckChildren',
        itemPath,
        checked,
        this.countNotCheckNone,
        this.countNotCheckAll,
        this.index)
    },
    updateCheckChildren (itemPath, checked, countNotCheckNone, countNotCheckAll, index) {
      let item = this.items[index]
      let newCheckAllChildren = _.cloneDeep(this.checkAllChildren)
      if (countNotCheckAll === 0) {
        if (!this.checkList.includes(item.label)) this.checkList.push(item.label)
        newCheckAllChildren[index] = this.checkBoxStatus.CHECK_ALL
      } else if (countNotCheckNone === 0) {
        if (this.checkList.includes(item.label)) this.checkList.splice(this.checkList.indexOf(item.label), 1)
        newCheckAllChildren[index] = this.checkBoxStatus.CHECK_NONE
      } else {
        if (this.checkList.includes(item.label)) this.checkList.splice(this.checkList.indexOf(item.label), 1)
        newCheckAllChildren[index] = this.checkBoxStatus.INDETERMINATE
      }
      this.checkAllChildren = _.cloneDeep(newCheckAllChildren)

      itemPath.unshift({
        value: item.value,
        label: item.label
      })
      this.$emit('updateCheckChildren',
        itemPath,
        checked,
        this.countNotCheckNone,
        this.countNotCheckAll,
        this.index)
    },
    updateSelected (itemsSelected) {
      const _this = this
      _this.checkList = []
      _this.checkAllChildren = []
      _this.items.forEach((item, index) => {
        let result = itemsSelected.filter(itemSelected => {
          return _.isEqual(item.value, itemSelected[0].value)
        })
        if (result.length === 1 && result[0].length === 1) {
          _this.checkList.push(item.label)
          _this.checkAllChildren.push(_this.checkBoxStatus.CHECK_ALL)
        } else if (result.length === 0) {
          _this.checkAllChildren.push(_this.checkBoxStatus.CHECK_NONE)
        } else {
          _this.checkAllChildren.push(_this.checkBoxStatus.INDETERMINATE)
        }
      })
    },
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      if (this.items[rowIndex].children && columnIndex === 1) {
        return {
          border: 0
        }
      }
    },
    spanMethod ({ row, column, rowIndex, columnIndex }) {
      if (this.items[rowIndex].children) return [1, 1]
      if (columnIndex === 0) return [1, 2]
      else return [0, 0]
    }
  }

}
</script>

<style lang="scss">
  .select-cascade-table .el-table__body > tbody > tr > td {
    padding: 0;
  }
</style>
