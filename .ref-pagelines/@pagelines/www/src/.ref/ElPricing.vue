<script lang="ts" setup>
import { formatNumber, vue } from '@factor/api'
import ElButton from '@factor/ui/ElButton.vue'

defineProps({
  title: { type: String, required: true },
  sup: { type: String, default: undefined },
  subTitle: { type: String, default: undefined },
})

type PricingGroup = 'standard' | 'deep' | 'advanced'

function getPriceDisplay(key: PricingGroup) {
  return vue.computed(() => {
    let p = {
      cost: 0,
    }
    if (key === 'standard') {
      p = {
        cost: 7000,
      }
    }
    else if (key === 'advanced') {
      p = {
        cost: 13_000,
      }
    }
    else if (key === 'deep') {
      p = {
        cost: 19_000,
      }
    }

    return {
      ...p,
      per: 'month',
      unit: '$',
    }
  })
}
const standard = vue.computed(() => getPriceDisplay('standard').value)
const deep = vue.computed(() => getPriceDisplay('deep').value)
const advanced = vue.computed(() => getPriceDisplay('advanced').value)

const options = vue.ref([
  {
    key: 'std',
    columnClasses:
      'mx-auto max-w-md lg:col-span-4 lg:row-start-2 lg:row-end-3 lg:mx-0 lg:max-w-none',
    ringClasses: ' ',
    icon: 'i-carbon-badge',
    title: 'Standard',
    pricing: standard,
    bestFor:
      'For exploring possibilities and straight-forward AI integrations.',
    features: [
      '<span class=\'text-theme-800 font-bold\'>10 billable hours included monthly</span>...',
      'Planning and Implementations',
      'Training, Deployment, and Monitoring',
      '24/7 Email Support',
    ],
    actionText: 'Contact Us',

    onClick: async () => {
      location.href = '/contact'
    },
  },
  {
    key: 'advanced',
    mainColumn: true,
    columnClasses:
      'mx-auto max-w-md lg:col-span-4 lg:row-start-2 lg:row-end-3 lg:mx-0 lg:max-w-none',
    ringClasses: '',
    icon: 'i-carbon-group-access',
    title: 'Advanced',
    pricing: advanced,
    bestFor: 'For deep integrations and custom AI features and products.',
    features: [
      '<span class=\'text-theme-800 font-bold\'>20 billable hours included monthly</span>...',
      'All Standard Features',
      'Data Pipelining',
      'Dedicated Slack & 24/7 Support',
    ],
    actionText: 'Contact Us',
    onClick: async () => {
      location.href = '/contact'
    },
  },
  {
    key: 'deep',
    mainColumn: false,
    columnClasses:
      'mx-auto max-w-md lg:col-span-4 lg:row-start-2 lg:row-end-3 lg:mx-0 lg:max-w-none',
    ringClasses: '',
    icon: 'i-carbon-group-access',
    title: 'Deep',
    pricing: deep,
    bestFor: 'For comprehensive and best-of-class AI features and products.',
    features: [
      '<span class=\'text-theme-800 font-bold\'>32 billable hours included monthly</span>...',
      'All Advanced Features',
      'API Development and DevOps',
      'Dedicated Slack & 24/7 Support',
    ],
    actionText: 'Contact Us',

    onClick: async () => {
      location.href = '/contact'
    },
  },
])
</script>

<template>
  <div class="el-pricing relative z-10 overflow-hidden">
    <div
      class="relative z-20 mx-auto mt-8 max-w-screen-xl px-4 pt-8 sm:px-6 lg:px-8"
    >
      <div class="relative mx-auto max-w-screen-xl text-center">
        <div class="relative z-10 mx-auto max-w-xl">
          <div
            v-if="sup"
            class="sup mb-4 text-sm font-bold uppercase tracking-widest"
          >
            {{ sup }}
          </div>
          <h1
            class="font-brand mt-2 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-6xl"
          >
            {{ title }}
          </h1>
          <div class="font-brand mt-3 text-xl sm:mt-5 sm:text-3xl">
            <div class="font-semibold">
              {{ subTitle }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="mx-auto mt-12 max-w-screen-xl px-4 pb-12 sm:px-6 lg:mt-20 lg:px-8 lg:pb-20"
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
                          ? 'bg-theme-950 text-white '
                          : 'bg-theme-600 text-theme-0'
                      "
                    >{{ item.title }}</span>
                  </div>
                </div>

                <div
                  class="flex flex-1 flex-col overflow-hidden rounded-xl shadow-lg"
                  :class="[
                    item.mainColumn
                      ? 'ring-theme-800 ring-2'
                      : 'ring-theme-500 ring-1',
                  ]"
                >
                  <div class="bg-theme-0 px-4 pb-4 pt-8">
                    <div>
                      <div class="mt-4 flex items-center justify-center">
                        <span
                          class="text-theme-900 flex items-start px-3 text-6xl tracking-tight"
                        >
                          <span
                            class="mr-2 mt-1 text-3xl font-bold tracking-tight"
                          >$</span>
                          <span
                            class="text-theme-800 font-extrabold tracking-tight"
                          >{{
                            formatNumber(item.pricing.cost, "abbreviated")
                          }}</span>
                        </span>
                        <span class="text-theme-400 text-xl font-medium">/ mo</span>
                      </div>
                    </div>
                    <div
                      class="text-theme-500 px-12 py-4 text-center text-base font-medium tracking-tight"
                    >
                      {{ item.bestFor }}
                    </div>
                  </div>

                  <div
                    class="bg-theme-0 flex flex-1 flex-col justify-between px-6 pb-8 pt-3 sm:px-6 lg:px-6 xl:px-8"
                  >
                    <div class="mb-8 mt-4">
                      <ElButton
                        :btn="item.mainColumn ? 'theme' : 'default'"
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
    </div>
    <PricingFaq class="mb-24" />
  </div>
</template>
