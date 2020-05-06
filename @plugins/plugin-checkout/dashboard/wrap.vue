<template>
  <dashboard-page :loading="loading" :title="$route.name">
    <template #actions>
      <factor-link btn="default" path="/">View</factor-link>
      <dashboard-btn btn="primary" :loading="sending" @click="savePost()">Update</dashboard-btn>
    </template>
    <dashboard-panel class="compose">
      <router-view />
    </dashboard-panel>
  </dashboard-page>
</template>
<script lang="ts">
import Vue from "vue"
import { dashboardPage, dashboardPanel, dashboardBtn, factorLink } from "@factor/ui"
export default Vue.extend({
  name: "Subscription",
  components: { dashboardPage, dashboardPanel, dashboardBtn, factorLink },
  data() {
    return {
      title: "Subscription",
      sending: false,
      loading: false,
    }
  },
})
</script>
<style lang="less" scoped>
</style>
