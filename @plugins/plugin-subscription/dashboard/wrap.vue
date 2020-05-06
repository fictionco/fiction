<template>
  <dashboard-page :loading="loading" :title="$route.name">
    <template #actions />
    <dashboard-panel class="compose">
      <router-view />
    </dashboard-panel>
  </dashboard-page>
</template>
<script lang="ts">
import Vue from "vue"
import { userInitialized, stored } from "@factor/api"
import { dashboardPage, dashboardPanel } from "@factor/ui"
import { requestCustomerComposite } from "../stripe-client"
export default Vue.extend({
  name: "SubscriptionWrap",
  components: { dashboardPage, dashboardPanel },
  data() {
    return {
      title: "Subscription",
      sending: false,
      loading: true,
    }
  },
  computed: {
    composite() {
      return stored("customerComposite") || {}
    },
  },
  async mounted(this: any) {
    const user = await userInitialized()

    if (user?.stripeCustomerId) {
      await requestCustomerComposite(user?.stripeCustomerId)
    }

    this.loading = false
  },
})
</script>
<style lang="less" scoped>
</style>
