<template>
  <dashboard-pane :title="title">
    <slot slot="title" name="title" />
    <slot slot="nav" name="nav" />
    <div class="tab-controls">
      <factor-input-select placeholder="Bulk Actions" :list="['move-to-trash']" />

      <table-tabber />
      <table-pagination />
    </div>
    <dashboard-table
      class="post-table"
      :structure="tableStructure()"
      :row-items="rows"
      :zero-state="7"
    >
      <template slot-scope="{column, item, row, index}">
        <div v-if="column == 'select'">
          <factor-input-checkbox label />
        </div>
        <div v-if="column == 'title'" class="post-title">
          <factor-link :path="`${$route.path}/edit`" :query="{id: row.id}">{{ item }}</factor-link>
          <factor-link
            v-if="row.permalink"
            class="permalink"
            :path="postlink(row.type, row.permalink)"
          >{{ postlink(row.type, row.permalink, false) }}</factor-link>
        </div>

        <div v-else-if="column == 'author'" class="author">
          <factor-card-user v-for="(user, ind) in row.authorData" :key="ind" :uid="user.uid" />
        </div>

        <div v-else-if="column == 'meta'" class="meta">
          <span class="meta status">
            <span class="val">{{ $utils.toLabel(row.status) }}</span>
          </span>
          <span class="meta date">
            <span class="val">{{ $time.niceFormat(row.date) }}</span>
          </span>
        </div>
      </template>
    </dashboard-table>
  </dashboard-pane>
</template>
<script>
export default {
  components: {
    "table-pagination": () => import("./el/pagination"),
    "table-tabber": () => import("./el/tabber")
  },
  props: {
    title: { type: String, default: "" },
    rows: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false }
  },

  methods: {
    postlink(type, permalink, root = true) {
      return this.$posts.getPermalink({ type, permalink, root })
    },

    async trashPost(id, index) {
      await this.$posts.trashPost({ id })

      this.posts.splice(index, 1)
    },
    setDefault() {
      return true
    },
    tableStructure() {
      return [
        {
          column: "select",
          size: "40px"
        },
        {
          column: "title",
          size: "2fr",
          type: "double"
        },

        {
          column: "author",
          size: "1fr",
          type: "single"
        },
        {
          column: "meta",
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