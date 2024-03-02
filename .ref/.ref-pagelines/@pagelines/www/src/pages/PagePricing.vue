<script lang="ts" setup>
import type {
  FactorRouter,
  FactorUser,
} from '@factor/api'
import {
  formatNumber,
  useMeta,
  useService,
  vue,
} from '@factor/api'

import ElButton from '@factor/ui/ElButton.vue'
import type { FactorStripe } from '@factor/plugin-stripe'
import SiteWrapDark from './SiteWrapDark.vue'
import PricingFaq from './PricingFaq.vue'

defineProps({
  title: { type: String, required: true },
  sup: { type: String, default: undefined },
  subTitle: { type: String, default: undefined },
})
const { factorStripe } = useService<{
  factorStripe: FactorStripe
  factorUser: FactorUser
  factorRouter: FactorRouter
}>()

const duration = vue.ref<'month' | 'year'>('month')
const multiple = vue.computed(() => (duration.value === 'year' ? 10 : 1))
const sending = vue.ref('')
const standardFeatures = [
  'Embed on unlimited websites',
  'Unlimited data sources',
]

interface PriceItem {
  key: string
  columnClasses: string
  ringClasses: string
  icon: string
  title: string
  basePrice: number
  monthPriceId?: string
  yearPriceId?: string
  bestFor: string
  features: string[]
  actionText: string
}
async function navToCheckout(item: PriceItem) {
  sending.value = item.key

  if (item.basePrice === 0) {
    location.href = '/auth/login'
    return
  }
  const priceId
    = duration.value === 'month' ? item.monthPriceId : item.yearPriceId

  const url = await factorStripe.getCheckoutUrl({
    priceId,
    loginPath: '/auth/login',
  })

  location.href = url

  sending.value = ''
}

const options = vue.ref([
  {
    key: 'proBono',
    columnClasses:
      'mx-auto max-w-md lg:col-span-3 lg:row-start-2 lg:row-end-3 lg:mx-0 lg:max-w-none',
    ringClasses: '',
    icon: 'i-carbon-badge',
    title: 'Pro Bono',
    basePrice: 0,
    bestFor: 'Getting Started with AI',
    features: [
      '<span class=\'text-theme-800 font-bold\'>400 messages per month</span>...',
      '2 Chat Agents',
      '500K Characters per agent',
      ...standardFeatures,
    ],
    actionText: 'Start',
  },
  // {
  //   key: "personal",
  //   columnClasses:
  //     "mx-auto max-w-md lg:col-span-3 lg:row-start-2 lg:row-end-3 lg:mx-0 lg:max-w-none",
  //   ringClasses: "",
  //   icon: "i-carbon-badge",
  //   title: "Personal",
  //   basePrice: 19,
  //   monthPriceId: "price_1N8rvvGIVbyH7UmOvywWpZnI",
  //   yearPriceId: "price_1N8rvvGIVbyH7UmOfXAZDtcZ",
  //   bestFor: "For getting started",
  //   features: [
  //     "<span class='text-theme-800 font-bold'>2000 messages per month</span>...",
  //     "4 Chat Agents",
  //     "2M Characters per agent",
  //     ...standardFeatures,
  //   ],
  //   actionText: "Subscribe",
  // },
  {
    key: 'plus',
    mainColumn: false,
    columnClasses:
      'mx-auto max-w-md lg:col-span-3 lg:row-start-2 lg:row-end-3 lg:mx-0 lg:max-w-none',
    ringClasses: '',
    icon: 'i-carbon-group-access',
    title: 'Plus',
    basePrice: 49,
    monthPriceId: 'price_1N8rwUGIVbyH7UmOtLiFJ4ig',
    yearPriceId: 'price_1N8rwUGIVbyH7UmO1n2E96cs',
    bestFor: 'All pro features',
    features: [
      '<span class=\'text-theme-800 font-bold\'>5000 messages per month</span>...',
      '8 Chat Agents',
      '4M Characters per agent',
      'API Access',
      ...standardFeatures,
    ],
    actionText: 'Subscribe',
  },
  {
    key: 'pro',
    mainColumn: false,
    columnClasses:
      'mx-auto max-w-md lg:col-span-3 lg:row-start-2 lg:row-end-3 lg:mx-0 lg:max-w-none',
    ringClasses: '',
    icon: 'i-carbon-group-access',
    title: 'Pro',
    basePrice: 99,
    monthPriceId: 'price_1N8rwxGIVbyH7UmOtyOXMKjS',
    yearPriceId: 'price_1N8rwxGIVbyH7UmOfX8XIzPt',
    bestFor: 'API and Integration',
    features: [
      '<span class=\'text-theme-800 font-bold\'>10,000 messages per month</span>...',
      '20 Chat Agents',
      '6M Characters per agent',
      'API Access',
      'Pro Integrations',
      ...standardFeatures,
    ],
    actionText: 'Subscribe',
  },
  {
    key: 'premier',
    mainColumn: true,
    columnClasses:
      'mx-auto max-w-md lg:col-span-3 lg:row-start-2 lg:row-end-3 lg:mx-0 lg:max-w-none',
    ringClasses: '',
    icon: 'i-carbon-group-access',
    title: 'Premier',
    basePrice: 399,
    monthPriceId: 'price_1N8rxXGIVbyH7UmO4mY4XDzd',
    yearPriceId: 'price_1N8rxXGIVbyH7UmORWHc7vgJ',
    bestFor: 'Complete package (most popular)',
    features: [
      '<span class=\'text-theme-800 font-bold\'>40,000 messages per month</span>...',
      '40 Chat Agents',
      '20M Characters per agent',
      'API Access',
      'Pro Integrations',
      'Remove PageLines branding',
      ...standardFeatures,
    ],
    actionText: 'Subscribe',
  },
])
useMeta({
  title: `Plan and Pricing - PageLines`,
  meta: [
    {
      name: `description`,
      content: `Review and compare the plans and pricing for PageLines. Includes a free plan and FAQ.`,
    },
  ],
})
</script>

