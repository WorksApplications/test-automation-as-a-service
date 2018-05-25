<template>
  <div class="vue-drawer">
    <div @click="openDrawer(undefined)">
      <slot name="handle"/>
    </div>
    <v-card
      :class="isDrawerVisible ? 'active' : ''"
      :style="styleWidth"
      class="main">
      <div class="header">
        <slot name="header"/>
      </div>
      <v-container
        style="background-color: #eee;">
        <slot name="main"/>
      </v-container>
    </v-card>
    <div
      :class="isDrawerVisible ? 'active' : ''"
      class="mask"
      @click="beforeCloseDrawer"/>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '60%'
    },
    beforeCloseHandler: {
      type: Function,
      default: undefined
    }
  },

  data: () => ({
    isDrawerVisible: false,
    baseRoot: undefined
  }),

  computed: {
    styleWidth () {
      return {
        right: this.isDrawerVisible ? '0px' : `-${this.width}`,
        width: this.width
      }
    }
  },

  methods: {
    openDrawer: function (baseRoot) {
      this.isDrawerVisible = true
      this.baseRoot = baseRoot
      this.$emit('changed', true)
    },
    beforeCloseDrawer: function () {
      const _this = this
      if (_this.beforeCloseHandler) {
        _this.beforeCloseHandler()
          .then(() => {
            _this.closeDrawer()
            _this.$emit('confirm', true)
          })
          .catch(() => {
            _this.$emit('confirm', false)
          })
      } else {
        _this.closeDrawer()
      }
    },
    closeDrawer: function () {
      this.isDrawerVisible = false
      if (this.baseRoot) {
        this.$router.push({ path: this.baseRoot })
      }
      this.$emit('changed', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.vue-drawer {
  display: inline;
}

.vue-drawer > .mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  visibility: hidden;
  opacity: 0;
  background-color: #000000;
  transition: opacity ease 0.5s, visibility ease 0.5s;
  z-index: 100;
  &.active {
    visibility: visible;
    opacity: 0.5;
  }
}

.vue-drawer > .main {
  visibility: hidden;
  position: fixed;
  top: 0;
  bottom: 0;
  transition: right ease 0.5s, visibility ease 0.5s;
  z-index: 101;
  &.active {
    visibility: visible;
    background-color: #eeeeee;
  }

  .header {
    position: fixed;
    background-color: #4DB6AC;
    color: #ffffff;
    height: 64px;
    width: 100%;
    z-index: 1;
    box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
  }

  .container {
    max-width: 100%;
    height: 93.5%;
    overflow-y: auto;
    margin: 64px 0 0 0;
  }
}
</style>
