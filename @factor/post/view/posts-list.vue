<template>
  <dashboard-pane :title="title">
    <slot slot="title" name="title" />

    <template slot="nav">
      <factor-link
        :path="`/dashboard/posts/${postType}/add-new`"
        btn="primary"
        data-test="add-post"
      >
        Add New
        <factor-icon icon="arrow-right" />
      </factor-link>
    </template>
    <dashboard-grid-controls>
      <dashboard-grid-actions
        :actions="controlActions"
        :loading="loadingAction"
        @action="runAction($event)"
      />
      <dashboard-grid-filter filter-id="status" :filter-tabs="tabs" />
    </dashboard-grid-controls>

    <dashboard-grid
      :structure="tableStructure()"
      :rows="list"
      :zero-state="7"
      @select-all="selectAll($event)"
    >
      <template #select="{row}">
        <input v-model="selected" type="checkbox" class="checkbox" label :value="row._id" />
      </template>
      <template #title="{row}">
        <div class="post-title">
          <factor-link :path="`${$route.path}/edit`" :query="{ _id: row._id }">
            {{
              row.title
            }}
          </factor-link>
          <factor-link
            v-if="row.permalink"
            class="permalink"
            :path="postlink(row.postType, row.permalink, false)"
          >{{ postlink(row.postType, row.permalink, false) }}</factor-link>
        </div>
      </template>

      <template #author="{row}">
        <dashboard-user-card v-for="(_id, index) in row.author" :key="index" :post-id="_id" />
      </template>

      <template #status="{row}">{{ toLabel(row.status) }}</template>
      <template #updated="{row}">{{ standardDate(row.updatedAt) }}</template>
      <template #publish-date="{row}">{{ standardDate(row.date) }}</template>
    </dashboard-grid>
    <dashboard-table-footer v-bind="$attrs" :meta="meta" />
  </dashboard-pane>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import {
  dashboardGrid,
  dashboardGridControls,
  dashboardGridFilter,
  dashboardPane,
  dashboardTableFooter,
  dashboardUserCard,
  dashboardGridActions
} from "@factor/dashboard"
import {getStatusCount} from "@factor/post/util"

import {  requestPostSaveMany, requestPostDeleteMany } from "@factor/post/request"
import { toLabel, standardDate, emitEvent, getPermalink } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorIcon,
    factorLink,
    dashboardGrid,
    dashboardGridControls,
    dashboardGridActions,
    dashboardGridFilter,
    dashboardPane,
    dashboardTableFooter,
    dashboardUserCard
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
    tabs() {
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

    statusDetails() {
      const { categories: { status = {} } = {} } = this.index || {}
      return status
    },
    postType() {
      return this.$route.params.postType || ""
    },
    controlActions() {
      return [
        { value: "published", name: "Publish" },
        { value: "draft", name: "Change to Draft" },
        { value: "trash", name: "Move to Trash" },
        { value: "delete", name: "Permanently Delete" }
      ]
        .filter(_ => {
          return _.value != this.$route.query.status
        })
        .filter(
          _ =>
            _.value !== "delete" ||
            (_.value == "delete" && this.$route.query.status == "trash")
        )
    }
  },

  methods: {
    toLabel,
    standardDate,
    selectAll(val) {
      this.selected = !val ? [] : this.list.map(_ => _._id)
    },
    async runAction(action) {
      this.loadingAction = true

      if (this.selected.length > 0) {
        if (action == "delete") {
          if (confirm("Are you sure? This will permanently delete the selected posts.")) {
            await requestPostDeleteMany({
              _ids: this.selected,
              postType: this.postType
            })
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
    postlink(postType, permalink) {
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