<template>
  <SiteWrapDark>
    <div class="el-pricing relative z-10 overflow-hidden">
      <div
        class="relative z-20 mx-auto mb-16 mt-8 max-w-screen-xl px-4 pt-8 sm:px-6 lg:px-8"
      >
        <div class="relative mx-auto max-w-screen-xl text-center">
          <div class="relative z-10 mx-auto max-w-xl">
            <div class="sup mb-4 text-xs font-bold uppercase tracking-widest">
              Professional AI for Your Website
            </div>
            <h1
              class="font-brand mt-2 flex max-w-2xl items-baseline justify-center space-x-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-7xl"
            >
              <span>Plans</span> <span class="amp text-theme-500">&amp;</span>
              <span class="under">Pricing</span>
            </h1>
            <div class="font-brand mt-3 text-xl sm:mt-5 sm:text-3xl">
              <div class="font-semibold">
                <span class="under">Two months free</span> with yearly
                subscription
              </div>
            </div>
          </div>
        </div>
      </div>

      <div bg-class="top-32 bottom-40">
        <div class="relative z-0">
          <div class="mx-auto max-w-screen-xl p-4 md:p-6">
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
                            ? 'bg-primary-600 text-theme-800 '
                            : 'bg-theme-300 text-theme-800'
                        "
                      >{{ item.title }}</span>
                    </div>
                  </div>

                  <div
                    class="flex flex-1 flex-col overflow-hidden rounded-xl shadow-lg"
                    :class="[
                      item.mainColumn
                        ? 'ring-theme-200 ring-2'
                        : 'ring-theme-200 ring-2',
                    ]"
                  >
                    <div class="bg-theme-0 px-3 pb-4 pt-8">
                      <div>
                        <div
                          v-if="item.basePrice === 0"
                          class="font-brand text-center text-5xl font-bold tracking-tight"
                        >
                          Free
                        </div>
                        <div v-else class="flex items-center justify-center">
                          <span
                            class="text-theme-900 font-brand flex items-start px-3 text-5xl tracking-tight"
                          >
                            <span
                              class="mr-2 mt-1 -rotate-6 text-2xl font-bold tracking-tight"
                            >$</span>
                            <span
                              class="text-theme-800 font-brand font-bold tracking-tight"
                            >{{
                              formatNumber(item.basePrice * multiple)
                            }}</span>
                          </span>

                          <span class="text-lg font-medium tracking-tight">/ {{ duration === "month" ? "mo" : "yr" }}</span>
                        </div>
                      </div>
                      <div
                        class="px-8 text-center text-xs font-medium tracking-tight"
                      >
                        {{ item.bestFor }}
                      </div>
                    </div>

                    <div
                      class="bg-theme-0 flex flex-1 flex-col justify-between px-4 pb-8 pt-3 sm:px-4"
                    >
                      <div class="mb-8">
                        <ElButton
                          :btn="item.mainColumn ? 'primary' : 'default'"
                          class="w-full justify-center px-4 py-2 text-base font-semibold"
                          :loading="sending === item.key"
                          @click.prevent="navToCheckout(item)"
                        >
                          {{ item.actionText }}
                        </ElButton>
                      </div>
                      <ul role="list" class="grow space-y-3">
                        <li
                          v-for="(feat, ii) in item.features"
                          :key="ii"
                          class="flex items-start"
                        >
                          <div class="shrink-0 pl-2">
                            <!-- Heroicon name: outline/check -->
                            <svg
                              class="h-5 w-5 shrink-0 text-green-500"
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
                          <p class="ml-3 text-xs font-medium" v-html="feat" />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <PricingFaq class="mb-24" />
        </div>
      </div>
    </div>
  </SiteWrapDark>
</template>
