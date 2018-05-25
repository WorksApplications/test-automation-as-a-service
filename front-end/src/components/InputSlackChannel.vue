<template>
  <el-autocomplete
    :value="channelMatched !== '' ? channelMatched : value"
    :fetch-suggestions="queryChannels"
    :trigger-on-focus="false"
    :disabled="disabled"
    class="__full-width"
    @input="handleInput"
  >
    <span
      v-if="!isRefreshing"
      slot="append">
      <el-popover
        ref="popover-update-time"
        :content="'Last updated on ' + lastUpdateHumanized + ' ago'"
        placement="top-start"
        trigger="hover" />
      <el-button
        v-popover:popover-update-time
        :disabled="disabled"
        type="primary"
        @click="refreshChannels">
        Refresh
      </el-button>
    </span>
    <span
      v-else
      slot="append">
      <i class="el-icon-loading"/>
    </span>
  </el-autocomplete>
</template>

<script>
import CHANNELS_API from '@/api/channels'
import moment from 'moment'

export default {

  name: 'InputSlackChannel',
  components: {},

  props: {
    channelId: {
      type: String,
      default: ''
    },
    channel: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      value: '',
      channels: [],
      lastUpdate: undefined,
      isRefreshing: false
    }
  },
  computed: {
    channelMatched () {
      const channelItem = this.channels.find(matchBy('id')(this.channelId))
      if (channelItem === undefined) {
        return ''
      } else {
        return channelItem.value
      }
    },
    lastUpdateHumanized () {
      return moment.duration(moment().diff(this.lastUpdate)).humanize()
    }
  },
  watch: {},

  created () {
    const _this = this
    CHANNELS_API.fetchAll().then((res) => {
      // map channels for autocomplete usage [{value:'channel1'},...]
      _this.channels = res.channels.map(toChannelObj)
      _this.lastUpdate = res.lastUpdate
      _this.isRefreshing = false
    })
  },
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    handleInput (value) {
      const _this = this

      this.value = value
      const channelItem = _this.channels.find(matchBy('value')(value))
      const channelId = channelItem === undefined ? '' : channelItem.id
      const channel = channelItem === undefined ? '' : channelItem.value

      this.$emit('update:channelId', channelId)
      this.$emit('update:channel', channel)
    },

    refreshChannels () {
      const _this = this
      _this.isRefreshing = true
      CHANNELS_API.refresh().then((res) => {
        _this.channels = res.channels.map(toChannelObj)
        _this.lastUpdate = res.lastUpdate
        _this.isRefreshing = false
      })
    },

    queryChannels (queryString, callback) {
      const channels = this.channels
      let result = queryString
        ? channels.filter(matchStr(queryString, true, true))
        : channels
      callback(result)
    }
  }

}

const dashToUnderscore = (str) => {
  return str.replace(/-/g, '_')
}

const matchStr = (strToMatch, ignoreCaseAndDash, isFuzzyMatch) => {
  return (item, index, array) => {
    let strTransformed = ignoreCaseAndDash ? dashToUnderscore(item.value.toLowerCase()) : item.value
    let strToMatchTransformed = ignoreCaseAndDash ? dashToUnderscore(strToMatch.toLowerCase()) : strToMatch
    if (isFuzzyMatch) {
      return strTransformed.indexOf(strToMatchTransformed) >= 0
    } else {
      return strTransformed === strToMatchTransformed
    }
  }
}

const matchBy = (property) => (value) => (ele) => ele[property] === value

const toChannelObj = channel => ({
  value: channel.name,
  id: channel.id
})

</script>
