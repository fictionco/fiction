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
          <factor-avatar :post="row" />
        </div>

        <div v-else-if="column == 'role'" class="meta">
          <span class="meta status">
            <span v-if="row.role" class="val">{{ $utils.toLabel(row.role) }}</span>
          </span>
        </div>

        <div v-else-if="column == 'activity'" class="meta">
          <span class="meta date">
            <span class="val">
              <strong>Signed Up:</strong>
              {{ $time.niceFormat(row.createdAt) }}
            </span>
          </span>
          <span class="meta date">
            <span class="val">
              <strong>Logged In:</strong>
              {{ $time.niceFormat(row.signedInAt) }}
            </span>
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

    loading: { type: Boolean, default: false }
  },
  computed: {
    tabs() {
      return [`all`, `admin`, `moderator`, `member`].map(key => {
        // const count =
        //   key == "all" ? this.index.total : this.getCounts[key] || 0

        const count = 0
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
        //   class: "col-fixed-40"
        // },
        {
          column: "name",
          class: "col-7",
          mobile: "mcol-16"
        },

        {
          column: "photo",
          class: "col-3",
          mobile: "mcol-16"
        },
        {
          column: "role",
          class: "col-3",
          mobile: "mcol-16"
        },
        {
          column: "activity",
          class: "col-3",
          mobile: "mcol-16"
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

    .dbt-head {
      @media (max-width: 767px) {
        .photo,
        .role,
        .activity {
          display: none;
        }
      }
    }
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