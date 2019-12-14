<template>
  <div class="edit-page-templates">
    <dashboard-input
      v-model="post.template"
      :list="getPageTemplates()"
      input="factor-input-select"
      label="Page Template"
    />
  </div>
</template>
<script lang="ts">
import { dashboardInput } from "@factor/dashboard"
import { getPageTemplates } from "@factor/templates"
import { stored, storeItem } from "@factor/api"
import Vue from "vue"
import { FactorPost } from "@factor/post/types"
export default Vue.extend({
  components: { dashboardInput },

  props: {
    postId: { type: String, required: true }
  },
  data() {
    return {}
  },
  computed: {
    post: {
      get(this: any): FactorPost {
        return stored(this.postId) || {}
      },
      set(this: any, v: FactorPost): void {
        storeItem(this.postId, v)
      }
    }
  },
  watch: {},
  methods: {
    getPageTemplates
  }
})
</script>

