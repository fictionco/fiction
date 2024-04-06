<script lang="ts" setup>
import type { vue } from '@fiction/core'
import { unhead, useService } from '@fiction/core'
import type { Card } from '@fiction/site'
import { ref } from 'vue'
import ElAvatar from '@fiction/ui/ElAvatar.vue'
import ElemDirections from './AboutDirections.vue'

export type UserConfig = {
  icon?: string
}

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
const { fictionUser, fictionRouter } = useService()

const team = ref([
  {
    email: 'arpowers@gmail.com',
    name: 'Andrew Powers',
    title: 'Founder',
    content: `Andrew is a serial entrepreneur and investor. He founded PageLines.com, which sold in 2016, as well as Fiction.com, Darwin Analytics and now Kaption.`,
    social: [
      {
        name: 'Email',
        link: 'mailto:andrew@kaption.co',
      },
    ],
  },
])

const metaTitle = 'About Kaption.co'

const metaDescription
  = 'We tried almost every analytics other tool, and none of them made it possible to understand the needs of our customers. That\'s why we started working on Kaption.'

unhead.useHead({
  title: metaTitle,
  meta: [
    {
      name: 'description',
      content: metaDescription,
    },
    {
      property: 'og:title',
      content: metaTitle,
    },
    {
      property: 'og:description',
      content: metaDescription,
    },
    {
      name: 'twitter:title',
      content: metaTitle,
    },
    {
      name: 'twitter:description',
      content: metaDescription,
    },
  ],
})
</script>

<template>
  <div>
    <div class="overflow-visible">
      <section
        class="mx-auto max-w-3xl px-4 pt-12 text-center md:px-20 lg:px-12 "
      >
        <h1
          class="m-auto mb-4 text-3xl x-font-title font-bold tracking-tight sm:text-4xl md:mb-10 lg:text-5xl xl:text-6xl"
        >
          About
        </h1>
        <p class="text-color-500 m-auto mb-12 text-2xl lg:mb-20 lg:text-2xl">
          Kaption was founded with a passion for data-driven insights, customer
          experience, and customer feedback.
        </p>
      </section>

      <div
        class="mx-auto my-32 max-w-7xl gap-10 rounded-md px-4 py-12 shadow-lg ring-1 ring-black/10 md:grid md:grid-cols-12 md:px-20 lg:px-12"
      >
        <div class="relative md:col-span-6">
          <div class="">
            <p class="mb-3 text-3xl font-extrabold x-font-title">
              Backstory
            </p>
            <div class="text-theme-500 space-y-5 text-2xl">
              <p class="mt-5">
                The frustrations that led to Kaption came from working online
                and wishing there was a better way to understand the experience
                and unmet needs of customers.
              </p>
            </div>
          </div>
        </div>
        <div class="md:col-start-8 md:col-end-13">
          <div
            v-for="member in team"
            :key="member.name"
            class="group block shrink-0"
          >
            <div class="flex space-x-4">
              <div class="" />
              <div class="ml-3">
                <ElAvatar
                  class="float-right inline-block h-16 w-16 rounded-full"
                  :email="member.email"
                />
                <p class="text-3xl font-bold x-font-title">
                  {{ member.name }}
                </p>
                <p class="text-xl font-medium">
                  {{ member.title }}
                </p>
                <div class="my-4">
                  {{ member.content }}
                </div>
                <ul v-if="member.social" class="flex space-x-5">
                  <li v-for="(item, ii) in member.social" :key="ii">
                    <a
                      :href="item.link"
                      class="inline-flex space-x-2 text-primary-500 hover:text-primary-400"
                      target="_blank"
                    >
                      <span>{{ item.name }} &rarr;</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ElemDirections />
    </div>
  </div>
</template>
