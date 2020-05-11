<template>
  <dashboard-page>
    <dashboard-panel :title="title" class="email-list-edit">
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
        v-for="item in list"
        :key="item.email"
        v-model="selected"
        :post="item"
        sub-title="Email"
        :meta="postItemMeta(item)"
        :additional="[]"
        :actions="postItemActions(item)"
        :edit-path="false"
      />
    </dashboard-panel>
  </dashboard-page>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import { storeItem, stored, internationalDate } from "@factor/api"
import {
  dashboardPage,
  dashboardPanel,
  dashboardListPost,
  dashboardListControls,
} from "@factor/ui"
import { ControlAction } from "@factor/dashboard/types"
import { FactorPost } from "@factor/post/types"
import { EmailConfig } from "./types"
import { deleteEmails, csvExport } from "."
export default {
  name: "EmailListGrid",
  components: {
    dashboardPage,
    dashboardPanel,
    dashboardListPost,
    dashboardListControls,
  },
  props: {
    loading: { type: Boolean, default: false },
    sending: { type: Boolean, default: false },
  },
  data() {
    return {
      action: "",
      selected: [],
      loadingAction: false,
    }
  },
  computed: {
    listId(this: any) {
      return this.post.title
    },
    title(this: any) {
      return `Email List - ${this.listId}`
    },
    _id(this: any): string {
      return this.$route.query._id || ""
    },
    post: {
      get() {
        return stored(this._id) || {}
      },
      set(v: FactorPost) {
        storeItem(this._id, v)
      },
    } as any,
    list(this: any) {
      if (!this.post.list) return []

      const fullList = this.post.list
        .map((_: EmailConfig) => {
          const { email } = _
          return {
            ..._,
            _id: email,
            title: email,
          }
        })
        .reverse()

      const status = this.$route.query.status || ""

      return fullList.filter((_: FactorPost) => {
        if (
          (status == "verified" && !_.verified) ||
          (status == "unverified" && _.verified)
        ) {
          return false
        } else {
          return true
        }
      })
    },
  },

  methods: {
    controlStatus(this: any): ControlAction[] {
      const list = this.post.list || []

      const countAll = list.length
      const countVerified = list.filter((_: EmailConfig) => _.verified).length
      return [
        { value: "", label: `All (${countAll})` },
        { value: "verified", label: `Verified (${countVerified})` },
        { value: "unverified", label: `Unverified (${countAll - countVerified})` },
      ]
    },
    controlActions(): ControlAction[] {
      const actions = [
        { value: "export-all", label: "Export List to CSV" },
        { value: "export-selected", name: "Export Selected to CSV" },
        {
          value: "delete",
          label: "Permanently Delete",
          confirm: (selected: string[]) =>
            `Permanently delete ${selected.length} email(s)?`,
        },
      ]

      return actions
    },
    postItemMeta(item: EmailConfig) {
      const items = [{ label: "Verified", value: item.verified ? "yes" : "no" }]

      if (item.addedAt) {
        items.push({ label: "Added", value: internationalDate(item.addedAt) })
      }
      return items
    },
    postItemActions(item: EmailConfig) {
      return [
        {
          label: "Delete",
          onClick: () => this.deleteEmails({ emails: [item.email] }),
        },
      ]
    },
    async deleteEmails(this: any, { emails }: { emails: string[] }) {
      await deleteEmails({
        emails,
        listId: this.listId,
      })

      // Remove from UI
      const newList = this.post.list.filter((_: EmailConfig) => !emails.includes(_.email))
      this.post = { ...this.post, list: newList }
    },

    handleAction(this: any, action: string) {
      if (action == "delete") {
        this.deleteEmails({ emails: this.selected })
      } else if (action == "export-all") {
        const data = this.post.list.map((_: EmailConfig) => {
          delete _.code

          return _
        })
        csvExport<EmailConfig>({
          filename: `email-list-${this.listId}`,
          data,
        })
      } else if (action == "export-selected") {
        const data = this.post.list
          .filter((_: EmailConfig) => this.selected.includes(_.email))
          .map((_: EmailConfig) => {
            delete _.code

            return _
          })
        csvExport<EmailConfig>({
          filename: `email-list-${this.listId}-selected`,
          data,
        })
      }
    },
    selectAll(this: any, val: boolean) {
      this.selected = !val ? [] : this.post.list.map((_: EmailConfig) => _.email)
    },
  },
}
</script>
<style lang="less"></style>
