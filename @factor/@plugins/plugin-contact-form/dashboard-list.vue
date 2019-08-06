<template>
  <dashboard-pane :title="title">
    <dashboard-table
      class="contact-form-table"
      :structure="tableStructure()"
      :row-items="tableList"
    >
      <template slot-scope="{column, item, row}">
        <div v-if="column == 'select'">
          <factor-input-checkbox label />
        </div>
        <div v-if="column == 'info'" class="contact-info">
          <div v-for="([key, value], i) in fields(row, column)" :key="i" class="dat">
            <strong>{{ $utils.toLabel(key) }}:</strong>
            <i>{{ value }}</i>
          </div>
        </div>
        <div v-if="column == 'message'" class="contact-message">{{ row.message }}</div>

        <div v-if="column == 'created'" class="meta">{{ $time.niceFormat(row.createdAt) }}</div>
      </template>
    </dashboard-table>
  </dashboard-pane>
</template>
  <script>
export default {
  name: "ContactFormList",
  props: {
    title: { type: String, default: "" },
    list: { type: Array, default: () => [] },
    meta: { type: Object, default: () => {} },
    loading: { type: Boolean, default: false }
  },
  computed: {
    tableList() {
      return this.list.map(_ => {
        return {
          ..._.settings,
          createdAt: _.createdAt
        }
      })
    }
  },

  methods: {
    fields(item, type) {
      const { message, createdAt, ...rest } = item
      return Object.entries(rest).filter(([key, value]) => value)
    },
    postlink(postType, permalink, root = true) {
      return this.$post.getPermalink({ postType, permalink, root })
    },

    tableStructure() {
      return [
        {
          column: "select",
          class: "col-fixed-40",
          mobile: "mcol-1"
        },

        {
          column: "message",
          class: "col-6",
          mobile: "mco-7"
        },
        {
          column: "info",
          class: "col-7",
          mobile: "mcol-8"
        },
        {
          column: "created",
          class: "col-2",
          mobile: "mcol-8"
        }
      ]
    }
  }
}
</script>
<style lang="less">
.contact-form-table {
  .dbt-row {
    .contact-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 10px;
      .dat {
        font-size: 0.85em;
        strong {
          display: block;
        }
      }
    }
  }
}
</style>