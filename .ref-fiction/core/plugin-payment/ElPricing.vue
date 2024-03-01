<script lang="ts" setup>
import { formatNumber, log, vue } from '@factor/api'
import InputRange from '@factor/ui/InputRange.vue'
import ElButton from '@factor/ui/ElButton.vue'
import ContentBox from '../ui/ContentBox.vue'
import { getDashboardUrl, useFictionApp } from '../util'
import { pricing } from '../stripe'
import PricingFaq from './PricingFaq.vue'

defineProps({
  title: { type: String, required: true },
  sup: { type: String, default: undefined },
  subTitle: { type: String, default: undefined },
})
const { factorStripe, fictionPayment } = useFictionApp()
const duration = vue.ref<'month' | 'year'>('month')

const sendingToStripe = vue.ref<string>()

const standardSlider = vue.ref(0)
const proSlider = vue.ref(0)
const plusSlider = vue.ref(0)

type PricingGroup = 'standard' | 'pro' | 'developer' | 'hobby'
function getPriceDisplay(key: PricingGroup) {
  return vue.computed(() => {
    const prices = pricing.filter(_ => _.group === key)

    let price
    if (prices.length > 1) {
      let slideVal
      if (key === 'standard')
        slideVal = standardSlider.value
      else if (key === 'developer')
        slideVal = plusSlider.value
      else
        slideVal = proSlider.value

      const numPrices = prices.length - 1 || 0

      // divide 100 vy number of prices and get closes match to slider value
      const priceIndex = Math.min(
        Math.round((slideVal * numPrices) / 100),
        numPrices,
      )

      price = prices[priceIndex]

      if (!price) {
        log.error('Pricing', 'Price not found', {
          data: { priceIndex, price, slideVal, numPrices, prices },
        })
      }
    }
    else {
      price = prices[0]
    }

    const quantity = price?.quantity || 0
    return {
      cost: price?.cost,
      per: duration.value,
      unit: '$',
      quantity: price?.quantity,
      minutes: quantity * 0.06,
      credits: quantity,
    }
  })
}

const standard = vue.computed(() => getPriceDisplay('standard').value)
const pro = vue.computed(() => getPriceDisplay('pro').value)
const plus = vue.computed(() => getPriceDisplay('developer').value)

function getPriceFromCost(cost?: number) {
  const price = pricing.find(_ => _.cost === cost)

  if (!price || !cost)
    return pricing[0]

  return price
}

async function getCheckoutUrl(key: PricingGroup) {
  console.warn('getting checkout url')

  let cost
  if (key === 'standard')
    cost = standard.value.cost
  else if (key === 'developer')
    cost = plus.value.cost
  else if (key === 'pro')
    cost = pro.value.cost
  else
    cost = 10

  const customerId = fictionPayment.activeCustomer.value?.customerId

  if (!customerId)
    return getDashboardUrl({ path: '/register' })

  const { priceId } = getPriceFromCost(cost) || {}

  console.warn('ElPricing', 'getting checkout url', {
    data: { customerId, priceId, cost },
  })

  if (!customerId || !priceId) {
    log.error('ElPricing', 'no price or customerId', {
      data: { customerId, priceId, cost },
    })
  }

  const result = customerId
    ? await factorStripe.getCheckoutUrl({ priceId })
    : '#'

  console.warn('test', 'url result', { data: { result, key } })

  // loading spinner
  sendingToStripe.value = key

  return result
}

