<script setup lang="ts">
import type { Card } from '@fiction/site'
import type { PricingPlan, UserConfig } from './config'
import { formatNumber, vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import XIcon from '@fiction/ui/media/XIcon.vue'
import CardButton from '../CardButton.vue'
import CardText from '../CardText.vue'
import CardButtons from '../el/CardButtons.vue'

const props = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => props.card.userConfig.value)
const priceDuration = vue.ref<'month' | 'year'>('month')

// Styling helpers
function getVariantClasses(plan: PricingPlan) {
  const base = {
    card: 'relative flex flex-col overflow-hidden rounded-3xl',
    highlight: '',
    badge: '',
    button: '',
    pricing: '',
  }

  if (uc.value.layout === 'minimal') {
    switch (plan.variant) {
      case 'highlighted':
        return {
          card: `${base.card} border-2 border-primary-500 bg-theme-50 dark:bg-theme-900/50`,
          highlight: 'text-primary-600 dark:text-primary-400',
          pricing: 'text-primary-700 dark:text-primary-300',
        }
      default:
        return {
          card: `${base.card} border-2 border-theme-200 dark:border-theme-700`,
          highlight: 'text-theme-700 dark:text-theme-300',
          pricing: 'text-theme-700 dark:text-theme-300',
        }
    }
  }
  else if (uc.value.layout === 'cards') {
    switch (plan.variant) {
      case 'highlighted':
        return {
          card: `${base.card} bg-primary-500 dark:bg-primary-900 text-white`,
          highlight: 'text-white',
          pricing: 'text-white',
        }
      default:
        return {
          card: `${base.card} bg-theme-100 dark:bg-theme-800`,
          highlight: 'text-theme-900 dark:text-theme-100',
          pricing: 'text-theme-900 dark:text-theme-100',
        }
    }
  }

  // Default style (original)
  switch (plan.variant) {
    case 'highlighted':
      return {
        card: `${base.card} ring-2 ring-primary-500 translate-y-0 hover:-translate-y-2 shadow-xl`,
        highlight: 'text-primary-500 dark:text-primary-50',
      }
    case 'muted':
      return {
        card: `${base.card} bg-theme-50/50 dark:bg-theme-900/50 ring-2 ring-theme-200/30 dark:ring-theme-700/30`,
        highlight: 'text-theme-600 dark:text-theme-300',
      }
    default:
      return {
        card: `${base.card} ring-2 ring-theme-300/70 dark:ring-theme-600/70 hover:-translate-y-1`,
        highlight: 'text-theme-500 dark:text-theme-50',
      }
  }
}

// Price calculation with annual discount
function getPrice(plan: PricingPlan) {
  if (!plan.price)
    return 'Free'

  const basePrice = plan.price
  if (priceDuration.value === 'year' && uc.value.annualDiscountPercent) {
    const discount = 1 - (uc.value.annualDiscountPercent / 100)
    return formatNumber(Math.ceil(basePrice * discount))
  }
  return formatNumber(basePrice)
}

function getPricingLink(plan: PricingPlan): string {
  return priceDuration.value === 'year' && plan.button?.hrefAnnual ? plan.button?.hrefAnnual : plan.button?.href || '#'
}

function getContainerPadding() {
  switch (uc.value.layout) {
    case 'minimal':
      return 'px-4 py-6'
    case 'cards':
      return 'p-8'
    default:
      return 'p-8'
  }
}

function getFeatureClasses(plan: PricingPlan) {
  if (uc.value.layout === 'cards') {
    return plan.variant === 'highlighted'
      ? 'text-white/90'
      : 'text-theme-700 dark:text-theme-300'
  }
  return ''
}

const isVisible = vue.ref(false)

// Animation handling
vue.onMounted(() => {
  useElementVisible({
    caller: 'pricing',
    selector: `#${props.card.cardId}`,
    onVisible: async () => {
      isVisible.value = true
      await animateItemEnter({
        targets: `#${props.card.cardId} .animate-item`,
        themeId: 'slide',
        config: { overallDelay: 150 },
      })
    },
  })
})

// Style variants
const containerClass = vue.computed(() => {
  const layouts = {
    minimal: 'grid gap-6 mx-auto',
    cards: 'grid gap-8 mx-auto',
    standard: 'grid gap-8 mx-auto',
  }

  const columnClass = uc.value.prices && uc.value.prices?.length <= 2 ? 'lg:grid-cols-2 lg:max-w-screen-lg' : 'lg:grid-cols-3'

  return `${layouts[uc.value.layout || 'standard']} ${columnClass}`
})
</script>

