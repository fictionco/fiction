<script lang="ts" setup>
import { useMeta, vue } from '@factor/api'
import ElButton from '@fiction/core/ui/ElButton.vue'
import PageWrap from '../el/PageWrap.vue'

const metaTitle = 'Contact and Support'

const metaDescription = ' '

useMeta({
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

interface PageItem {
  title: string
  description: string
  path?: string
  icon?: string
  button?: { text: string, href?: string, to?: string }
}

const channels = vue.ref<PageItem[]>([
  {
    title: 'Email',
    description: 'Need something specific?',
    path: '/contact',
    icon: `i-carbon-email`,
    button: {
      text: 'Email',
      href: 'mailto:hello@fiction.com',
    },
  },
  {
    title: 'Direct Message',
    description: 'Send a direct message',
    icon: `i-carbon-chat-launch`,
    button: {
      text: 'Message Us on WhatsApp',
      href: 'https://wa.me/message/JBDCYHNGGJBGB1',
    },
  },
  {
    title: 'Forum',
    description: 'For everything else...',
    icon: `i-carbon-chat`,
    button: {
      text: 'Support Forum',
      href: 'https://forum.fiction.com',
    },
  },
  //   {
  //     title: "Community Channels",
  //     description:
  //       "Join the community chat channels to discuss and get help from us as well as members of the Kaption community.",
  //     button: {
  //       text: "Join Slack Channel",
  //       href: "#",
  //     },

  //     icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
  // </svg>`,
  //   },
])
</script>

<template>
  <PageWrap class="">
    <main>
      <!-- Header -->
      <div class="">
        <div class="py-24">
          <div
            class="relative z-10 mx-auto max-w-7xl pl-4 pr-8 text-center sm:px-6 lg:px-8"
          >
            <h1
              class="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Contact Fiction
            </h1>
            <p class="text-theme-500 mx-auto mt-6 max-w-2xl text-2xl">
              Looking forward to hearing from you!
            </p>
          </div>
        </div>
      </div>
      <div class="my-24">
        <!-- Cards -->
        <section
          class="relative z-10 mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8"
          aria-labelledby="contact-heading"
        >
          <h2 id="contact-heading" class="sr-only">
            Contact us
          </h2>
          <div
            class="grid grid-cols-1 gap-y-20 lg:grid-cols-3 lg:gap-y-0 lg:gap-x-8"
          >
            <div
              v-for="(channel, i) in channels"
              :key="i"
              class="channel-shadow bg-theme-800 text-theme-0 flex flex-col rounded-2xl p-8 ring ring-black/10"
            >
              <div class="relative flex-1">
                <div class="text-theme-500 h-12 w-12">
                  <div class="text-5xl" :class="channel.icon" />
                </div>
                <h3 class="mt-4 text-2xl font-bold">
                  {{ channel.title }}
                </h3>
                <p class="text-theme-500 mt-4 text-xl">
                  {{ channel.description }}
                </p>
              </div>
              <div v-if="channel.button" class="mt-6 text-left">
                <ElButton
                  class="min-w-[150px] justify-center py-3 px-8 text-base font-semibold md:text-lg"
                  btn="default"
                  :target="channel.button.href ? '_blank' : ''"
                  :href="channel.button.href"
                  :to="channel.button.to"
                >
                  {{ channel.button.text }}
                </ElButton>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </PageWrap>
</template>

<style lang="less">
.channel-shadow {
  box-shadow: var(--cardShadowSmall);
}
</style>
