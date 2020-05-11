<template>
  <div class="edit-job-templates">
    <dashboard-input v-model="post.jobLocation" input="factor-input-text" label="Job Location" />
    <dashboard-input
      v-model="post.jobType"
      input="factor-input-text"
      label="Job Type"
      description="e.g. Freelance, Full Time, Internship, Part Time, Temporary"
    />
    <dashboard-input v-model="post.jobApplyEmail" input="factor-input-text" label="Apply Email" />
    <dashboard-input v-model="post.jobCompanyName" input="factor-input-text" label="Company Name" />
    <dashboard-input
      v-model="post.jobCompanyWebsite"
      input="factor-input-text"
      label="Company Website"
    />
  </div>
</template>
<script lang="ts">
import { dashboardInput } from "@factor/ui"
import { stored, storeItem } from "@factor/api"

import { FactorPost } from "@factor/post/types"

export default {
  components: { dashboardInput },
  props: {
    postId: { type: String, required: true },
  },
  data() {
    return {
      loading: false,
      template: "",
      settings: {},
      pageTemplateInfo: {},
    }
  },
  computed: {
    post: {
      get(this: any): FactorPost {
        return stored(this.postId) || {}
      },
      set(this: any, v: FactorPost): void {
        storeItem(this.postId, v)
      },
    },
  },
  watch: {},
  methods: {},
}
</script>
<style lang="less"></style>
