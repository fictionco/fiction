<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import ElZeroBanner from '@fiction/ui/ElZeroBanner.vue'
import type { FictionStripe } from '@fiction/plugin-stripe'
import type { Card } from '@fiction/site/card'
import ElPanelSettings from './ElPanelSettings.vue'
import type { NavCardUserConfig } from '../index.js'

defineProps({
  card: { type: Object as vue.PropType<Card<NavCardUserConfig>>, required: true },
})

const { fictionStripe } = useService<{ fictionStripe?: FictionStripe }>()

const loading = vue.ref(true)

vue.onMounted(async () => {
  await fictionStripe?.setCustomerData()
  loading.value = false
})

const proStatus = vue.computed(() => fictionStripe?.activeCustomer.value)
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
