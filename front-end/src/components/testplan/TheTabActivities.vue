<template>
  <v-list>
    <v-data-iterator
      :items="activities"
      :rows-per-page-items="rowsPerPageItems"
      :pagination.sync="pagination"
      :hide-actions="!activities || activities.length === 0"
      no-data-text="No activities yet"
      column>
      <v-list-group
        slot="item"
        v-model="props.item.active"
        :append-icon="!props.item.divider && props.item.edits.length > 0 ? 'keyboard_arrow_down' : ''"
        slot-scope="props">
        <v-list-tile
          slot="activator"
          :style="props.item.edits.length > 0 ? null : {marginRight: '56px'}"
          style="margin-top: 10px; margin-bottom: 10px"
          avatar>
          <v-list-tile-avatar>
            <v-tooltip
              bottom>
              <user-avatar
                slot="activator"
                :username="props.item.user"
                size="48px" />
              <span>{{ props.item.user }}</span>
            </v-tooltip>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ props.item.operation }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-list-tile-action-text>
              <field-time
                :value="getTime(props.item._id)"
                format-type="fullDateTime" />
            </v-list-tile-action-text>
            <v-icon
              v-if="props.item.type === 'Edit'"
              color="grey lighten-1">
              mode_edit
            </v-icon>
            <v-icon
              v-else-if="props.item.type === 'Operate'"
              color="grey lighten-1">
              build
            </v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile
          v-for="edit in props.item.edits"
          :key="edit.key"
          :class="edit.key === 'attachments' && edit.newValue ? 'primary--text list__tile__attachment' : 'primary--text list__tile__normal'">
          <v-list-tile-sub-title v-if="edit.key !== 'attachments'">
            <span class="text--primary">{{ edit.key.split('.').map(firstToUpperCase).join(' ') }}</span>
            <span v-if="edit.key === 'description'">updated</span>
            <span v-else-if="!edit.newValue || edit.newValue === ''">
              :&nbsp;
              <span class="text--primary">
                {{ edit.oldValue }}
              </span>
              &nbsp;removed
            </span>
            <span v-else>
              &nbsp;set
              <span v-if="edit.oldValue && edit.oldValue !== ''">
                &nbsp;from&nbsp;
                <tag-group-selected
                  v-if="edit.key === 'platforms' || edit.key === 'testcases'"
                  :items-selected="edit.oldValue"/>
                <span
                  v-else-if="edit.key === 'assignee'"
                  class="text--primary">
                  <user-avatar
                    :username="edit.oldValue"
                    size="24px"/>
                  {{ edit.oldValue }}
                </span>
                <the-state
                  v-else-if="edit.key === 'state'"
                  :state="edit.oldValue"/>
                <span
                  v-else
                  class="text--primary">
                  {{ edit.oldValue }}
                </span>
              </span>
              &nbsp;to&nbsp;
              <tag-group-selected
                v-if="edit.key === 'platforms' || edit.key === 'testcases'"
                :items-selected="edit.newValue"/>
              <span
                v-else-if="edit.key === 'assignee'"
                class="text--primary">
                <user-avatar
                  :username="edit.newValue"
                  size="24px"/>
                {{ edit.newValue }}
              </span>
              <the-state
                v-else-if="edit.key === 'state'"
                :state="edit.newValue"/>
              <span
                v-else
                class="text--primary">
                {{ edit.newValue }}
              </span>
            </span>
          </v-list-tile-sub-title>
          <v-list-tile-sub-title v-else>
            <area-attachment-upload
              v-if="edit.newValue"
              :file-list="edit.newValue"
              :allow-upload="false"
              :disabled="true"
              class="area-attachment-no-upload"/>
            <div
              v-for="value in edit.oldValue"
              v-else
              :key="value.name">
              {{ value.name }}
            </div>
          </v-list-tile-sub-title>
        </v-list-tile>
      </v-list-group>
    </v-data-iterator>
  </v-list>
</template>

<script>
import UserAvatar from '@/components/UserAvatar.vue'
import FieldTime from '@/components/FieldTime.vue'
import TagGroupSelected from '@/components/forms/TagGroupSelected.vue'
import TheState from './TheState.vue'
import AreaAttachmentUpload from '@/components/forms/AreaAttachmentUpload.vue'
import { getDateTimeFromObjectId } from '@/utils/date'

export default {
  components: {
    UserAvatar,
    FieldTime,
    TagGroupSelected,
    TheState,
    AreaAttachmentUpload
  },

  props: {
    activities: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    rowsPerPageItems: [4, 7, 10],
    pagination: {
      rowsPerPage: 7
    }
  }),

  mounted () {},

  methods: {
    firstToUpperCase (str) {
      return str.substr(0, 1).toUpperCase() + str.substr(1)
    },
    getTime: function (objectId) {
      return getDateTimeFromObjectId(objectId).toISOString()
    }
  }
}
</script>

<style lang="scss" scoped>
.list__group {
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: solid 0.1px #dddddd
}
.area-attachment-no-upload {
  position: relative;
  top: -20px;
}
.list__tile__attachment {
  height: auto;
}
.list__tile__normal {
  height: 48px;
}
</style>

<style lang="scss">
.the-test-plan-preview .data-iterator {
  .data-iterator__actions__select .input-group--select {
    margin: 13px 0 13px 34px;
  }
  .list__tile {
    height: inherit;
  }
}
</style>
