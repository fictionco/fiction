<template>
  <dashboard-panel>
    <dashboard-list-controls
      :control-actions="controlActions()"
      :control-status="controlStatus()"
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
      sub-title="Email List"
      :meta="postItemMeta(post)"
      :additional="postItemAdditional(post)"
    />
  </dashboard-panel>
</template>
<script lang="ts">
import { getStatusCount } from "@factor/post/util"
import { stored, timeUtil, timestamp, emitEvent } from "@factor/api"
import { FactorPost } from "@factor/post/types"
import { ControlAction } from "@factor/dashboard/types"
import { requestPostSaveMany, requestPostDeleteMany } from "@factor/post/request"
import { dashboardPanel, dashboardListPost, dashboardListControls } from "@factor/ui"
import Vue from "vue"
import { EmailConfig } from "./types"
import { postTypeUIConfig, csvExport } from "."
export default Vue.extend({
  name: "EmailListGrid",
  components: {
    dashboardListPost,
    dashboardPanel,
    dashboardListControls,
  },
  props: {
    postType: { type: String, default: "post" },
    title: { type: String, default: "" },
    list: { type: Array, default: () => [] },
    meta: { type: Object, default: () => {} },
    loading: { type: Boolean, default: false },
    sending: { type: Boolean, default: false },
  },
  data() {
    return { selected: [], loadingAction: false, postTypeUIConfig }
  },
  computed: {},

  methods: {
    controlStatus(this: any): ControlAction[] {
      const countTrash = getStatusCount({ meta: this.meta, key: "trash" })
      return [
        { value: "", label: `All (${this.meta.totalForQuery ?? 0})` },
        { value: "trash", label: `Trash (${countTrash})` },
      ]
    },

    controlActions(): ControlAction[] {
      const actions = [
        { value: "export-csv", label: "Export List to CSV" },
        {
          value: "trash",
          label: "Move to Inactive/Trash",
          condition: (query: { [key: string]: string }) => query.status != "trash",
          confirm: (selected: string[]) => `Move ${selected.length} list(s) to trash?`,
        },
        {
          value: "publish",
          label: "Move to Active Lists",
          condition: (query: { [key: string]: string }) => query.status == "trash",
        },
        {
          value: "delete",
          label: "Permanently Delete",
          condition: (query: { [key: string]: string }) => query.status == "trash",
          confirm: (selected: string[]) =>
            `Permanently delete ${selected.length} list(s)?`,
        },
      ]

      return actions
    },
    postItemMeta(post: FactorPost) {
      const list = post.list ? post.list : []

      return [
        {
          label: "Emails",
          value: list.length,
        },
        {
          label: "Verified",
          value: list.filter((_) => _.verified).length,
        },
      ]
    },
    postItemAdditional(this: any, post: FactorPost) {
      const list = post.list ? post.list : []
      list
        .filter((_) => _.addedAt)
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
            emailsInDay.filter((_: EmailConfig) => _.verified).length
          } Verified)`,
        },
        {
          label: "In Week",
          value: `${emailsInWeek.length} Emails (${
            emailsInWeek.filter((_: EmailConfig) => _.verified).length
          } Verified)`,
        },
        {
          label: "In Month",
          value: `${emailsInMonth.length} Emails (${
            emailsInMonth.filter((_: EmailConfig) => _.verified).length
          } Verified)`,
        },
      ]
    },
    emailsInTime(list: any[], time: "day" | "week" | "month") {
      const boundary = timestamp(timeUtil().subtract(1, time))
      return list.filter((_) => _.addedAt >= boundary)
    },
    async handleAction(this: any, action: string) {
      this.loadingAction = true

      if (this.selected.length > 0) {
        if (action == "export-csv") {
          let data: EmailConfig[] = []
          const name = ["email-list"]
          this.selected.forEach((_id: string) => {
            const p = stored(_id)
            if (p.list) {
              const list = p.list.map((_: EmailConfig) => {
                delete _.code
                return _
              })
              data = [...data, ...list]

              name.push(p.title)
            }
          })

          csvExport<EmailConfig>({
            filename: name.join("-"),
            data,
          })
        } else if (action == "delete") {
          await requestPostDeleteMany({ _ids: this.selected, postType: this.postType })
        } else {
          await requestPostSaveMany({
            _ids: this.selected,
            data: { status: action },
            postType: this.postType,
          })
        }
        emitEvent("refresh-table")
      }

      this.loadingAction = false
    },
    selectAll(this: any, val: boolean): void {
      this.selected = !val ? [] : this.list.map((_: FactorPost) => _._id)
    },
  },
})
</script>
<style lang="less"></style>
