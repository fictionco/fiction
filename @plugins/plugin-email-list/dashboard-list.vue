<template>
  <dashboard-pane :title="postTypeUIConfig.namePlural">
    <dashboard-grid-controls>
      <dashboard-grid-actions
        :actions="controlActions"
        :loading="sending"
        @action="handleAction($event)"
      />
      <dashboard-grid-filter filter-id="status" :filter-tabs="tabs" />
    </dashboard-grid-controls>

    <dashboard-grid :structure="grid()" :rows="list" @select-all="selectAll($event)">
      <template #select="{value, row}">
        <input v-model="selected" type="checkbox" class="checkbox" label :value="row._id" />
      </template>
      <template #listId="{row}">
        <factor-link :path="`${$route.path}/edit`" :query="{ _id: row._id }">
          {{
            row.title
          }}
        </factor-link>
      </template>
      <template
        #emailCount="{row}"
      >{{ row.list.length }} / {{ row.list.filter(_ => _.verified).length }}</template>
    </dashboard-grid>
  </dashboard-pane>
</template>
<script lang="ts">
/* eslint-disable no-unused-vars */
import { getStatusCount } from "@factor/post/util"
import { toLabel, stored, getPermalink, omit } from "@factor/api"
import { factorLink } from "@factor/ui"
import {
  dashboardPane,
  dashboardGrid,
  dashboardGridControls,
  dashboardGridActions,
  dashboardGridFilter
} from "@factor/dashboard"
import Vue from "vue"
import { postTypeUIConfig, csvExport } from "."
export default Vue.extend({
  name: "EmailListGrid",
  components: {
    dashboardPane,
    dashboardGrid,
    dashboardGridControls,
    dashboardGridActions,
    dashboardGridFilter,
    factorLink
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
    },
    controlActions() {
      return [
        { value: "export-csv", name: "Export List to CSV" },
        {
          value: "trash",
          name: "Move to Trash",
          condition: query => query.status != "trash"
        },
        {
          value: "publish",
          name: "Move to Published",
          condition: query => query.status == "trash"
        },
        { value: "delete", name: "Permanently Delete" }
      ]
    }
  },

  methods: {
    handleAction(action) {
      if (action == "export-csv") {
        const data = []
        const name = ["email-list"]
        this.selected.forEach(_id => {
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
