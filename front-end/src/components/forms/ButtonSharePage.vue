<template>
  <span>
    <v-tooltip bottom>
      <v-btn
        slot="activator"
        color="primary"
        fab
        small
        @click.stop="isDialogOpened = true">
        <v-icon>share</v-icon>
      </v-btn>
      <span>Share page</span>
    </v-tooltip>
    <v-dialog
      v-model="isDialogOpened"
      scrollable
      max-width="400">
      <v-card>
        <v-card-title class="headline">Share Page</v-card-title>
        <v-card-text>
          Click OK to copy URL to clipboard:
          <v-text-field
            v-model="urlString"
            style="font-family: Courier New;"
            readonly />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="warning"
            flat
            @click.native="isDialogOpened = false">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            flat
            @click.native="copyUrlToClipboard">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
import UtilsPushMessages from '@/utils/pushMessages.js'
import UtilsUrl from '@/utils/url.js'

export default {

  name: 'ButtonCopyUrl',
  components: {},

  props: {
    params: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    isDialogOpened: false
  }),
  computed: {
    urlString: function () {
      // Side-effect: This would modify `this.$route.query` too.
      let path = this.$route.path
      let query = this.$route.query
      let hash = this.$route.hash
      let emptyVals = (key) => !this.params[key] && this.params[key] !== 0
      Object.keys(this.params).forEach(key => {
        query[key] = this.params[key]
      })
      Object.keys(this.params).filter(emptyVals).forEach(key => {
        delete query[key]
      })
      return UtilsUrl.getFullUrl(path, query, hash)
    }
  },
  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    copyUrlToClipboard () {
      this.$copyText(this.urlString)
        .then(this.handleCopySuccess, this.handleCopyError)
      this.isDialogOpened = false
    },
    handleCopySuccess: () => {
      UtilsPushMessages.success('URL copied to the clipboard!')
    },
    handleCopyError: () => {
      UtilsPushMessages.error('Failed to copy URL to the clipboard.')
    }
  }

}

</script>
