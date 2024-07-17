<script lang="ts" setup>
import { formatNumber, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElButton from '@fiction/ui/ElButton.vue'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim/index.js'
import CardText from '../CardText.vue'
import type { UserConfig, UserConfigPrice } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const prices = vue.computed(() => uc.value.prices || [])

function cls(price: UserConfigPrice) {
  if (price.isHighlighted) {
    return {
      col: 'bg-primary-600 text-theme-0 dark:bg-primary-600/70 dark:text-theme-0',
      btn: 'bg-primary-300 text-primary-0 dark:bg-primary-200 dark:text-primary-800',
      badge: 'bg-primary-500 text-primary-0',
    }
  }
  else {
    return {
      col: 'bg-theme-100/60 dark:bg-theme-800',
      btn: 'bg-primary-500 text-theme-0 dark:bg-theme-600',
      badge: 'bg-primary-100 text-primary-600 dark:bg-theme-600 dark:text-primary-50',
    }
  }
}

vue.onMounted(() => {
  useElementVisible({
    selector: `#${props.card.cardId}`,
    onVisible: async () => {
      await animateItemEnter({ targets: `#${props.card.cardId} .x-action-item`, themeId: 'rise', config: { overallDelay: 500 } })
    },
  })
})

const priceDuration = vue.ref<'year' | 'month'>('month')

function getLink(price: UserConfigPrice) {
  if (priceDuration.value === 'year' && price.hrefAnnual) {
    return price.hrefAnnual
  }
  return price.href
}

function getPrice(price?: UserConfigPrice) {
  if (!price?.price) {
    return 0
  }

  if (priceDuration.value === 'year' && uc.value.annualDiscountPercent) {
    return formatNumber(Math.ceil(price.price * 12 * (1 - uc.value.annualDiscountPercent / 100)))
  }
  else {
    return formatNumber(price.price)
  }
}
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <div v-if="uc.hasAnnual" class="flex justify-center mb-8">
      <div class="relative grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-sans font-semibold leading-5 ring-1 ring-inset ring-theme-300 dark:ring-theme-600">
        <label :class="priceDuration === 'month' ? 'text-theme-0' : 'text-theme-500 dark:text-theme-200'" class="z-10 relative cursor-pointer rounded-full px-4 py-0.5 transition-all" @click="priceDuration = 'month'">
          <span>Monthly</span>
        </label>
        <label :class="priceDuration === 'year' ? ' text-theme-0' : 'text-theme-500 dark:text-theme-200'" class="z-10 relative cursor-pointer rounded-full px-4 py-0.5 transition-all" @click="priceDuration = 'year'">
          <span>Annually</span>
        </label>
        <div class="bg-theme-500 text-theme-0 rounded-full marker w-50 absolute h-full w-[50%] transition-all ease-[cubic-bezier(0.25,1,0.33,1)] duration-500" :class="priceDuration === 'month' ? 'left-0' : 'left-1/2'" />
      </div>
    </div>
    <div class="grid grid-cols-1 gap-6" :class="prices.length > 2 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'">
      <div v-for="(price, i) in uc.prices" :key="i" class="rounded-xl x-action-item" :class="cls(price).col">
        <div class="px-6 py-8 lg:px-8">
          <div class="flex justify-between">
            <div class="space-x-4 flex items-center">
              <CardText :card tag="h3" :path="`prices.${i}.name`" class="text-3xl font-normal  x-font-title" />
              <CardText :card tag="span" :path="`prices.${i}.badge`" :class="cls(price).badge" class="font-sans inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium " />
            </div>
            <div class="text-4xl" :class="price.icon" />
          </div>
          <p class="mt-6 flex items-baseline gap-x-1 x-font-title">
            <span class="text-7xl font-semibold x-font-title">
              <span v-if="!getPrice(price)">Free</span>
              <span v-else>
                <span class="align-super text-[.5em] mr-1 font-normal">$</span>
                <span>{{ getPrice(price) }}</span>
              </span>
            </span>
            <span v-if="price.price" class="text-base font-normal font-sans flex gap-0.5 items-center">
              <span class="i-tabler-slash" />
              <span>{{ priceDuration }}</span>
            </span>
          </p>

          <div v-if="getLink(price)" class="my-6">
            <ElButton
              format="block"
              size="xl"
              btn="naked"
              :href="getLink(price)"
              class="hover:opacity-80 transition-opacity duration-300 shadow-sm"
              :class="cls(price).btn"
            >
              <CardText :card tag="span" :path="`prices.${i}.buttonText`" fallback="Get Started" />
            </ElButton>
          </div>
          <div class="text-xl font-medium  ">
            <CardText :card tag="p" :path="`prices.${i}.desc`" class="mt-10 font-semibold" />

            <ul role="list" class="mt-6 space-y-3">
              <li v-for="(feature, ii) in price.features" :key="ii" class="flex gap-x-3 items-center">
                <div class="i-tabler-check" />
                <CardText :card tag="div" :path="`prices.${i}.features.${ii}.name`" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
