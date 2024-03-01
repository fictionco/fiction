<script lang="ts">
import { onEvent, stored, userInitialized } from '@factor/api'
import { dashboardPage, dashboardPanel } from '@factor/ui'
import { requestCustomerComposite } from '../stripe-client'

export default {
  name: 'SubscriptionWrap',
  components: { DashboardPage: dashboardPage, DashboardPanel: dashboardPanel },
  data() {
    return {
      title: 'Subscription',
      sending: false,
      loading: true,
    }
  },
  computed: {
    composite() {
      return stored('customerComposite') || {}
    },
  },
  async mounted(this: any) {
    this.setCustomerData()
    onEvent('refresh-user', () => this.setCustomerData())
  },
  methods: {
    async setCustomerData(this: any) {
      const user = await userInitialized()
      this.loading = true
      if (user?.stripeCustomerId)
        await requestCustomerComposite(user?.stripeCustomerId)

      this.loading = false
    },
  },
}
</script>

<template>
  <DashboardPage :loading="loading" :title="$route.name">
    <template #actions />
    <DashboardPanel class="compose">
      <router-view />
    </DashboardPanel>
  </DashboardPage>
</template>

<style lang="less" scoped>
</style>
