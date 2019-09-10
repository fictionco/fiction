<template>
  <dashboard-pane :title="title" class="email-list-edit">
    <dashboard-grid-controls>
      <dashboard-grid-actions :actions="controlActions" @action="true" />
      <dashboard-grid-filter filter-id="status" :filter-tabs="tabs" />
    </dashboard-grid-controls>
    <dashboard-grid :structure="grid()" :rows="post.list" @select-all="selectAll($event)">
      <template #select="{value, row}">
        <input v-model="selected" type="checkbox" class="checkbox" label :value="row.email" >
      </template>
      <template #email="{row}">{{ row.email }}</template>
      <template #verified="{row}">{{ row.verified ? 'Yes' : 'No' }}</template>
      <template #delete="{row}">
        <factor-btn-dashboard text="Delete" />
      </template>
    </dashboard-grid>
  </dashboard-pane>
</template>
  <script>
export default {
  name: "EmailListGrid",
  props: {
    loading: { type: Boolean, default: false },
    sending: { type: Boolean, default: false }
  },
  data() {
    return {
      action: "",
      selected: [],
      loadingAction: false
    }
  },
  computed: {
    title() {
      return `Email List - ${this.post.title}`
    },
    _id() {
      return this.$route.query._id || ""
    },
    post: {
      get() {
        return this.$store.val(this._id) || {}
      },
      set(v) {
        this.$store.add(this._id, v)
      }
    },
    postTypeMeta() {
      return this.$post.postTypeMeta(this.postType)
    },

    tabs() {
      return [`all`, `verified`, `unverified`].map(key => {
        let count = 0
        if (this.post && this.post.list) {
          const total = this.post.list.length
          const verified = this.post.list.filter(_ => _.verified).length

          if (key == "all") {
            count = total
          } else if (key == "verified") {
            count = verified
          } else if (key == "unverified") {
            count = total - verified
          }
        }

        return {
          name: this.$utils.toLabel(key),
          value: key == "all" ? "" : key,
          count
        }
      })
    },
    controlActions() {
      return [
        { value: "export-all", name: "Export List to CSV" },
        { value: "export-selected", name: "Export Selected to CSV" },
        { value: "delete", name: "Permanently Delete" }
      ].filter(_ => {
        return _.value != this.$route.query.status
      })
    }
  },

  methods: {
    selectAll(val) {
      this.selected = !val ? [] : this.post.list.map(_ => _.email)
    },

    grid() {
      return [
        {
          _id: "select",
          width: "40px"
        },

        {
          name: "Email",
          _id: "email",
          width: "minmax(240px, 1fr)"
        },
        {
          _id: "verified",
          name: "Verified?",
          width: "80px"
        },
        {
          _id: "delete",
          name: "Delete?",
          width: "100px"
        }
      ]
    }
  }
}
</script>
<style lang="less">
</style>