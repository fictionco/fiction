<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import { version } from '@fiction/core/package.json'
import favicon from '@fiction/ui/brand/favicon.svg'
import ElButton from '@fiction/ui/ElButton.vue'
import dash from './dash.svg'
import ElBenefits from './ElBenefits.vue'
import ElFeatures from './ElFeatures.vue'

export type UserConfig = { test?: boolean }

defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const link = 'https://docs.fiction.com'
</script>

<template>
  <div class="view-home">
    <div class="relative  ">
      <svg class="-skew-x-6 absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" aria-hidden="true">
        <defs>
          <pattern
            id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
            width="200"
            height="200"
            x="50%"
            y="-1"
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y="-1" class="overflow-visible fill-theme-800/20">
          <path d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z" stroke-width="0" />
        </svg>
        <rect width="100%" height="100%" stroke-width="0" fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" />
      </svg>

      <div class="pb-24 pt-10 sm:pb-40 lg:flex lg:pt-40">
        <div class="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <img class="h-11" :src="favicon" alt="Your Company">
          <div class="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" class="inline-flex space-x-6 font-sans">
              <span class="rounded-full bg-theme-800/30 px-3 py-1 text-sm font-semibold leading-6 text-theme-300 ring-1 ring-inset ring-theme-500/20">Join the open source community</span>

            </a>
          </div>
          <h1 class="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl x-font-title text-balance">
            Your Platform, Built Your Way
          </h1>
          <p class="mt-6 text-2xl text-theme-300 leading-relaxed">
            Fiction OS is a modern, open-source, and flexible platform for
            building personal marketing tools.
          </p>
          <div class="mt-10 flex items-center gap-x-6">
            <ElButton btn="primary" :href="link" size="lg">
              View Developer Docs
            </ElButton>

            <ElButton
              href="https://github.com/fictionco/fiction"
              target="_blank"
              btn="default"
              size="lg"
            >
              <svg
                class="mr-2 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ version }}</span>
            </ElButton>
          </div>
        </div>
        <div class="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div class="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none bg-theme-1000">
            <img :src="dash" alt="App screenshot" width="2432" height="1442" class="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 opacity-40">
          </div>
        </div>
      </div>
    </div>

    <ElBenefits :card="card" />

    <ElFeatures :card="card" />
  </div>
</template>
