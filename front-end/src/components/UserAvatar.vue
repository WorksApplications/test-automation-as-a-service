<template>
  <v-avatar :size="size">
    <img :src="avatarUrl">
  </v-avatar>
</template>

<script>
import store from '@/store'

export default {
  name: 'UserAvatar',
  components: {},

  props: {
    username: {
      type: String,
      default: undefined
    },
    size: {
      type: String,
      default: '24px'
    }
  },

  data: () => ({
    avatarUrl: '/static/avatar.png'
  }),
  computed: {},
  watch: {
    username () {
      this.setAvatarUrl()
    }
  },

  created () {
    this.setAvatarUrl()
  },
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    setAvatarUrl: async function () {
      this.avatarUrl = await store.dispatch('cache/getAvatar', this.username)
    }
  }
}
</script>

<style>
</style>
