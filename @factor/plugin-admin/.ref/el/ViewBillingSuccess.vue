<script lang="ts" setup>
import { useService, vue } from '@factor/api'
import ElZeroBanner from '@factor/ui/ElZeroBanner.vue'
import type { FactorStripe } from '@factor/plugin-stripe'
import ElPanelSettings from './ElPanelSettings.vue'

const { factorRouter, factorStripe } = useService<{ factorStripe?: FactorStripe }>()

const loading = vue.ref(true)

vue.onMounted(async () => {
  await factorStripe?.setCustomerData()
  loading.value = false
})

const proStatus = vue.computed(() => factorStripe?.activeCustomer.value)
</script>

<template>
  <ElPanelSettings v-if="!loading">
    <ElZeroBanner
      sub-title="Welcome to Premium"
      title="Success!"
      :description="`You're on the '${proStatus?.planName}' tier.`"
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
          desc: `We've enabled professional grade features and services.`,
        },
        {
          name: `Guaranteed`,
          desc: `We guarantee satisfaction. If you have issues, let us know.`,
        },
        {
          name: `Community`,
          desc: `With your upgrade, you've been invited to join the community.`,
        },
      ]"
    />
  </ElPanelSettings>
</template>
