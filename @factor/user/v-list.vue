<template>
  <dashboard-pane :title="title">
    <dashboard-list-controls
      :control-actions="controlActions()"
      :control-status="controlStatus()"
      status-field="role"
      :selected="selected"
      :loading="loading"
      :list="list"
      @action="handleAction($event)"
      @select-all="selectAll($event)"
    />

    <dashboard-list-post
      v-for="post in list"
      :key="post._id"
      v-model="selected"
      :post="post"
      :title="post.displayName || 'No Name'"
      :sub-title="post.email"
      :meta="postItemMeta(post)"
    />

    <dashboard-table-footer v-bind="$attrs" :meta="meta" />
  </dashboard-pane>
</template>

<script lang="ts">
import {
  dashboardPane,
  dashboardListPost,
  dashboardListControls,
  dashboardTableFooter
} from "@factor/dashboard"
import { currentUser, userCan } from "@factor/user"
import { FactorUser } from "@factor/user/types"
import { getStatusCount } from "@factor/post/util"
import { toLabel, standardDate, emitEvent } from "@factor/api"
import { requestPostSaveMany, requestPostDeleteMany } from "@factor/post/request"
import { FactorPost } from "@factor/post/types"
import Vue from "vue"
import { ControlAction } from "@factor/dashboard/types"
export default Vue.extend({
  name: "UserList",
  components: {
    dashboardPane,
    dashboardTableFooter,
    dashboardListPost,
    dashboardListControls
  },
  props: {
    title: { type: String, default: "" },
    list: { type: Array, default: () => [] },
    meta: { type: Object, default: () => {} },
    loading: { type: Boolean, default: false }
  },
  data() {
    return {
      selected: [],
      loadingAction: false
    }
  },
  computed: {
    currentUser,
    roles() {
      return ["admin", "moderator", "editor", "member"]
    }
  },

  methods: {
    toLabel,
    standardDate,
    controlStatus(this: any): ControlAction[] {
      const roles = ["admin", "moderator", "editor", "member"]
      const counts: { [key: string]: number } = {}
      roles.forEach(role => {
        counts[role] = getStatusCount({
          meta: this.meta,
          field: "role",
          key: role
        })
      })

      return [
        { value: "", label: `All (${this.meta.totalForQuery ?? 0})` },
        { value: "admin", label: `Admin (${counts.admin})` },
        { value: "moderator", label: `Moderator (${counts.moderator})` },
        { value: "editor", label: `Editor (${counts.editor})` },
        { value: "member", label: `Member (${counts.member})` }
      ]
    },

    controlActions(this: any): ControlAction[] {
      const actions: ControlAction[] = []
      if (userCan({ accessLevel: 400 })) {
        actions.push({
          value: "delete",
          label: "Permanently Delete",
          confirm: (selected: string[]) =>
            `Permanently delete ${selected.length} user(s)?`
        })

        this.roles.forEach((role: string) => {
          actions.push({
            value: role,
            label: `Change to ${toLabel(role)}`,
            confirm: (selected: string[]) =>
              `Change ${selected.length} user(s) to "${role}" role?`
          })
        })
      }
      return actions
    },
    postItemMeta(post: FactorUser) {
      return [
        {
          value: toLabel(post.role || "no role")
        },
        {
          label: "Username",
          value: post.username || post.email
        },
        {
          label: "Since",
          value: standardDate(post.createdAt)
        }
      ]
    },

    async handleAction(this: any, action: string) {
      this.loadingAction = true

      if (action == "delete") {
        await requestPostDeleteMany({
          _ids: this.selected,
          postType: this.postType
        })
      } else if (["admin", "moderator", "editor", "member"].includes(action)) {
        await requestPostSaveMany({
          _ids: this.selected,
          data: { role: action },
          postType: "user"
        })
      }

      emitEvent("refresh-table")

      this.selected = []
      this.loadingAction = false
    },
    selectAll(this: any, val: boolean) {
      this.selected = !val ? [] : this.list.map((_: FactorPost) => _._id)
    }
  }
})
</script>
<style lang="less">
.posts-dashboard {
  .post-title {
    > a {
      display: block;
      font-size: 1.4em;
      line-height: 1.2;
    }
    .permalink {
      margin-top: 5px;
      opacity: 0.5;
      color: inherit;
      font-size: 11px;
      font-weight: 500;
    }
  }
  .meta {
    line-height: 1.5;

    display: block;
    label {
      opacity: 0.4;
      margin-right: 0.5em;
    }
  }
  .author {
    .user-card-wrap {
      margin: 0 3px 3px 0;
    }
  }
}
</style>
