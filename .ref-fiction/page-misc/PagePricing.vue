<script lang="ts" setup>
import { useMeta } from '@factor/api'
import ElPricing from '@fiction/core/plugin-payment/ElPricing.vue'
import EffectGrid from '@factor/ui/EffectGrid.vue'
import PageWrap2 from '../el/PageWrap2.vue'

useMeta({
  title: 'Plans and Pricing - Fiction',
  meta: [
    {
      name: `description`,
      content: `Fiction offers plans at every price point. Pro and business plans include better performance and more features.`,
    },
  ],
})
</script>

<template>
  <PageWrap2>
    <ElPricing
      sup="Plans and Pricing"
      title="Simple Usage Based Pricing"
    />
    <div class="pointer-events-none fixed top-0 h-screen w-screen">
      <EffectGrid alt-color="bg-pink-500" mode="light" />
    </div>
  </PageWrap2>
</template>
