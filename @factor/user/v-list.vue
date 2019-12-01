<template>
  <dashboard-pane :title="title">
    <slot slot="title" name="title" />
    <slot slot="nav" name="nav" />
    <dashboard-grid-controls>
      <div></div>
      <dashboard-grid-filter filter-id="role" :filter-tabs="tabs" />
    </dashboard-grid-controls>

    <dashboard-grid :structure="tableStructure()" :rows="list" :zero-state="7">
      <template #name="{row}">
        <div class="post-title">
          <factor-link :path="`${$route.path}/edit`" :query="{ _id: row._id }">{{
            row.displayName
          }}</factor-link>
          <factor-link
            v-if="row.email"
            class="permalink"
            :path="postlink(row.postType, row.permalink)"
          >{{ row.email }}</factor-link>
        </div>
      </template>

      <template #photo="{row}">
        <factor-avatar :post-id="row.avatar" />
      </template>

      <template #role="{row}">{{ toLabel(row.role) }}</template>
      <template #signed-up="{row}">{{ standardDate(row.createdAt) }}</template>
      <template #last-seen="{row}">{{ standardDate(row.signedInAt) }}</template>
    </dashboard-grid>
    <dashboard-table-footer v-bind="$attrs" :meta="meta" />
  </dashboard-pane>
</template>

<script>
import {
  dashboardPane,
  dashboardTableFooter,
  dashboardGrid,
  dashboardGridControls,
  dashboardGridFilter
} from "@factor/dashboard"
import { factorLink, factorAvatar } from "@factor/ui"
import { getStatusCount } from "@factor/post"
import { toLabel, standardDate, getPermalink } from "@factor/tools"
import Vue from "vue"
export default Vue.extend({
  name: "UserList",
  components: {
    dashboardPane,
    dashboardTableFooter,
    dashboardGrid,
    dashboardGridControls,
    dashboardGridFilter,
    factorLink,
    factorAvatar
  },
  props: {
    title: { type: String, default: "" },
    list: { type: Array, default: () => [] },
    meta: { type: Object, default: () => {} },
    loading: { type: Boolean, default: false }
  },
  computed: {
    tabs() {
      return [`all`, `admin`, `moderator`, `member`].map(key => {
        const count =
          key == "all"
            ? this.meta.total
            : getStatusCount({
                meta: this.meta,
                field: "role",
                key,
                nullKey: "member"
              })

        return {
          name: toLabel(key),
          value: key == "all" ? "" : key,
          count
        }
      })
    },
    getCounts() {
      const { categories: { accessLevel = {} } = {} } = this.index || {}
      const counts = {
        admin: 0,
        moderator: 0,
        member: 0
      }
      Object.keys(accessLevel).forEach(level => {
        const cnt = accessLevel[level]
        const authNumber = parseInt(level)
        if (authNumber > 300) {
          counts.admin += cnt
        } else if (authNumber > 100) {
          counts.moderator += cnt
        } else {
          counts.member += cnt
        }
      })
      return counts
    }
  },

  methods: {
    toLabel,
    standardDate,
    postlink(postType, permalink, root = true) {
      return getPermalink({ postType, permalink, root })
    },

    tableStructure() {
      return [
        // {
        //   column: "select",
        //   class: "col-fixed-40"
        // },
        {
          _id: "name",
          width: "minmax(150px, 1fr)"
        },

        {
          _id: "photo",
          width: "70px"
        },
        {
          _id: "role",
          width: "minmax(100px, 200px)"
        },
        {
          _id: "signed-up",
          width: "minmax(100px, 125px)"
        },
        {
          _id: "last-seen",
          width: "minmax(100px, 125px)"
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