<template>
  <div :class="card.classes.value.contentWidth" :show="isVisible">
    <!-- Annual Toggle -->
    <div v-if="uc.hasAnnual" class="flex flex-col items-center gap-4 mb-12 animate-item" :class="isVisible ? 'opacity-100' : 'opacity-0'">
      <div v-if="uc.hasAnnual" class="flex justify-center">
        <div class="relative grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-sans font-semibold leading-5 ring-1 ring-inset ring-theme-300 dark:ring-theme-600">
          <label :class="priceDuration === 'month' ? 'text-theme-0' : 'text-theme-500 dark:text-theme-200'" class="z-10 relative cursor-pointer rounded-full px-4 py-0.5 transition-all" @click="priceDuration = 'month'">
            <span>Monthly</span>
          </label>
          <label :class="priceDuration === 'year' ? ' text-theme-0' : 'text-theme-500 dark:text-theme-200'" class="z-10 relative cursor-pointer rounded-full px-4 py-0.5 transition-all" @click="priceDuration = 'year'">
            <span>Annually</span>
          </label>
          <div class="bg-primary-500 dark:bg-primary-800/50 ring-1 ring-inset ring-primary-600 dark:ring-primary-500/50 text-primary-0 rounded-full marker w-50 absolute h-full w-[50%] transition-all ease-[cubic-bezier(0.25,1,0.33,1)] duration-500" :class="priceDuration === 'month' ? 'left-0' : 'left-1/2'" />
        </div>
        <div class="relative">
          <div v-if="uc.annualDiscountPercent" class="x-font-highlight absolute left-full -top-12 w-56 flex items-center bottom-full -rotate-12">
            <div class="i-tabler-arrow-down-left" /><div>Pay {{ uc.annualDiscountPercent }}% Less</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pricing Cards Grid -->
    <div :class="containerClass">
      <div
        v-for="(plan, i) in uc.prices"
        :key="i"
        class="animate-item transition-all duration-500"
        :class="[getVariantClasses(plan).card, isVisible ? 'opacity-100' : 'opacity-0']"
      >
        <div :class="getContainerPadding()" class="flex flex-col h-full">
          <!-- Plan Header -->
          <div class="flex justify-between items-start mb-8">
            <div class="flex gap-3 items-center">
              <CardText
                :card
                tag="h3"
                :path="`prices.${i}.title`"
                class="text-2xl font-semibold x-font-title"
                :class="getVariantClasses(plan).highlight"
              />
              <CardButton
                v-if="plan.badge"
                :card
                tag="span"
                :path="`prices.${i}.badge`"
                size="xs"
                :theme="uc.layout === 'cards' && plan.variant === 'highlighted' ? 'white' : 'primary'"
                :design="uc.layout === 'cards' ? 'solid' : 'outline'"
              >
                {{ plan.badge }}
              </CardButton>
            </div>
            <XIcon
              v-if="plan.icon"
              :media="plan.icon"
              class="size-10"
              :class="getVariantClasses(plan).highlight"
            />
          </div>

          <!-- Pricing -->
          <div class="mb-8">
            <div class="flex items-baseline gap-x-1">
              <span
                class="text-5xl font-bold x-font-title tracking-tight"
                :class="getVariantClasses(plan).pricing"
              >
                <span v-if="plan.price" class="text-2xl align-top font-medium -mr-0.5">$</span>
                {{ getPrice(plan) }}
              </span>
              <span
                v-if="plan.price"
                :class="uc.layout === 'cards' && plan.variant === 'highlighted' ? 'text-white/70' : 'text-theme-600/70 dark:text-theme-400/70'"
                class="text-base font-sans"
              >/ mo</span>
            </div>
            <CardText
              :card
              tag="p"
              :path="`prices.${i}.description`"
              class="mt-3 text-lg"
              :class="[
                uc.layout === 'cards' && plan.variant === 'highlighted'
                  ? 'text-white/80'
                  : 'text-theme-500 dark:text-theme-400',
              ]"
            />
          </div>

          <!-- Features List -->
          <div class="space-y-4 grow">
            <div
              v-for="(feature, fi) in plan.features"
              :key="fi"
              class="flex gap-3 text-base font-sans items-center"
              :class="getFeatureClasses(plan)"
            >
              <XIcon
                class=" shrink-0 size-5 text-primary-500"
                :media="{ class: 'i-tabler-check' }"
                :class="uc.layout === 'cards' && plan.variant === 'highlighted' ? 'text-white' : ''"
              />
              <CardText
                :card
                tag="span"
                :path="`prices.${i}.features.${fi}.label`"
              />
            </div>
          </div>

          <!-- CTA Button -->
          <div class="mt-8">
            <CardButtons
              :card
              :buttons="[{
                icon: plan.button?.icon,
                href: getPricingLink(plan),
                label: plan.button?.label || 'Start',
                format: 'block',
                theme: uc.layout === 'cards' && plan.variant === 'highlighted' ? 'white' : 'primary',
                design: plan.variant === 'highlighted' ? 'solid' : 'outline',
              }]"
              ui-size="xl"
              format="block"
              design="solid"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
