<template>
  <dashboard-pane :title="title">
    <dashboard-grid-controls>
      <dashboard-grid-actions
        :actions="controlActions"
        :loading="sending"
        @action="$emit('action',{action: $event, selected})"
      />
      <dashboard-grid-filter filter-id="status" :filter-tabs="tabs" />
    </dashboard-grid-controls>

    <dashboard-grid
      class="contact-form-table"
      :structure="tableStructure()"
      :rows="tableList"
      @select-all="selectAll($event)"
    >
      <template #select="{row}">
        <input v-model="selected" type="checkbox" class="checkbox" label :value="row._id" />
      </template>
      <template #info="{row}">
        <div class="form-fields-wrap">
          <div class="form-fields">
            <div v-for="([key, value], i) in fields(row)" :key="i" class="dat">
              <strong>{{ toLabel(key) }}:</strong>
              <i>{{ value }}</i>
            </div>
          </div>
        </div>
      </template>
      <template #message="{row}">
        <div class="message">{{ row.message }}</div>
      </template>
      <template #created="{row}">{{ standardDate(row.createdAt) }}</template>
    </dashboard-grid>
  </dashboard-pane>
</template>
<script>
import { getPermalink, getStatusCount } from "@factor/post"
import { toLabel, standardDate } from "@factor/tools"
export default {
  name: "ContactFormList",
  props: {
    title: { type: String, default: "" },
    list: { type: Array, default: () => [] },
    meta: { type: Object, default: () => {} },
    loading: { type: Boolean, default: false },
    sending: { type: Boolean, default: false }
  },
  data() {
    return {
      selected: [],
      showInfo: [],
      loadingAction: false
    }
  },
  computed: {
    tableList() {
      return this.list.map(({ _id, createdAt, settings }) => {
        return {
          ...settings,
          createdAt,
          _id
        }
      })
    },
    tabs() {
      return [`all`, `trash`].map(key => {
        const count =
          key == "all"
            ? this.meta.total
            : getStatusCount({
                meta: this.meta,
                key
              })

        return {
          name: toLabel(key),
          value: key == "all" ? "" : key,
          count
        }
      })
    },
    controlActions() {
      return [
        { value: "trash", name: "Move to Trash" },
        { value: "delete", name: "Permanently Delete" }
      ].filter(_ => {
        return _.value != this.$route.query.status
      })
    }
  },

  methods: {
    standardDate,
    selectAll(val) {
      this.selected = !val ? [] : this.list.map(_ => _._id)
    },
    fields(row) {
      const { message, createdAt, _id, ...rest } = row
      return Object.entries(rest).filter(([key, value]) => value)
    },
    postlink(postType, permalink, root = true) {
      return getPermalink({ postType, permalink, root })
    },

    tableStructure() {
      return [
        {
          _id: "select",
          width: "50px"
        },

        {
          _id: "message",
          width: "minmax(200px, 300px)"
        },
        {
          _id: "info",
          width: "minmax(300px, 600px)"
        },
        {
          _id: "created",
          width: "minmax(100px, 150px)"
        }
      ]
    }
  }
}
</script>
<style lang="less">
.contact-form-table {
  .dashboard-grid-body-row {
    font-size: 0.85em;
    .message {
      line-height: 1.4;
    }
    .form-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 10px;
      .dat {
        min-width: 0;
        strong {
          display: block;
        }
      }
    }
  }
}
</style>