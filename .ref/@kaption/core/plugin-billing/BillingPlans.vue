<script lang="ts" setup>
import { toLabel, vue, vueRouter } from '@factor/api'
import { useKaption } from '../utils'
import BillingWrap from './BillingWrap.vue'
import PanelDowngrade from './BillingDowngrade.vue'

const { factorRouter, kaptionBilling } = useKaption()

const router = vueRouter.useRouter()
const downgradeVisible = vue.ref(false)

const plans = vue.computed(() => {
  return [
    {
      current: true,
      name: 'professional',
      description: 'The flagship platform with all features and upgrades.',
      button:
        kaptionBilling.activePlan.value.name === 'pro'
          ? {
              text: 'Active Plan',
              class: `cursor-default bg-primary-800 text-white border-primary-800`,
            }
          : {
              text: 'Start 14-Day Trial &rarr;',
              class: `bg-primary-500 text-white border-primary-500 focus:ring-primary-500 focus:ring-2 focus:ring-offset-2`,
              click: async () => {
                await router.push(factorRouter.to('billing'))
              },
            },
      features: [
        'Dozens of pro features: Replays, heatmaps, variant experiments',
        'Additional pro-grade widgets and charts',
        '$79 per month base for 20K monthly sessions then pay as you go',
        'Free 2-week trial',
        'Premium support and community membership',
      ],
      active: kaptionBilling.activePlan.value.name === 'pro',
    },

    {
      name: 'custom',
      buttonAction: 'contact',
      button: {
        text: 'Contact Us &rarr;',
        class: `bg-white text-primary-500 border-primary-500 hover:bg-primary-50 focus:ring-primary-500 focus:ring-2 focus:ring-offset-2`,
        href: 'https://www.kaption.co/contact',
        click: (): void => {
          window.open('https://www.kaption.co/contact', '_blank')?.focus()
        },
      },
      description:
        'Everything included with the professional plan with negotiated pricing, compliance, tools, and support.',
      features: [
        'All pro features',
        'Eligible at +2M sessions',
        'Custom volumes and pricing',
        'Dedicated data manager',
        'Custom data reviews and reports',
      ],
      active: kaptionBilling.activePlan.value.name === 'custom',
    },
    {
      name: 'free',
      description: 'Just the basics.',
      button:
        kaptionBilling.activePlan.value.name === 'pro'
          ? {
              text: 'Downgrade',
              class: `bg-theme-50 hover:bg-theme-100 text-theme-400`,
              click: (): void => {
                downgradeVisible.value = true
              },
            }
          : {
              text: 'Active Plan',
              class: `bg-theme-50  text-theme-400`,
            },
      features: [
        'Free forever',
        '10K Monthly Sessions',
        'Dashboards, analytics, and event tracking',
        'Basic heatmaps, replays and behavior tracking',
      ],
      active: kaptionBilling.activePlan.value.name === 'free',
    },
  ]
})
</script>

<template>
  <BillingWrap>
    <div class=" ">
      <div class="">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="mb-6 max-w-lg text-left">
            <h2 class="text-2xl font-bold">
              Plans and Pricing
            </h2>
            <p class="mt-2 text-base text-theme-500">
              All plans have a free trial and a satisfaction guarantee. If
              you're not 100% happy we'll refund your investment.
            </p>
          </div>
        </div>

        <div
          v-for="(plan, i) in plans"
          :key="i"
          class="mb-8"
        >
          <div class="relative">
            <div class="relative px-4 sm:px-6 lg:px-8">
              <div
                class="mx-auto grid grid-cols-12 overflow-hidden rounded-lg border border-slate-200"
              >
                <div class="col-span-8 px-6 py-8 lg:p-12">
                  <h3 class="text-xl font-extrabold sm:text-2xl">
                    {{ toLabel(plan.name) }}
                  </h3>
                  <p class="mt-2 text-base text-theme-500">
                    {{ plan.description }}
                  </p>
                  <div class="mt-8">
                    <div class="flex items-center">
                      <h4
                        class="shrink-0 bg-white pr-4 text-sm font-semibold uppercase tracking-wider text-indigo-600"
                      >
                        What's included
                      </h4>
                      <div class="flex-1 border-t-2 border-slate-200" />
                    </div>
                    <ul
                      class="mt-8 space-y-5 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5 lg:space-y-0"
                    >
                      <li
                        v-for="(feature, ii) in plan.features"
                        :key="ii"
                        class="flex items-start lg:col-span-1"
                      >
                        <div class="shrink-0">
                          <!-- Heroicon name: solid/check-circle -->
                          <svg
                            class="h-5 w-5 text-green-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </div>
                        <p class="ml-3 text-sm text-theme-500">
                          {{ feature }}
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  class="col-span-4 border-l border-slate-200 py-8 px-6 text-center lg:flex lg:flex-col lg:justify-center lg:p-12"
                >
                  <div class="mt-6">
                    <button
                      type="button"
                      class="inline-flex items-center rounded-md border border-transparent px-6 py-3 text-base font-medium shadow-sm focus:outline-none"
                      :class="plan.button.class"
                      @click.prevent.stop="plan.button.click"
                      v-html="plan.button.text"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PanelDowngrade v-model:vis="downgradeVisible" />
  </BillingWrap>
</template>
