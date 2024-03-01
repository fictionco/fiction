<script lang="ts" setup>
import type { vue } from '@factor/api'

export interface SectionProps {
  title?: string
  subTitle?: string
  badge?: string
  quotes?: {
    text?: string
    author?: string
    org?: string
    orgImg?: string
    position?: string
    authorImg?: string
  }[]
}
defineProps({
  settings: {
    type: Object as vue.PropType<SectionProps>,
    required: true,
  },
})
</script>

<template>
  <div class=" ">
    <div class="mx-auto max-w-5xl px-6 lg:px-8">
      <h2
        v-if="settings.badge"
        class="text-theme-400 mb-6 font-sans text-sm font-medium uppercase tracking-wide"
        v-html="settings.badge"
      />
      <h1
        class="ui-font-title text-4xl font-bold tracking-tighter lg:text-7xl"
        v-html="settings.title"
      />
      <p
        class="mt-6 text-xl lg:text-3xl lg:leading-snug"
        v-html="settings.subTitle"
      />
      <div class="mt-10 text-center">
        <div
          v-for="(quote, i) in settings.quotes"
          :key="i"
          class=""
        >
          <div class="org mb-6 text-center">
            <div class="relative inline-block">
              <img
                class="h-14"
                :src="quote.orgImg"
                :alt="quote.org"
              >
            </div>
          </div>
          <div class="flex-col justify-center text-7xl">
            <div class="min-w-0">
              &#8220;{{ quote.text }}&#8221;
            </div>
          </div>
          <div class="mt-8 flex items-center justify-center gap-8">
            <div class="font-sans text-4xl">
              &mdash;
            </div>
            <div
              class="relative aspect-square h-14 overflow-hidden rounded-full"
            >
              <img
                class="absolute h-full w-full object-cover"
                :src="quote.authorImg"
              >
            </div>
            <div class="text-left">
              <div class="text-3xl font-bold">
                {{ quote.author }}
              </div>
              <div class="font-sans text-xl">
                {{ quote.position }}, {{ quote.org }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
