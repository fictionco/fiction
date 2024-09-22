<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import { version } from '@fiction/core/package.json'
import favicon from '@fiction/ui/brand/favicon.svg'
import XButton from '@fiction/ui/buttons/XButton.vue'
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
  <div class="view-home" :class="card.classes.value.contentWidth">
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
            FictionOS is a modern, open-source, and flexible platform for
            building personal marketing tools.
          </p>
          <div class="mt-10 flex items-center gap-x-6">
            <XButton theme="primary" :href="link" size="lg">
              View Developer Docs
            </XButton>

            <XButton
              href="https://github.com/fictionco/fiction"
              target="_blank"
              theme="default"
              size="lg"
              icon="i-tabler-brand-github"
            >
              {{ version }}
            </XButton>
          </div>
        </div>
        <div class="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div class="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none bg-theme-1000">
            <img :src="dash" alt="App screenshot" width="2432" height="1442" class="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 opacity-40">
          </div>
        </div>
      </div>
    </div>

    <ElBenefits :card />

    <ElFeatures :card />
  </div>
</template>
