<script lang="ts" setup>
import { useMeta } from '@factor/api'
import { computed, ref } from 'vue'
import ElButton from '@kaption/core/ui/ElButton.vue'
import { featureGroups } from '../featureMap'
import bothWaysArrow from './img/both-ways-arrow.svg'

const metaDescription
  = 'Usage based pricing helps you start small and scale big. Get access to real-time data, smart dashboards, AB analytics, session replay, live heatmaps, and more. Get started in less than 60 seconds.'

useMeta({
  meta: [
    {
      name: 'description',
      content: metaDescription,
    },
    {
      property: 'og:description',
      content: metaDescription,
    },
    {
      name: 'twitter:description',
      content: metaDescription,
    },
  ],
})

const volumeTier = ref(0)

const monthlySessions = computed(() => {
  const base = [
    {
      sessions: 10_000,
    },
    {
      sessions: 20_000,
    },
    {
      sessions: 50_000,
    },
    {
      sessions: 100_000,
    },
    {
      sessions: 250_000,
    },
    {
      sessions: 500_000,
    },
    {
      sessions: 1_000_000,
    },
    {
      sessions: 2_000_000,
      price: `<a class="text-2xl font-medium hover:text-primary-500" href="/contact">Contact us</a>`,
    },
  ]

  return base.map((_, i) => {
    const price
      = _.price
      || new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(79 + (_.sessions - 10_000) * 0.002)

    let sessions = Intl.NumberFormat('en-US').format(+_.sessions)

    if (i >= base.length - 1)
      sessions = `${sessions}+`

    return {
      sessions,
      price,
    }
  })
})
</script>

<template>
  <div>
    <section class="mx-auto max-w-7xl px-4 pt-12 md:px-20 lg:px-12 lg:pt-28">
      <h1
        class="mb-4 text-2xl font-extrabold sm:max-w-2xl sm:text-4xl md:mb-10 lg:max-w-3xl lg:text-7xl xl:max-w-4xl"
      >
        Built for Perfectionists
      </h1>
      <p class="mb-12 text-2xl text-slate-500 sm:max-w-lg lg:mb-20">
        Kaption's Pro package includes all kinds of tools for professional
        marketers and money makers
      </p>
    </section>

    <section class="mx-auto max-w-7xl py-16 px-4 sm:py-24 md:px-20 lg:px-12">
      <h1 class="text-3xl font-extrabold sm:text-3xl">
        Features
      </h1>
      <p class="mb-4 text-lg text-slate-500">
        Get insights to dig down into what's powering your growth the most.
      </p>
      <div class="mt-12 lg:mt-20">
        <dl
          class="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-x-8 md:gap-y-16 lg:gap-x-28"
        >
          <router-link
            v-for="(item, i) in featureGroups.analytics"
            :key="i"
            :to="item.path ?? '/'"
            class="space-y-2"
          >
            <div
              class="h-6 w-6"
              :class="item?.class"
              v-html="item?.icon"
            />
            <dt class="mb-2.5 text-base font-medium">
              {{ item.name }}
            </dt>
            <dd class="text-sm text-slate-500" v-html="item.description" />
          </router-link>
        </dl>
      </div>
    </section>

    <section class="mx-auto my-32 max-w-7xl px-4 md:px-20 lg:px-12">
      <h1
        class="mb-8 text-2xl font-extrabold sm:max-w-2xl sm:text-4xl md:mb-16 lg:max-w-3xl lg:text-7xl xl:max-w-4xl"
      >
        Pricing
      </h1>
      <div class="flex max-w-5xl flex-col justify-between lg:flex-row">
        <div class="mb-4 flex flex-col items-start lg:w-96">
          <h3
            class="mb-4 flex items-center text-xl font-medium text-slate-500 sm:max-w-lg"
          >
            What are your monthly user sessions?
            <div class="group relative ml-1">
              <svg
                class="text-xlight-500 hidden h-6 w-6 cursor-pointer hover:text-slate-500 sm:block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"
                />
              </svg>
              <div
                class="h-fit-content border-light-100 absolute inset-y-0 left-full z-10 m-auto ml-1 hidden w-56 overflow-hidden rounded border bg-white px-3 py-2 opacity-0 shadow-md transition-all group-hover:opacity-100 sm:block"
              >
                <h5 class="mb-1 text-base">
                  What are monthly user sessions?
                </h5>
                <p class="text-sm font-normal text-slate-500">
                  Monthly user sessions are calculated as the number of unique
                  users with at least one interaction with your site/app in the
                  last month.
                </p>
              </div>
            </div>
          </h3>
          <h1 class="my-4 text-3xl font-extrabold leading-none">
            {{ monthlySessions[volumeTier].sessions }} Sessions
          </h1>
          <input
            v-model="volumeTier"
            type="range"
            name="volume"
            min="0"
            :max="monthlySessions.length - 1"
            class="mt-4 mb-8 h-2 w-full bg-purple-100 outline-none"
          >
          <img
            :src="bothWaysArrow"
            alt="both ways arrow"
            class="mb-2.5 self-center"
          >
          <div class="text-xlight-500 self-center text-sm">
            Adjust your monthly user sessions
          </div>
        </div>
        <div class="flex flex-col items-start lg:w-96">
          <div class="lg:max-w-sm">
            <h3
              class="mb-4 text-xl font-medium text-slate-500 sm:max-w-lg lg:mb-12"
            >
              Your price
            </h3>
            <h1 class="mb-6">
              <div
                v-if="volumeTier < monthlySessions.length - 1"
                class="inline text-3xl font-extrabold lg:text-5xl"
                v-html="monthlySessions[volumeTier].price"
              />
              <div v-else class="inline text-5xl font-extrabold">
                Custom
              </div>
              <div
                v-if="volumeTier < monthlySessions.length - 1"
                class="inline text-2xl"
              >
                /month
              </div>
              <a
                v-else
                href="mailto:hello@kaption.co"
                class="inline text-2xl"
              >(Contact us)</a>
            </h1>
            <a class="mb-7 block" href="https://app.kaption.co/register">
              <ElButton btn="primary" class="">Start a Free 14 Day Trial</ElButton></a>
            <p class="text-slate-500">
              <span v-if="volumeTier < monthlySessions.length - 1">Need a bigger plan?</span>
              We've got you covered. We'll personally help you get onboarded,
              too.
              <a href="/contact" class="text-primary-500 hover:underline">Contact us</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="less">
input[type="range"] {
  @apply rounded-sm;
  -moz-appearance: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    @apply h-9 w-9 bg-white cursor-pointer rounded-full appearance-none;
    -webkit-appearance: none;
    border: 8px solid #8660fe;
  }
  &::-moz-range-thumb {
    @apply h-9 w-9 bg-white cursor-pointer rounded-full appearance-none;
    border: 8px solid #8660fe;
  }
  &::-ms-thumb {
    @apply h-9 w-9 bg-white cursor-pointer rounded-full appearance-none;
    border: 8px solid #8660fe;
  }
  &::-moz-focus-outer {
    border: 0;
  }
}
</style>
