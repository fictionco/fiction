<script lang="ts" setup>
import type { FactorRouter, FactorUser } from '@factor/api'
import { useService, vue } from '@factor/api'
import ElZeroBanner from '@factor/ui/ElZeroBanner.vue'
import ElPanel from '@factor/ui/ElPanel.vue'
import type { FactorStripe } from '@factor/plugin-stripe'
import AdminPage from './AdminPage.vue'

const { factorRouter, factorStripe } = useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
  factorStripe: FactorStripe
}>()

const loading = vue.ref(true)

vue.onMounted(async () => {
  await factorStripe.setCustomerData()
  loading.value = false
})

const proStatus = vue.computed(() => {
  return factorStripe.activeCustomer.value
})
</script>

<template>
  <AdminPage title="Success" :loading="loading">
    <ElPanel>
      <ElZeroBanner
        sub-title="Welcome to Premium"
        title="Success!"
        :description="`You're currently on the '${proStatus?.planName}' tier.`"
        :actions="[
          {
            name: 'View Dashboard',
            href: factorRouter.link('orgHome', {}).value,
            btn: 'primary',
          },
        ]"
        :bullets="[
          {
            name: `Upgraded`,
            desc: `We've enabled professional grade features, limits and processing. Thanks for your support.`,
          },
          {
            name: `Guaranteed`,
            desc: `We guarantee satisfaction with your PageLines product and service. If you have issues, let us know.`,
          },
          {
            name: `Exclusive`,
            desc: `With your upgrade, you've been invited to join our exclusive community of AI and web professionals.`,
          },
        ]"
      />
    </ElPanel>
  </AdminPage>
</template>
