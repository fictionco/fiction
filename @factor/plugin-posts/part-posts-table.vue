<template>
  <dashboard-pane :title="title">
    <slot slot="title" name="title" />
    <slot slot="nav" name="nav" />
    <dashboard-table
      class="post-table"
      :structure="tableStructure()"
      :row-items="rows"
      :zero-state="2"
    >
      <template slot-scope="{column, item, row, index}">
        <div v-if="column == 'title'" class="post-title">
          <el-link :path="`/admin/posts/edit`" :query="{id: row.id}">{{ item }}</el-link>
          <el-link
            v-if="row.permalink"
            class="permalink"
            :path="postlink(row.type, row.permalink)"
          >{{ postlink(row.type, row.permalink, false) }}</el-link>
        </div>

        <div v-else-if="column == 'author'" class="author">
          <el-card-user v-for="(user, ind) in row.authorData" :key="ind" :uid="user.uid" />
        </div>

        <div v-else-if="column == 'meta'" class="meta">
          <span class="meta type">
            <label>Type</label>
            <span class="val">{{ $utils.slugToLabel(row.type) }}</span>
          </span>
          <span class="meta date">
            <label>Date</label>
            <span class="val">{{ $time.niceFormat(row.date) }}</span>
          </span>
          <span class="meta status">
            <label>Status</label>
            <span class="val">{{ $utils.slugToLabel(row.status) }}</span>
          </span>
        </div>

        <template v-else-if="column == 'actions'">
          <el-link @click.prevent="$emit('trash', row.id, index)">Trash</el-link>
        </template>
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
        },
        {
          column: "actions",
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
      font-size: 1.3em;
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