<script lang="ts" setup>
import { timeUtil, vue } from '@fiction/core'
import type { Card } from '../../card'
import XText from '../../el/XText.vue'

type Quote = {
  text: string // Required field for the quote text
  orgName?: string // Optional full name of the organization
  orgImage?: string // Optional URL to the organization's image/logo
  authorTitle?: string // Optional position or title of the author in the organization
  authorName?: string // Optional name of the person who made the quote
  authorImage?: string // Optional URL to the author's image
  authorLink?: string // Optional URL to the author's website or social media profile
  date?: Date // Optional date when the quote was made or published
  tags?: string[] // Optional array of tags for categorization
}

export type UserConfig = {
  heading?: string
  subHeading?: string
  superHeading?: string
  quote?: Quote
}
const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const uc = vue.computed(() => {
  const u = props.card.userConfig.value
  u.quote = u.quote
    ? u.quote
    : {
        authorName: 'Benjamin Franklin',
        authorTitle: 'Founding Father',
        text: 'An investment in knowledge pays the best interest.',
      } as Quote
  return u
})
const quote = vue.computed(() => uc.value.quote)
</script>

<template>
  <div class="">
    <div class="mx-auto max-w-5xl px-6 lg:px-8">
      <XText
        tag="h2"
        :card="card"
        class="text-theme-400 mb-6 font-sans text-sm font-medium uppercase tracking-wide"
        path="superHeading"
      />
      <XText
        tag="h1"
        :card="card"
        path="heading"
        class="x-font-title text-4xl font-bold tracking-tighter lg:text-7xl"
      />
      <XText
        tag="p"
        :card="card"
        path="subHeading"
        class="mt-6 text-xl lg:text-3xl lg:leading-snug"
        v-html="uc.subHeading"
      />
      <div class="mt-10 text-center">
        <div>
          <div v-if="quote?.orgImage" class="org mb-6 text-center">
            <div class="relative inline-block">
              <img
                class="h-14"
                :src="quote.orgImage"
                :alt="quote.orgName"
              >
            </div>
          </div>
          <div class="flex-col justify-center text-7xl">
            <div class="min-w-0">
              &#8220;<XText tag="span" :card="card" path="quote.text" />&#8221;
            </div>
          </div>
          <div v-if="quote?.authorName" class="mt-8 flex items-center justify-center gap-8">
            <div class="font-sans text-4xl">
              &mdash;
            </div>
            <div
              v-if="quote?.authorImage"
              class="relative aspect-square h-14 overflow-hidden rounded-full"
            >
              <img
                class="absolute h-full w-full object-cover"
                :src="quote.authorImage"
              >
            </div>
            <div class="text-left space-y-1">
              <XText :card="card" path="quote.authorName" class="text-3xl font-bold" />
              <XText class="font-sans text-xl" :card="card" path="quote.authorTitle" />
              <div class="font-sans text-base flex gap-4 items-baseline">
                <div v-if="quote?.date">
                  {{ timeUtil(quote?.date).format('MMM D, YYYY') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