const options = vue.ref([
  {
    key: 'std',
    columnClasses:
      'mx-auto max-w-md lg:col-span-4 lg:row-start-2 lg:row-end-3 lg:mx-0 lg:max-w-none',
    ringClasses: ' ',
    icon: 'i-carbon-badge',
    title: 'Standard',
    description:
      'Subscribe now and lock in your early bird price. Pro is ideal for individuals working with AI. Save 50% when paying yearly.',
    slider: standardSlider,
    pricing: standard,
    bestFor:
      'Best <span class=\'italic font-serif lowercase mx-1\'>for</span> Individuals',
    features: [
      '<span class=\'text-theme-800 font-bold\'>A Dedicated AI server</span>...',
      'Unlimited Generations and Models',
      'Advanced AI Editing Tools',
      '5 Team Members',
    ],
    actionText: 'Start Free Trial',

    onClick: async () => {
      const url = await getCheckoutUrl('standard')
      console.warn('redirect to checkout', url)
      location.href = url
    },
  },
  {
    key: 'pro',
    mainColumn: true,
    columnClasses:
      'mx-auto max-w-md lg:col-span-4 lg:row-start-2 lg:row-end-3 lg:mx-0 lg:max-w-none',
    ringClasses: '',
    icon: 'i-carbon-group-access',
    title: 'Pro',
    description:
      'Subscribe now and lock in your early bird price. Unlimited team members, business features. Save 50% when paying yearly.',
    slider: proSlider,
    pricing: pro,
    bestFor:
      'Best <span class=\'italic font-serif lowercase mx-1\'>for</span> Professionals',
    features: [
      '<span class=\'text-theme-800 font-bold\'>Everything in standard plus</span>...',
      'Enhanced GPUs and Storage',
      'Additional Pro AI Tools',
      'Unlimited Team Members',
    ],
    actionText: 'Start Free Trial',

    onClick: async () => {
      const url = await getCheckoutUrl('pro')
      console.warn('redirect to checkout', url)
      location.href = url
    },
  },
  {
    key: 'developer',
    mainColumn: false,
    columnClasses:
      'mx-auto max-w-md lg:col-span-4 lg:row-start-2 lg:row-end-3 lg:mx-0 lg:max-w-none',
    ringClasses: '',
    icon: 'i-carbon-group-access',
    title: 'Developer',
    description:
      'Subscribe now and lock in your early bird price. Unlimited team members, business features. Save 50% when paying yearly.',
    slider: plusSlider,
    pricing: plus,
    bestFor:
      'Best <span class=\'italic font-serif lowercase mx-1\'>for</span> Professionals',
    features: [
      '<span class=\'text-theme-800 font-bold\'>Everything in pro plus</span>...',

      'API Access',
      'Even Better GPUs and Storage',
      'Priority Support',
    ],
    actionText: 'Start Free Trial',

    onClick: async () => {
      const url = await getCheckoutUrl('developer')
      console.warn('redirect to checkout', url)
      location.href = url
    },
  },
])
</script>

