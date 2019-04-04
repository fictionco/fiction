<template>
  <dashboard-pane :title="title">
    <slot slot="title" name="title" />
    <slot slot="nav" name="nav" />
    <dashboard-table-controls v-bind="$attrs" :tabs="tabs" />

    <dashboard-table
      class="post-table"
      :structure="tableStructure()"
      :row-items="rows"
      :zero-state="7"
    >
      <template slot-scope="{column, item, row}">
        <div v-if="column == 'select'">
          <factor-input-checkbox label />
        </div>
        <div v-if="column == 'name'" class="post-title">
          <factor-link :path="`${$route.path}/edit`" :query="{id: row.uid}">{{ row.displayName }}</factor-link>
          <factor-link
            v-if="row.email"
            class="permalink"
            :path="postlink(row.type, row.permalink)"
          >{{ row.email }}</factor-link>
        </div>

        <div v-else-if="column == 'photo'" class="author">
          <factor-avatar :url="row.photoURL" />
        </div>

        <div v-else-if="column == 'role'" class="meta">
          <span class="meta status">
            <span v-if="row.roles" class="val">{{ $utils.toLabel(row.roles.join(',')) }}</span>
          </span>
        </div>

        <div v-else-if="column == 'activity'" class="meta">
          <span class="meta date">
            <span class="val">Signed Up: {{ $time.niceFormat(row.signedInAt) }}</span>
          </span>
          <span class="meta date">
            <span class="val">Logged In: {{ $time.niceFormat(row.createdAt) }}</span>
          </span>
        </div>
      </template>
    </dashboard-table>
  </dashboard-pane>
</template>
  <script>
export default {
  props: {
    title: { type: String, default: "" },
    rows: { type: Array, default: () => [] },
    index: { type: Object, default: () => {} },
    loading: { type: Boolean, default: false }
  },
  computed: {
    tabs() {
      return [`all`, `admin`, `moderator`, `member`].map(key => {
        const count =
          key == "all" ? this.index.total : this.getCounts[key] || 0
        return {
          name: this.$utils.toLabel(key),
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
    postlink(type, permalink, root = true) {
      return this.$posts.getPermalink({ type, permalink, root })
    },

    tableStructure() {
      return [
        // {
        //   column: "select",
        //   size: "40px"
        // },
        {
          column: "name",
          size: "1.5fr",
          type: "double"
        },

        {
          column: "photo",
          size: "1fr",
          type: "single"
        },
        {
          column: "role",
          size: "1fr",
          type: "single"
        },
        {
          column: "activity",
          size: "1fr",
          type: "single"
        }
      ]
    }
  }
}
</script>
<style lang="less">
.posts-dashboard {
  .post-table {
    font-size: 0.85em;
  }
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
  .select {
    text-align: center;
  }
}
</style>