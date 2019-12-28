<template>
  <dashboard-pane>
    <!-- <dashboard-grid-controls>
      <dashboard-grid-actions
        :actions="controlActions"
        :loading="sending"
        @action="handleAction($event)"
      />
      <dashboard-grid-filter filter-id="status" :filter-tabs="tabs" />
    </dashboard-grid-controls>-->
    <dashboard-list-controls :control-actions="controlActions()" :control-status="controlStatus()"></dashboard-list-controls>
    <dashboard-list-post
      v-for="post in list"
      :key="post._id"
      v-model="selected"
      :post="post"
      sub-title="Email List"
      :meta="postItemMeta(post)"
      :additional="postItemAdditional(post)"
    ></dashboard-list-post>
  </dashboard-pane>
</template>
<script lang="ts">
/* eslint-disable no-unused-vars */
import { getStatusCount } from "@factor/post/util"
import { toLabel, stored, getPermalink, omit, timeUtil, timestamp } from "@factor/api"
import { FactorPost } from "@factor/post/types"
import { ControlAction } from "@factor/dashboard/types"
import {
  dashboardPane,
  dashboardGridControls,
  dashboardGridActions,
  dashboardGridFilter,
  dashboardListPost,
  dashboardListControls
} from "@factor/dashboard"
import Vue from "vue"

import { postTypeUIConfig, csvExport } from "."
export default Vue.extend({
  name: "EmailListGrid",
  components: {
    dashboardListPost,
    dashboardPane,
    dashboardListControls,
    dashboardGridControls,
    dashboardGridActions,
    dashboardGridFilter
  },
  props: {
    postType: { type: String, default: "post" },
    title: { type: String, default: "" },
    list: { type: Array, default: () => [] },
    meta: { type: Object, default: () => {} },
    loading: { type: Boolean, default: false },
    sending: { type: Boolean, default: false }
  },
  data() {
    return { selected: [], loadingAction: false, postTypeUIConfig }
  },
  computed: {
    tableList(this: any) {
      return this.list.map(({ _id, createdAt, settings }) => {
        return { ...settings, createdAt, _id }
      })
    },
    tabs(this: any) {
      return [`all`, `trash`].map(key => {
        const count: number =
          key == "all"
            ? this.meta.total
            : getStatusCount({
                meta: this.meta,
                key
              })

        return { name: toLabel(key), value: key == "all" ? "" : key, count }
      })
    }
  },

  methods: {
    controlStatus(this: any): ControlAction[] {
      const countTrash = getStatusCount({ meta: this.meta, key: "trash" })
      return [
        { value: "", label: `All (${this.meta.total})` },
        { value: "trash", label: `Trash (${countTrash})` }
      ]
    },

    controlActions(): ControlAction[] {
      const actions = [
        { value: "export-csv", label: "Export List to CSV" },
        {
          value: "trash",
          label: "Move to Trash",
          condition: (query: { [key: string]: string }) => query.status != "trash"
        },
        {
          value: "publish",
          label: "Move to Lists",
          condition: (query: { [key: string]: string }) => query.status == "trash"
        },
        {
          value: "delete",
          label: "Permanently Delete",
          condition: (query: { [key: string]: string }) => query.status == "trash"
        }
      ]

      return actions
    },
    postItemMeta(post: FactorPost) {
      const list = post.list ? post.list : []

      return [
        {
          label: "Emails",
          value: list.length
        },
        {
          label: "Verified",
          value: list.filter(_ => _.verified).length
        }
      ]
    },
    postItemAdditional(this: any, post: FactorPost) {
      const list = post.list ? post.list : []
      list
        .filter(_ => _.addedAt)
        .sort((a, b) => {
          return a.addedAt > b.addedAt ? 1 : -1
        })

      const emailsInWeek = this.emailsInTime(list, "week")
      const emailsInDay = this.emailsInTime(list, "day")
      const emailsInMonth = this.emailsInTime(list, "month")

      return [
        {
          label: "In 24 Hours",
          value: `${emailsInDay.length} Emails (${
            emailsInDay.filter(_ => _.verified).length
          } Verified)`
        },
        {
          label: "In Week",
          value: `${emailsInWeek.length} Emails (${
            emailsInWeek.filter(_ => _.verified).length
          } Verified)`
        },
        {
          label: "In Month",
          value: `${emailsInMonth.length} Emails (${
            emailsInMonth.filter(_ => _.verified).length
          } Verified)`
        }
      ]
    },
    emailsInTime(list: any[], time: "day" | "week" | "month") {
      const boundary = timestamp(timeUtil().subtract(1, time))
      return list.filter(_ => _.addedAt >= boundary)
    },
    handleAction(this: any, action: string) {
      if (action == "export-csv") {
        const data = []
        const name = ["email-list"]
        this.selected.forEach((_id: string) => {
          const p = stored(_id)
          if (p.list) {
            data.push(
              p.list.map(_ => {
                delete _.code
                return _
              })
            )
            name.push(p.title)
          }
        })

        csvExport({
          filename: name.join("-"),
          data: [...data]
        })
      } else {
        this.$emit("action", { action, selected: this.selected })
      }
    },
    selectAll(val) {
      this.selected = !val ? [] : this.list.map(_ => _._id)
    },
    fields(item) {
      const rest = omit(item, ["message", "createdAt", "_id"])

      return Object.values(rest)
    },
    postlink(postType, permalink, root = true) {
      return getPermalink({ postType, permalink, root })
    },

    grid() {
      return [
        {
          _id: "select",
          width: "40px"
        },

        {
          name: "List ID",
          _id: "listId",
          width: "minmax(100px, 1fr)"
        },
        {
          _id: "emailCount",
          name: "Emails Total / Verified",
          width: "170px"
        }
      ]
    }
  }
})
</script>
<style lang="less">
.contact-form-table {
  .dbt-body-row {
    font-size: 0.85em;
    .message {
      line-height: 1.4;
    }
    .contact-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 10px;
      .dat {
        strong {
          display: block;
        }
      }
    }
  }
}
</style>
