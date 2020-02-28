<template>
  <dashboard-pane :title="title">
    <factor-modal :vis.sync="vis" class="form-view-modal">
      <div class="form-info">
        <h2>Form Submission</h2>
        <div class="fields">
          <div
            v-for="({label, value}, index) in postItemAdditional(selectedPost)"
            :key="index"
            class="field"
          >
            <label>{{ label }}</label>
            <div class="val">{{ value }}</div>
          </div>
        </div>
      </div>
    </factor-modal>
    <dashboard-list-controls
      :control-actions="controlActions()"
      :control-status="controlStatus()"
      :selected="selected"
      :loading="loading"
      :list="list"
      @action="handleAction($event)"
      @select-all="selectAll($event)"
    />

    <dashboard-list-post
      v-for="post in list"
      :key="post._id"
      v-model="selected"
      :post="post"
      :title="formFields(post).message"
      sub-title="Form Submission"
      :meta="postItemMeta(post)"
      :additional="postItemAdditional(post)"
      :toggle="{ show: `Show Form Data`, hide: `Hide Form Data` }"
      :click-event="() => showModal(post)"
    />
  </dashboard-pane>
</template>
<script lang="ts">
import { getStatusCount } from "@factor/post/util"
import { emitEvent, toLabel, standardDate } from "@factor/api"
import { FactorPost } from "@factor/post/types"
import { ControlAction, PostListDataItem } from "@factor/dashboard/types"
import { requestPostSaveMany, requestPostDeleteMany } from "@factor/post/request"
import {
  dashboardPane,
  dashboardListPost,
  dashboardListControls
} from "@factor/dashboard"
import { factorModal } from "@factor/ui"
import Vue from "vue"
import { ContactFormStandard } from "./types"

export default Vue.extend({
  name: "ContactFormList",
  components: {
    dashboardListPost,
    dashboardPane,
    dashboardListControls,
    factorModal
  },
  props: {
    postType: { type: String, default: "post" },
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
      loadingAction: false,
      vis: false,
      selectedPost: {}
    }
  },
  computed: {},

  methods: {
    showModal(this: any, post: FactorPost) {
      this.selectedPost = post
      this.vis = true
    },
    toLabel,
    standardDate,
    formFields(this: any, post: FactorPost) {
      return post && post.settings ? post.settings : {}
    },
    controlStatus(this: any): ControlAction[] {
      const countTrash = getStatusCount({ meta: this.meta, key: "trash" })
      return [
        { value: "", label: `All (${this.meta.totalForQuery ?? 0})` },
        { value: "trash", label: `Trash (${countTrash})` }
      ]
    },
    postItemMeta(post: FactorPost) {
      const formFields: ContactFormStandard = this.formFields(post)

      return [
        {
          label: "From",
          value: formFields.name
        },
        {
          label: "Email",
          value: formFields.email
        }
      ]
    },
    controlActions(): ControlAction[] {
      const actions = [
        {
          value: "trash",
          label: "Move to Inactive/Trash",
          condition: (query: { [key: string]: string }) => query.status != "trash",
          confirm: (selected: string[]) =>
            `Move ${selected.length} submission(s) to trash?`
        },
        {
          value: "publish",
          label: "Move to Active",
          condition: (query: { [key: string]: string }) => query.status == "trash"
        },
        {
          value: "delete",
          label: "Permanently Delete",
          condition: (query: { [key: string]: string }) => query.status == "trash",
          confirm: (selected: string[]) =>
            `Permanently delete ${selected.length} submission(s)?`
        }
      ]

      return actions
    },
    postItemAdditional(this: any, post: FactorPost): PostListDataItem[] {
      const formFields: { [key: string]: string } = this.formFields(post)
      const entries = Object.entries(formFields)
      const moreFields = entries.map(([key, value]) => {
        return { label: toLabel(key), value }
      })

      return [...moreFields, { label: "Created", value: standardDate(post.createdAt) }]
    },
    selectAll(this: any, val: boolean): void {
      this.selected = !val ? [] : this.list.map((_: FactorPost) => _._id)
    },
    async handleAction(this: any, action: string) {
      this.loadingAction = true

      if (this.selected.length > 0) {
        if (action == "delete") {
          await requestPostDeleteMany({ _ids: this.selected, postType: this.postType })
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
    }
    // fields(row) {
    //   const rest = omit(row, ["message", "createdAt", "_id"])

    //   return Object.values(rest)
    // }
  }
})
</script>
<style lang="less">
.form-view-modal .form-info {
  text-align: left;
  h2 {
    font-size: 1.6em;
    font-weight: 700;
    opacity: 0.2;
    margin-bottom: 2em;
  }
  .field {
    margin: 1em 0;
  }
  label {
    font-weight: 700;
  }
}
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
