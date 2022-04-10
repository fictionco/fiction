<template>
  <dashboard-page :loading="loading" :title="$route.name">
    <template #actions />
    <dashboard-panel class="compose">
      <router-view />
    </dashboard-panel>
  </dashboard-page>
</template>
<script lang="ts">
import { userInitialized, stored, onEvent } from "@factor/api"
import { dashboardPage, dashboardPanel } from "@factor/ui"
import { requestCustomerComposite } from "../stripe-client"
export default {
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
    this.setCustomerData()
    onEvent("refresh-user", () => this.setCustomerData())
  },
  methods: {
    async setCustomerData(this: any) {
      const user = await userInitialized()
      this.loading = true
      if (user?.stripeCustomerId) {
        await requestCustomerComposite(user?.stripeCustomerId)
      }

      this.loading = false
    },
  },
}
</script>
<style lang="less" scoped>
</style>
