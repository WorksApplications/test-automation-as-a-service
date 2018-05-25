<template>
  <v-menu
    :top="top"
    :bottom="bottom"
    :left="left"
    :right="right"
    open-on-hover
    transition="fade-transition">
    <div slot="activator">
      <v-tooltip
        v-for="user in usersEllipsis"
        :key="user"
        bottom>
        <user-avatar
          slot="activator"
          :username="user"
          :size="size + 'px'"
          :style="{margin: gutter + 'px'}" />
        <span>{{ user }}</span>
      </v-tooltip>
      <span v-if="needEllipsis">
        <v-avatar
          :size="size + 'px'"
          class="teal lighten-2">
          <span class="white--text">+{{ users.length - limit }}</span>
        </v-avatar>
      </span>
    </div>
    <div v-if="needEllipsis">
      <div
        :style="{background: 'white', maxWidth: (size + 2 * gutter) * usersPerRow + 'px'}">
        <v-tooltip
          v-for="user in users"
          :key="user"
          bottom>
          <user-avatar
            slot="activator"
            :username="user"
            :size="size + 'px'"
            :style="{margin: gutter + 'px'}" />
          <span>{{ user }}</span>
        </v-tooltip>
      </div>
    </div>
  </v-menu>
</template>

<script>
import UserAvatar from '@/components/UserAvatar.vue'

export default {
  components: {
    UserAvatar
  },

  props: {
    users: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 0
    },
    usersPerRow: {
      type: Number,
      default: 6
    },
    top: {
      type: Boolean,
      default: false
    },
    bottom: {
      type: Boolean,
      default: false
    },
    left: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 24
    },
    gutter: {
      type: Number,
      default: 2
    }
  },

  computed: {
    needEllipsis () {
      return this.limit > 0 && this.users.length > this.limit
    },
    usersEllipsis () {
      if (this.needEllipsis) {
        return this.users.slice(0, this.limit)
      } else {
        return this.users
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
