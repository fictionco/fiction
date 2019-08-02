<template>
  <dashboard-pane :title="title">
    <slot slot="title" name="title" />

    <template slot="nav">
      <dashboard-link
        :path="`/dashboard/posts/${postType}/add-new`"
        btn="primary"
        data-test="add-post"
      >
        Add New
        <factor-icon icon="arrow-right" />
      </dashboard-link>
    </template>
    <dashboard-table-controls
      v-bind="$attrs"
      :tabs="tabs"
      filter="status"
      :post-type="postType"
      :meta="meta"
      :actions="[{value: 'published', name: 'Publish'}, {value: 'draft', name: 'Change to Draft'}, {value: 'trash', name: 'Move to Trash'}]"
      :loading="loadingAction"
      @action="runAction($event)"
    />
    <dashboard-table
      class="post-table"
      :structure="tableStructure()"
      :row-items="list"
      :zero-state="7"
      @select-all="selectAll($event)"
    >
      <template slot-scope="{column, item, row}">
        <div v-if="column == 'select'">
          <input v-model="selected" type="checkbox" class="checkbox" label :value="row._id" >
        </div>
        <div v-if="column == 'title'" class="post-title">
          <dashboard-link :path="`${$route.path}/edit`" :query="{_id: row._id}">{{ item }}</dashboard-link>
          <dashboard-link
            v-if="row.permalink"
            class="permalink"
            :path="postlink(row.postType, row.permalink, false)"
          >{{ postlink(row.postType, row.permalink, false) }}</dashboard-link>
        </div>

        <div v-else-if="column == 'author'" class="author">
          <dashboard-user-card v-for="(_id, index) in row.author" :key="index" :post-id="_id" />
        </div>

        <div v-else-if="column == 'status'" class="meta">{{ $utils.toLabel(row.status) }}</div>
        <div v-else-if="column == 'updated'" class="meta">{{ $time.niceFormat(row.updatedAt) }}</div>
        <div v-else-if="column == 'created'" class="meta">{{ $time.niceFormat(row.createdAt) }}</div>
      </template>
    </dashboard-table>
    <dashboard-table-footer v-bind="$attrs" :meta="meta" />
  </dashboard-pane>
</template>
<script>
export default {
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
            : this.$posts.getStatusCount({
                meta: this.meta,
                key,
                nullKey: "draft"
              })

        return {
          name: this.$utils.toLabel(key),
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
    }
  },

  methods: {
    selectAll(val) {
      if (!val) {
        this.selected = []
      } else {
        this.selected = this.list.map(_ => _._id)
      }
    },
    async runAction(action) {
      this.loadingAction = true

      if (this.selected.length == 0) return

      await this.$posts.saveMany({
        _ids: this.selected,
        data: { status: action },
        postType: this.postType
      })

      this.$events.$emit("refresh-table")
      this.loadingAction = false
    },
    postlink(postType, permalink) {
      return this.$posts.getPermalink({ postType, permalink })
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
          class: "col-fixed-40",
          mobile: "mcol-1"
        },
        {
          column: "title",
          class: "col-5",
          mobile: "mcol-15"
        },

        {
          column: "author",
          class: "col-4",
          mobile: "mcol-2-15"
        },
        {
          column: "status",
          class: "col-2",
          mobile: "mcol-2-15"
        },
        {
          column: "created",
          class: "col-2",
          mobile: "mcol-2-15"
        },
        {
          column: "updated",
          class: "col-2",
          mobile: "mcol-2-15"
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