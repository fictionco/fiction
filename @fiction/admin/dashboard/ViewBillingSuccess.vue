<script lang="ts" setup>
import type { FictionStripe } from '@fiction/plugin-stripe'
import type { Card } from '@fiction/site/card'
import type { NavCardUserConfig } from '../index.js'
import { useService, vue } from '@fiction/core'
import ElZeroBanner from '@fiction/ui/ElZeroBanner.vue'
import ElPanelSettings from './ElPanelSettings.vue'

defineProps({
  card: { type: Object as vue.PropType<Card<NavCardUserConfig>>, required: true },
})

const { fictionStripe } = useService<{ fictionStripe?: FictionStripe }>()

const loading = vue.ref(true)

vue.onMounted(async () => {
  await fictionStripe?.customerState.refresh()
  loading.value = false
})

const proStatus = vue.computed(() => fictionStripe?.customerState.data.value)
</script>

<template>
  <ElPanelSettings v-if="!loading">
    <ElZeroBanner
      sub-title="Welcome to Premium"
      title="Success!"
      :description="`You're on the '${proStatus?.plan}' tier.`"
      :action="{
        buttons: [
          {
            label: 'View Dashboard',
            href: card.link('/'),
            theme: 'primary',
          },
        ],
      }"
    />
  </ElPanelSettings>
</template>
