<script setup lang="ts">
import type { FactorUser } from '@factor/api'
import { useMeta, useService, vue } from '@factor/api'
import ElButton from '@factor/ui/ElButton.vue'
import PressLogos from './ElPressLogos.vue'
import SiteWrap from './SiteWrap.vue'
import FigureHome from './FigureHome.vue'

useService<{ factorUser: FactorUser }>()

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
                  <span class="">AI for Websites</span></span>
              </div>
            </div>
            <h1
              class="font-brand mt-10 text-4xl font-semibold tracking-tight sm:text-7xl"
            >
              What if your website could talk...
            </h1>
            <div
              class="font-brand mt-6 space-y-6 text-lg font-medium md:text-2xl"
            >
              <p>
                Find out with PageLines AI. Add personalized chatbots to your website and increase retention while
                reducing support requests.
                <span class="text-theme-400 mt-2 block">Syncs data with any URL or existing help center
                </span>
              </p>
            </div>

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

<style lang="less">
:root {
  --adjust-right: rotateY(4deg) rotateX(0deg) rotateZ(0deg);
  --adjust-left: rotateY(-7deg) rotateX(0deg) rotateZ(0deg);
}
.stage {
  perspective: 800px;
}
.app-adjust-left {
  transform: var(--adjust-left);
}
.app-adjust-right {
  transform: var(--adjust-right);
}
.slideIn-enter-from,
.slideOut-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
.slideIn-enter-to,
.slideIn-leave-from,
.slideOut-enter-to,
.slideOut-leave-from {
  transform: translateX(0);
}
.slideIn-enter-active,
.slideIn-leave-active,
.slideOut-enter-active,
.slideOut-leave-active {
  transition: 0.2s ease;
  transition-property: opacity, transform;
}

.slideIn-leave-to,
.slideOut-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.homepage {
  --shadow-color: 0deg 0% 0%;
  --shadow-elevation-low: 0.1px 0.5px 0.6px hsl(var(--shadow-color) / 0.27),
    0.2px 0.8px 0.9px -1.4px hsl(var(--shadow-color) / 0.26),
    0.5px 1.9px 2.1px -2.7px hsl(var(--shadow-color) / 0.24);
  --shadow-elevation-medium: 0.1px 0.5px 0.6px hsl(var(--shadow-color) / 0.29),
    0.4px 1.5px 1.7px -0.9px hsl(var(--shadow-color) / 0.27),
    1px 3.9px 4.4px -1.8px hsl(var(--shadow-color) / 0.26),
    2.4px 9.5px 10.7px -2.7px hsl(var(--shadow-color) / 0.25);
  --shadow-elevation-high: 0.1px 0.5px 0.6px hsl(var(--shadow-color) / 0.07),
    0.6px 2.3px 2.6px -0.4px hsl(var(--shadow-color) / 0.06),
    1.1px 4.2px 4.7px -0.8px hsl(var(--shadow-color) / 0.05),
    1.8px 6.9px 7.8px -1.2px hsl(var(--shadow-color) / 0.05),
    2.8px 11.1px 12.4px -1.6px hsl(var(--shadow-color) / 0.04),
    4.5px 17.6px 19.8px -2px hsl(var(--shadow-color) / 0.04),
    6.8px 27px 30.3px -2.4px hsl(var(--shadow-color) / 0.03),
    10.1px 39.9px 44.8px -2.7px hsl(var(--shadow-color) / 0.02);
}
.screenshot-shadow {
  box-shadow: var(--shadow-elevation-high);
}
.wrap-shadow {
  box-shadow: var(--shadow-elevation-medium);
}
</style>
