<template>
  <v-card-text :class="$style.logs">
    <virtual-scroller
      ref="loglist"
      :items="logs"
      style="height: 100%"
      item-height="18">
      <template slot-scope="props">
        <div
          :key="props.itemKey"
          style="height: 18px; width: 2000px; overflow: hidden">
          <span style="color:grey">[{{ formatTimestamp(props.item.timestamp) }}]</span>
          {{ props.item.message }}
        </div>
      </template>
    </virtual-scroller>
  </v-card-text>
</template>

<script>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { VirtualScroller } from 'vue-virtual-scroller'
import moment from 'moment-timezone'

export default {
  components: {
    VirtualScroller
  },
  props: {
    logs: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    logs (val, newVal) {
      this.scrollTo(newVal.length - 1)
    }
  },
  methods: {
    scrollTo (index) {
      const loglist = this.$refs.loglist

      if (loglist) {
        this.$nextTick(() => {
          loglist.scrollToItem(index)
        })
      }
    },
    formatTimestamp (time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss Z')
    }
  }
}
</script>

<style module>
.logs {
  font-family: 'Ubuntu Mono';
  height: calc(100vh - 300px);
}
</style>
