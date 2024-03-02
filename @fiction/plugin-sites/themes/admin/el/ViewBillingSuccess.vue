<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import ElZeroBanner from '@fiction/ui/ElZeroBanner.vue'
import type { FactorStripe } from '@fiction/plugin-stripe'
import type { Card } from '../../../card'
import ElPanelSettings from './ElPanelSettings.vue'

type UserConfig = { isNavItem?: boolean, icon?: string, parentItemId?: string }
defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const { factorStripe } = useService<{ factorStripe?: FactorStripe }>()

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
          href: card.link('/'),
          btn: 'primary',
        },
      ]"
      :bullets="[
        {
          name: `Pro Features`,
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
