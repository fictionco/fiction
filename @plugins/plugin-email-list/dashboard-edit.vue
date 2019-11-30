<template>
  <dashboard-pane :title="title" class="email-list-edit">
    <dashboard-grid-controls>
      <dashboard-grid-actions :actions="controlActions" @action="handleAction($event)" />
      <dashboard-grid-filter filter-id="email" :filter-tabs="tabs" />
    </dashboard-grid-controls>
    <dashboard-grid :structure="grid()" :rows="post.list" @select-all="selectAll($event)">
      <template #select="{value, row}">
        <input v-model="selected" type="checkbox" class="checkbox" label :value="row.email" />
      </template>
      <template #email="{row}">{{ row.email }}</template>
      <template #verified="{row}">{{ row.verified ? "Yes" : "No" }}</template>
      <template #delete="{row}">
        <factor-btn-dashboard text="Delete" @click="deleteEmails({ emails: [row.email] })" />
      </template>
    </dashboard-grid>
  </dashboard-pane>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import { deleteEmails, csvExport } from "."
import { toLabel, storeItem, stored } from "@factor/tools"
import {
  dashboardPane,
  dashboardGridControls,
  dashboardGridActions,
  dashboardGridFilter,
  dashboardGrid
} from "@factor/dashboard"
import { factorBtnDashboard } from "@factor/ui"
import Vue from "vue"
import { EmailConfig } from "./types"

export default Vue.extend({
  name: "EmailListGrid",
  components: {
    factorBtnDashboard,
    dashboardPane,
    dashboardGridControls,
    dashboardGridActions,
    dashboardGridFilter,
    dashboardGrid
  },
  props: {
    loading: { type: Boolean, default: false },
    sending: { type: Boolean, default: false }
  },
  data() {
    return {
      action: "",
      selected: [],
      loadingAction: false
    }
  },
  computed: {
    listId() {
      return this.post.title
    },
    title() {
      return `Email List - ${this.listId}`
    },
    _id(): string {
      return this.$route.query._id || ""
    },
    post: {
      get() {
        return stored(this._id) || {}
      },
      set(v) {
        storeItem(this._id, v)
      }
    } as any,

    tabs() {
      return [`all`, `verified`, `unverified`].map((key) => {
        let count = 0
        if (this.post && this.post.list) {
          const total = this.post.list.length
          const verified = this.post.list.filter((_) => _.verified).length

          if (key == "all") {
            count = total
          } else if (key == "verified") {
            count = verified
          } else if (key == "unverified") {
            count = total - verified
          }
        }

        return {
          name: toLabel(key),
          value: key == "all" ? "" : key,
          count
        }
      })
    },
    controlActions() {
      return [
        { value: "export-all", name: "Export List to CSV" },
        { value: "export-selected", name: "Export Selected to CSV" },
        { value: "delete", name: "Permanently Delete" }
      ]
    }
  },

  methods: {
    async deleteEmails(this: any, { emails }: { emails: string[] }) {
      const result = await deleteEmails({
        emails,
        listId: this.listId
      })

      // Remove from UI
      if (result) {
        const newList = this.post.list.filter(
          (_: EmailConfig) => !emails.includes(_.email)
        )
        this.post = { ...this.post, list: newList }
      }
    },

    handleAction(this: any, action: string) {
      if (action == "delete") {
        this.deleteEmails({ emails: this.selected })
      } else if (action == "export-all") {
        const data = this.post.list.map((_) => {
          delete _.code

          return _
        })
        csvExport({
          filename: `email-list-${this.listId}`,
          data
        })
      } else if (action == "export-selected") {
        const data = this.post.list
          .filter((_: EmailConfig) => this.selected.includes(_.email))
          .map((_: EmailConfig) => {
            delete _.code

            return _
          })
        csvExport({
          filename: `email-list-${this.listId}-selected`,
          data
        })
      }
    },
    selectAll(this: any, val: boolean) {
      this.selected = !val ? [] : this.post.list.map((_: EmailConfig) => _.email)
    },

    grid() {
      return [
        {
          _id: "select",
          width: "40px"
        },

        {
          name: "Email",
          _id: "email",
          width: "minmax(240px, 1fr)"
        },
        {
          _id: "verified",
          name: "Verified?",
          width: "80px"
        },
        {
          _id: "delete",
          name: "Delete?",
          width: "100px"
        }
      ]
    }
  }
})
</script>
<style lang="less"></style>
