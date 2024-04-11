<script lang="ts" setup>
import { storeItem, vue } from '@fiction/core'
import ElButton from '@fiction/ui/ElButton.vue'
import type { Card } from '@fiction/site'
import bothWaysArrow from './both-ways-arrow.svg'

export type UserConfig = { test?: boolean }

defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const volumeTier = vue.ref(0)

const referralAccounts = vue.computed(() => {
  const base = [
    { referrals: 1 },
    { referrals: 2 },
    { referrals: 4 },
    { referrals: 8 },
    { referrals: 16 },
    { referrals: 32 },
    { referrals: 64 },
    { referrals: 125 },
    { referrals: 250 },
    { referrals: 500 },
    { referrals: 1000 },
    { referrals: 2000 },
    { referrals: 4000 },
  ]

  return base.map((_) => {
    const earnings = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(_.referrals * 23.7)

    const yearlyEarnings = Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(_.referrals * 23.7 * 12)

    const accounts = Intl.NumberFormat('en-US').format(+_.referrals)

    return {
      accounts,
      earnings,
      yearlyEarnings,
    }
  })
})
</script>

<template>
  <div class="overflow-x-hidden">
    <div class="bg-dark-800 sm:pt-16 lg:overflow-hidden lg:pb-14 lg:pt-8">
      <div class="mx-auto max-w-7xl lg:px-8">
        <div class="lg:grid lg:grid-cols-12 lg:gap-8">
          <div
            class="col-span-12 px-6 sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left"
          >
            <div class="pb-24 pt-32 lg:pb-32 lg:pt-48">
              <h1
                class="font-brand text-4xl font-bold tracking-tight x-font-title sm:mt-5 sm:text-6xl lg:mt-6 xl:text-7xl"
              >
                <span class="">Refer and earn</span><span class="under mt-1 pb-3 sm:pb-5 xl:block">
                  30% Recurring Commission.</span>
              </h1>
              <div
                class="font-brand text-theme-800 dark:text-theme-100 my-8 max-w-prose space-y-4 text-lg md:text-4xl"
              >
                <div class="block">
                  As an affiliate, you will make a 30%
                  <span class="italic">recurring</span> commission for paid
                  customers.
                </div>
              </div>
              <div class="mt-10 sm:mt-12">
                <div class="">
                  <div class="mt-3 sm:mt-0">
                    <ElButton
                      href="#"
                      size="lg"
                      btn="primary"
                      class="px-3 sm:px-6"
                    >
                      Coming Soon
                    </ElButton>
                  </div>
                  <div
                    class="text-dark-400 mt-8 text-xs font-sans antialiased"
                  >
                    Affiliates are subject to approval.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-7xl px-4 py-12 md:px-20 lg:px-8 lg:py-12">
      <div class="my-20 items-center lg:flex-row">
        <div class="mt-8 text-lg text-white md:text-2xl md:leading-relaxed">
          <div class="font-brand grid grid-cols-12 2xl:gap-32">
            <div class="col-span-12 2xl:col-span-6">
              <h2
                class="x-font-title mb-6 max-w-4xl text-3xl font-bold tracking-tight lg:pr-7 lg:text-6xl"
              >
                <span
                  class="from-primary-200 to-primary-300 mb-2 block bg-gradient-to-br box-decoration-clone bg-clip-text text-transparent"
                >Paid Monthly</span>
                Earn 30% Recurring Income
              </h2>
              <div>To be a successful affiliate, you should:</div>

              <ul class="my-6 ml-12 list-outside list-disc space-y-4">
                <li>Understand the product and how it helps people.</li>

                <li>
                  Have an audience of people who are interested in this type of product.
                </li>
              </ul>
            </div>
            <div class="col-span-12 2xl:col-span-6 2xl:mt-2">
              <div
                class="bg-dark-800 rounded-lg p-8 text-center shadow-lg sm:p-12"
              >
                <h2
                  class="x-font-title m-auto text-2xl font-bold tracking-tight lg:text-3xl"
                >
                  <span class="bg-gradient-to-br from-primary-200 to-primary-300 bg-clip-text text-transparent">
                    Refer
                    <span class="mx-2">{{ referralAccounts[volumeTier].accounts }}</span>
                  </span>
                  <span v-if="volumeTier > 0"> accounts </span>
                  <span v-else> account </span> to a starting plan.
                  <!-- for up to 10,000 sessions -->
                </h2>
                <div class="mb-4 flex flex-col items-center">
                  <div class="my-12">
                    <div
                      class=" x-font-title mb-4 text-3xl font-bold lg:text-7xl"
                      v-html="referralAccounts[volumeTier].yearlyEarnings"
                    />

                    <div class="text-dark-200 text-lg font-medium uppercase tracking-wide font-sans antialiased">
                      Per Year /
                      <div
                        class="inline"
                        v-html="referralAccounts[volumeTier].earnings"
                      />
                      a month
                    </div>
                  </div>

                  <input
                    v-model="volumeTier"
                    type="range"
                    name="volume"
                    min="0"
                    :max="referralAccounts.length - 1"
                    class="bg-theme-100 mb-8 mt-4 h-2 w-full max-w-lg outline-none"
                  >
                  <img
                    :src="bothWaysArrow"
                    alt="both ways arrow"
                    class="mb-2.5 self-center"
                  >
                  <div class="self-center">
                    Adjust To Calculate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
input[type="range"] {
  @apply rounded-sm appearance-none;

  &::-webkit-slider-thumb {
    @apply h-9 w-9 bg-white cursor-pointer rounded-full appearance-none border-4 border-primary-500;
    -webkit-appearance: none;
  }
  &::-moz-range-thumb {
    @apply h-9 w-9 bg-white cursor-pointer rounded-full appearance-none border-4 border-primary-500;
  }
  &::-ms-thumb {
    @apply h-9 w-9 bg-white cursor-pointer rounded-full appearance-none border-4 border-primary-500;
  }
  &::-moz-focus-outer {
    border: 0;
  }
}
</style>import { Card } from '@fiction/site';import { Card } from '@fiction/site';
