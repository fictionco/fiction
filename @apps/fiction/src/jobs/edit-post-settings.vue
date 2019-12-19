<template>
  <div class="edit-job-templates">
    <dashboard-input v-model="post.jobLocation" input="factor-input-text" label="Location" />
    <dashboard-input
      v-model="post.jobApplyEmail"
      input="factor-input-text"
      label="Application Email"
    />
  </div>
</template>
<script lang="ts">
import { dashboardInput } from "@factor/dashboard"
import { stored, storeItem } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { dashboardInput },
  props: {
    postId: { type: String, required: true }
  },
  data() {
    return {
      loading: false,
      template: "",
      settings: {},
      pageTemplateInfo: {}
    }
  },
  computed: {
    post: {
      get() {
        return stored(this.postId) || {}
      },
      set(v) {
        storeItem(this.postId, v)
      }
    }
  },
  watch: {},
  methods: {}
})
</script>
<style lang="less"></style>
