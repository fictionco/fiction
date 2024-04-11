<script lang="ts" setup>
import type { ListItem, NavItem } from '@fiction/core'
import { formatNumber, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElButton from '@fiction/ui/ElButton.vue'

export type UserConfig = {
  prices?: (NavItem & {
    badge?: string
    price?: number
    features?: ListItem[]
    isPrimary?: boolean
  })[]
  annualDiscountPercent?: number
}
const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})

const colClass = vue.computed(() => {
  const prices = uc.value.prices || []
  const num = prices.length

  if (num === 1)
    return 'lg:grid-cols-1 lg:max-w-xl'
  if (num === 2)
    return 'lg:grid-cols-2 lg:max-w-screen-lg mx-auto'
  if (num === 3 || num % 3 === 0)
    return 'lg:grid-cols-3 lg:max-w-none'
  if (num === 4 || num === 8 || num === 12)
    return 'lg:grid-cols-4 lg:max-w-none'
  if (num === 5 || num === 10)
    return 'lg:grid-cols-5 lg:max-w-none'

  // Fallback or default grid column class
  return 'lg:grid-cols-3 lg:max-w-none'
})
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <div class="flow-root bg-theme-50/40 dark:bg-theme-900/40 py-12 lg:py-24 px-6 lg:px-12 rounded-2xl">
      <div class="isolate -mt-16 sm:mx-auto lg:-mx-8 lg:mt-0 xl:-mx-4">
        <div :class="colClass" class="grid max-w-sm grid-cols-1 gap-y-16 divide-y divide-theme-100 dark:divide-theme-800  lg:divide-x lg:divide-y-0 ">
          <div v-for="(price, i) in uc.prices" :key="i" class="pt-16  lg:pt-0 ">
            <div class="lg:px-8 xl:px-14">
              <h3 class="text-base font-medium leading-7 text-theme-400 dark:text-theme-0 x-font-sans space-x-4 flex items-center">
                <span>{{ price.name }}</span>
                <span v-if="price.badge" class="inline-flex items-center rounded-full bg-amber-200 text-amber-800 dark:bg-amber-700/90 dark:text-theme-0 px-2 py-1 text-xs font-medium ">{{ price.badge || "Most Popular" }}</span>
              </h3>
              <p class="mt-6 flex items-baseline gap-x-1 x-font-title">
                <span class="text-6xl font-bold tracking-tight"><span class="align-super text-[.7em] dark:text-theme-200 mr-1">$</span>{{ formatNumber(price.price) }}</span>
                <span class="text-sm font-semibold leading-6 dark:text-theme-300">/month</span>
              </p>
              <p v-if="uc.annualDiscountPercent" class="mt-3 leading-6 text-theme-100 font-medium text-lg min-h-12">
                <span v-if="price.price">{{ formatNumber(price.price * (1 - (uc.annualDiscountPercent / 100)), 'dollar') }} per month if paid annually</span>
                <span v-else>Free Forever</span>
              </p>
              <div v-if="price.href" class="my-6">
                <ElButton format="block" size="lg" btn="primary" :href="price.href">
                  Get Started
                </ElButton>
              </div>
              <p class="mt-10 text-sm font-semibold leading-6 font-sans antialiased">
                {{ price.desc }}
              </p>
              <ul role="list" class="mt-6 space-y-3 text-lg leading-6 text-theme-100">
                <li v-for="(feature, ii) in price.features" :key="ii" class="flex gap-x-3 items-center">
                  <svg class="size-6 flex-none dark:text-theme-600 text-primary-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                  </svg>
                  <div class="font-semibold ">
                    {{ feature.name }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
