<script setup lang="ts">
import { useMeta, vue } from '@factor/api'
import ElButton from '@factor/ui/ElButton.vue'
import PressLogos from './ElPressLogos.vue'
import SiteWrap from './SiteWrap.vue'
import FigureHome from './FigureHome.vue'

useMeta({
  title: 'PageLines - Custom ChatGPT for Websites',
  meta: [
    {
      name: `description`,
      content: `Make your website conversational with PageLines.`,
    },
  ],
})
const _items = vue.computed(() => {
  return [
    {
      icon: 'i-heroicons-hand-thumb-up',
      name: 'Improve Your Site',
      desc: [
        'Instant 24/7 response to customer queries enhances customer satisfaction and reduces friction.',
      ],
    },
    {
      icon: 'i-heroicons-bolt',
      name: 'Visitor Experience',
      desc: [
        'Reduce the need for human support staff by handling repetitive queries with AI.',
      ],
    },
    {
      icon: 'i-heroicons-banknotes',
      name: 'Less Friction',
      desc: [
        'Aid customers through their buying journey by providing real-time support and information.',
      ],
    },
  ]
})
</script>

<template>
  <SiteWrap>
    <!-- Hero section -->
    <div class="relative isolate overflow-hidden">
      <div
        class="mx-auto max-w-7xl px-4 pb-24 pt-10 lg:px-8"
        icon="i-heroicons-chat-bubble-oval-left"
        icon-top="h-48"
      >
        <div class="lg:flex">
          <div class="mx-auto max-w-2xl shrink-0 lg:mx-0 lg:max-w-2xl lg:pt-8">
            <div class="mt-8">
              <div
                class="text-theme-400 relative inline-flex items-center gap-x-2 rounded-full py-1 text-xs font-bold uppercase tracking-wider"
              >
                <span class="text-theme-600"><span class="text-theme-300 mr-2">PageLines &rarr;</span>
                  <span class="">Tour</span></span>
              </div>
            </div>
            <h1
              class="font-brand mt-10 text-4xl font-semibold tracking-tight sm:text-7xl"
            >
              Turn Your Website Into a 24/7 User Assistant
            </h1>
            <p
              class="font-brand mt-6 text-lg font-medium leading-normal md:text-2xl"
            >
              Easily train and personalize ChatGPT chatbots with your own data
              and website content.
              <span class="text-theme-400 mt-2 block">Just enter your URL to get started.</span>
            </p>
            <div class="mt-10 flex items-center gap-x-6">
              <ElButton
                to="/auth/register"
                btn="primary"
                size="lg"
                class="px-6 py-3 text-xl"
                rounded="lg"
              >
                Create Account &rarr;
              </ElButton>
              <ElButton
                to="/tour"
                btn="default"
                size="lg"
                rounded="lg"
                class="border-primary-400 hover:border-primary-300 bg-theme-50 hidden px-6 py-3 text-xl"
              >
                View Tour
              </ElButton>
            </div>
          </div>
          <div
            class="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32"
          >
            <div class="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <FigureHome class="w-[76rem]" />
            </div>
          </div>
        </div>
      </div>
      <PressLogos class="py-12" />
    </div>
  </SiteWrap>
</template>

<style lang="less"></style>
