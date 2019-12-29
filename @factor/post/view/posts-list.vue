<template>
  <dashboard-pane :title="title">
    <slot slot="title" name="title" />

    <dashboard-list-controls
      :control-actions="controlActions()"
      :control-status="controlStatus()"
      :selected="selected"
      :loading="loading"
      :list="list"
      @action="handleAction($event)"
      @select-all="selectAll($event)"
    />

    <dashboard-list-post v-for="post in list" :key="post._id" v-model="selected" :post="post" />

    <dashboard-table-footer v-bind="$attrs" :meta="meta" />
  </dashboard-pane>
</template>
<script lang="ts">
import {
  dashboardPane,
  dashboardTableFooter,
  dashboardListPost,
  dashboardListControls
} from "@factor/dashboard"
import { getStatusCount } from "@factor/post/util"
import { ControlAction } from "@factor/dashboard/types"
import { requestPostSaveMany, requestPostDeleteMany } from "@factor/post/request"
import { toLabel, standardDate, emitEvent, getPermalink } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: {
    dashboardListPost,
    dashboardListControls,
    dashboardPane,
    dashboardTableFooter
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
    tabs(this: any): { name: string; value: string; count: number }[] {
      return [`all`, `published`, `draft`, `trash`].map(key => {
        const count =
          key == "all"
            ? this.meta.total
            : getStatusCount({
                meta: this.meta,
                key,
                nullKey: "draft"
              })

        return {
          name: toLabel(key),
          value: key == "all" ? "" : key,
          count
        }
      })
    },

    statusDetails(this: any): string {
      const { categories: { status = {} } = {} } = this.index || {}
      return status
    },
    postType(this: any): string {
      return this.$route.params.postType || ""
    }
    // controlActions(this: any): { value: string; name: string }[] {
    //   return [
    //     { value: "published", name: "Publish" },
    //     { value: "draft", name: "Change to Draft" },
    //     { value: "trash", name: "Move to Trash" },
    //     { value: "delete", name: "Permanently Delete" }
    //   ]
    //     .filter(_ => {
    //       return _.value != this.$route.query.status
    //     })
    //     .filter(
    //       _ =>
    //         _.value !== "delete" ||
    //         (_.value == "delete" && this.$route.query.status == "trash")
    //     )
    // }
  },

  methods: {
    toLabel,
    standardDate,
    selectAll(this: any, val: boolean) {
      this.selected = !val ? [] : this.list.map(_ => _._id)
    },
    controlStatus(this: any): ControlAction[] {
      const countTrash = getStatusCount({ meta: this.meta, key: "trash" })
      const countPublished = getStatusCount({ meta: this.meta, key: "published" })
      const countDraft = getStatusCount({ meta: this.meta, key: "draft" })
      return [
        { value: "", label: `All (${this.meta.total})` },
        { value: "published", label: `Published (${countPublished})` },
        { value: "draft", label: `Draft (${countDraft})` },
        { value: "trash", label: `Trash (${countTrash})` }
      ]
    },
    controlActions(): ControlAction[] {
      const actions = [
        {
          value: "published",
          label: "Publish Post(s)",
          condition: (query: { [key: string]: string }) => query.status != "trash",
          confirm: (selected: string[]) =>
            `Change ${selected.length} post(s) to published?`
        },
        {
          value: "draft",
          label: "Draft Post(s)",
          condition: (query: { [key: string]: string }) => query.status != "trash",
          confirm: (selected: string[]) => `Change ${selected.length} post(s) to draft?`
        },
        {
          value: "trash",
          label: "Move to Trash",
          condition: (query: { [key: string]: string }) => query.status != "trash",
          confirm: (selected: string[]) => `Move ${selected.length} post(s) to trash?`
        },
        {
          value: "delete",
          label: "Permanently Delete",
          condition: (query: { [key: string]: string }) => query.status == "trash",
          confirm: (selected: string[]) =>
            `Permanently delete ${selected.length} post(s)?`
        }
      ]

      return actions
    },
    async handleAction(this: any, action: string) {
      this.loadingAction = true

      if (this.selected.length > 0) {
        if (action == "delete") {
          if (confirm("Are you sure? This will permanently delete the selected posts.")) {
            await requestPostDeleteMany({ _ids: this.selected, postType: this.postType })
          }
        } else {
          await requestPostSaveMany({
            _ids: this.selected,
            data: { status: action },
            postType: this.postType
          })
        }
        emitEvent("refresh-table")
      }

      this.loadingAction = false
    },
    postlink(postType: string, permalink: string) {
      return getPermalink({ postType, permalink })
    },

    setDefault() {
      return true
    },
    tableStructure() {
      return [
        {
          _id: "select",
          width: "25px"
        },
        {
          _id: "title",
          width: "minmax(30vw, 550px)"
        },

        {
          _id: "author",
          width: "minmax(150px, 250px)"
        },
        {
          _id: "status",
          width: "minmax(100px, 200px)"
        },
        {
          _id: "publish-date",
          width: "minmax(100px, 200px)"
        },
        {
          _id: "updated",
          width: "minmax(100px, 200px)"
        }
      ]
    }
  }
})
</script>
<style lang="less">
.posts-dashboard {
  .post-title {
    > a {
      display: block;
      font-size: 1.2em;
      line-height: 1.4;
    }
    .permalink {
      margin-top: 5px;
      opacity: 0.5;
      color: inherit;

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
  .select {
    text-align: center;
  }
}
</style>