<template>
  <div class="el-pricing relative z-10 overflow-hidden">
    <div class="relative z-20 px-4 pt-12 sm:px-6 lg:px-8 lg:pt-20">
      <div class="relative mx-auto max-w-screen-xl text-center">
        <div class="bg-theme-0 absolute inset-0 opacity-30" />
        <div class="relative z-10">
          <div
            v-if="sup"
            class="sup text-theme-300 mb-4 text-sm font-bold uppercase tracking-widest"
          >
            {{ sup }}
          </div>
          <h1
            class="mt-2 text-3xl font-extrabold tracking-tighter sm:text-4xl lg:text-6xl"
          >
            {{ title }}
          </h1>
          <div
            class="text-theme-500 mx-auto mt-3 max-w-3xl text-xl sm:mt-5 sm:text-2xl"
          >
            <div class="font-semibold">
              {{ subTitle }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="mx-auto mt-16 max-w-screen-xl px-4 pb-12 sm:px-6 lg:mt-20 lg:px-8 lg:pb-20"
    >
      <div class="relative z-0">
        <div class="absolute inset-0 h-5/6 lg:h-2/3" />
        <div class="mx-auto">
          <div class="relative gap-6 lg:grid lg:grid-cols-12">
            <div
              v-for="(item, i) in options"
              :key="i"
              :class="item.columnClasses"
              class="mb-6"
            >
              <div
                class="relative flex h-full flex-col rounded-lg lg:rounded-none lg:rounded-l-lg"
              >
                <div
                  class="pointer-events-none absolute inset-0 hidden rounded-xl border-4"
                  aria-hidden="true"
                />
                <div class="absolute inset-x-0 top-0 translate-y-px">
                  <div class="flex -translate-y-1/2 justify-center">
                    <span
                      class="ring-theme-0 inline-flex rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest ring-2"
                      :class="
                        item.mainColumn
                          ? 'bg-primary-500 text-white '
                          : 'bg-theme-200 text-theme-500'
                      "
                    >{{ item.title }} Plan</span>
                  </div>
                </div>

                <div
                  class="flex flex-1 flex-col overflow-hidden rounded-xl shadow-lg"
                  :class="[
                    item.mainColumn
                      ? 'ring-primary-500 ring-2'
                      : 'ring-theme-300 ring-1',
                  ]"
                >
                  <div class="bg-theme-0 px-4 py-8">
                    <div>
                      <div class="mt-4 flex items-center justify-center">
                        <span
                          class="text-theme-900 flex items-start px-3 text-6xl tracking-tight"
                        >
                          <span
                            v-if="item.pricing.unit"
                            class="mr-2 mt-1 text-3xl font-bold tracking-tight"
                          >{{ item.pricing.unit }}</span>
                          <span
                            class="text-theme-800 font-extrabold tracking-tight"
                          >{{ item.pricing.cost }}</span>
                        </span>
                        <span
                          v-if="item.pricing.per"
                          class="text-theme-400 text-xl font-medium"
                        >/
                          {{ item.pricing.per === "month" ? "mo" : "yr" }}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    class="bg-theme-0 flex flex-1 flex-col justify-between p-6 sm:p-6 lg:p-6 xl:p-8"
                  >
                    <div v-if="typeof item.slider !== 'undefined'">
                      <InputRange
                        v-model:model-value="item.slider"
                        :hide-value="true"
                      />

                      <div
                        class="mx-auto my-6 flex w-72 items-center justify-center space-x-4"
                      >
                        <div class="min-w-0 text-center">
                          <div
                            class="text-theme-400 text-[10px] font-bold uppercase tracking-wide"
                          >
                            compute credits
                          </div>
                          <div class="text-theme-600 text-lg font-extrabold">
                            {{
                              formatNumber(item.pricing.credits, "abbreviated")
                            }}
                          </div>
                        </div>
                        <div class="text-theme-300">
                          /
                        </div>
                        <div class="min-w-0 text-center">
                          <div
                            class="text-theme-400 text-[10px] font-bold uppercase tracking-wide"
                          >
                            AI Server
                            <span class="italic">(minutes)</span>
                          </div>
                          <div class="text-theme-600 text-lg font-extrabold">
                            {{ formatNumber(item.pricing.minutes) }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="mb-8 mt-4">
                      <ElButton
                        :loading="sendingToStripe === item.key"
                        :btn="item.mainColumn ? 'primary' : 'default'"
                        class="w-full justify-center px-4 py-3 text-base font-semibold md:text-lg"
                        @click.prevent="item.onClick()"
                      >
                        {{ item.actionText }}
                      </ElButton>
                    </div>
                    <ul role="list" class="grow space-y-4">
                      <li
                        v-for="(feat, ii) in item.features"
                        :key="ii"
                        class="flex items-start"
                      >
                        <div class="shrink-0">
                          <!-- Heroicon name: outline/check -->
                          <svg
                            class="h-6 w-6 shrink-0 text-green-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        </div>
                        <p
                          class="text-theme-500 ml-3 text-base font-medium"
                          v-html="feat"
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ContentBox class="mt-2 hidden text-center" wrap-class="p-8">
        Not ready for pro? Try Fiction with the limited free plan which includes
        1 model per month.
      </ContentBox>
    </div>
    <PricingFaq class="mx-4 mb-24" />
  </div>
</template>

<style lang="less">
.angled-bottom {
  clip-path: polygon(0 0, 172% 0, 0% 100%, 0 100%, 0% 0, 0 0%);
}
</style>
