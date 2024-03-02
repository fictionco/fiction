<script setup lang="ts">
import type { FactorUser } from '@factor/api'
import { useMeta, useService, vue } from '@factor/api'
import ElButton from '@factor/ui/ElButton.vue'
import ElBadge from '@factor/ui/ElBadge.vue'
import ElLine from './ElLine.vue'
import PressLogos from './ElPressLogos.vue'
import SiteWrapDark from './SiteWrapDark.vue'
import FigureHome from './FigureHome.vue'

useService<{ factorUser: FactorUser }>()

useMeta({
  title: 'PageLines - Custom ChatGPT for Your Website',
  meta: [
    {
      name: `description`,
      content: `Make your website conversational with PageLines.`,
    },
  ],
})
const items = vue.computed(() => {
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
  <SiteWrapDark>
    <div class="">
      <main>
        <!-- Hero section -->
        <div class="relative isolate overflow-hidden">
          <ElLine
            class="pb-24 pt-10"
            icon="i-heroicons-chat-bubble-oval-left"
            icon-top="h-48"
          >
            <div class="lg:flex">
              <div
                class="mx-auto max-w-2xl shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8"
              >
                <div class="mt-8">
                  <div
                    class="text-primary-200 border-primary-500 bg-primary-950 inline-block rounded-full border px-4 py-1.5 text-xs font-semibold md:text-sm"
                  >
                    The Future of Websites is Conversational
                  </div>
                </div>
                <h1
                  class="font-brand mt-10 text-4xl font-semibold tracking-tight text-white sm:text-7xl"
                >
                  Custom ChatGPT
                  <span class="text-theme-500 italic">for</span> Your Website
                </h1>
                <p
                  class="font-brand text-theme-600 mt-6 text-lg font-medium leading-normal md:text-2xl"
                >
                  Add smart ChatGPT powered chat, search, and user assistance
                  that helps customers and enhances content.
                </p>
                <div class="mt-10 flex items-center gap-x-6">
                  <ElButton
                    to="/auth/register"
                    btn="primary"
                    size="lg"
                    class="border-primary-400 hover:border-primary-300 px-6 py-3"
                  >
                    Get Started Free &#8599;
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
          </ElLine>
        </div>

        <ElLine icon="i-heroicons-beaker">
          <div class=" ">
            <h2 class="mb-8">
              <ElBadge>Demo</ElBadge>
            </h2>

            <h2
              class="font-brand mt-2 text-3xl font-semibold tracking-tight text-white"
            >
              Try the AI Assistant
            </h2>

            <div
              class="mt-8 items-center space-y-4 md:inline-flex md:space-x-8 md:space-y-0 md:text-left"
            >
              <button
                type="button"
                class="bg-primary-500 hover:bg-primary-400 focus-visible:outline-primary-500 rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                data-pl-agent-id="cb1443231434603664721"
                data-pl-mode="slideover"
                data-pl-trigger="click"
              >
                Launch Assistant Demo
              </button>
            </div>
          </div>
        </ElLine>

        <ElLine icon="i-heroicons-newspaper">
          <PressLogos class="py-12" />
        </ElLine>

        <!-- Feature section -->
        <ElLine class="mt-32" icon="i-heroicons-sparkles">
          <div class="max-w-3xl">
            <h2 class="mb-8">
              <ElBadge>Crawl Your Website and Links</ElBadge>
            </h2>

            <p
              class="font-brand mt-2 text-3xl font-semibold tracking-tight text-white sm:text-7xl"
            >
              Custom AI Trained for <span>Each Business</span>
            </p>
            <p class="mt-6 text-lg leading-8 text-gray-300">
              Add custom data, or crawl websites to train agents for specific
              tasks. It can answer questions about products, services, and more.
            </p>
          </div>
          <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl
              class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3"
            >
              <div
                v-for="(item, i) in items"
                :key="i"
                class="bg-theme-50 border-theme-200 flex flex-col rounded-xl border p-4 md:p-8"
              >
                <dt class="font-brand text-2xl font-semibold leading-7">
                  <div
                    class="bg-theme-200 text-theme-900 mb-6 flex h-10 w-10 items-center justify-center rounded-lg"
                  >
                    <div class="text-2xl" :class="item.icon" />
                  </div>
                  {{ item.name }}
                </dt>
                <dd
                  class="text-theme-400 mb-4 mt-2 flex flex-auto flex-col text-base leading-7"
                >
                  <p
                    v-for="(pnt, ii) in item.desc"
                    :key="ii"
                    class="flex-auto"
                  >
                    {{ pnt }}
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </ElLine>

        <!-- Stats -->
        <ElLine
          class="my-240"
          icon="i-heroicons-chart-bar"
          icon-top="h-40"
        >
          <div class="py-24 sm:py-32">
            <div class="max-w-2xl lg:mx-0 lg:max-w-xl">
              <ElBadge class="mb-4">
                <h2>The Smart Website Revolution</h2>
              </ElBadge>
              <p
                class="font-brand mt-2 text-3xl font-bold tracking-tight text-white sm:text-6xl"
              >
                Enhancing 15,000+ Experiences a Day
              </p>
              <p class="font-brand mt-6 text-3xl">
                PageLines helps enhance the product experience thousands users a
                day across a variety of industries.
              </p>
            </div>
            <dl
              class="o mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-white sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3"
            >
              <div class="flex flex-col gap-y-3 border-r border-white/10 pl-6">
                <dt class="text-theme-600 text-sm">
                  Businesses Using PageLines
                </dt>
                <dd
                  class="font-brand order-first text-7xl font-semibold tracking-tight"
                >
                  820+
                </dd>
              </div>
              <div class="flex flex-col gap-y-3 border-r border-white/10 pl-6">
                <dt class="text-theme-600 text-sm">
                  Daily requests
                </dt>
                <dd
                  class="font-brand order-first text-7xl font-semibold tracking-tight"
                >
                  15,200
                </dd>
              </div>

              <div class="flex flex-col gap-y-3 border-r border-white/10 pl-6">
                <dt class="text-theme-600 text-sm">
                  Agents deployed
                </dt>
                <dd
                  class="font-brand order-first text-7xl font-semibold tracking-tight"
                >
                  1,850+
                </dd>
              </div>
            </dl>
          </div>
        </ElLine>

        <!-- CTA section -->
        <ElLine class="relative isolate mt-32" icon="i-heroicons-cog">
          <div class=" ">
            <div
              class="from-theme-50 to-theme-0 border-theme-200 rounded-xl border bg-gradient-to-br p-8 md:p-32"
            >
              <div class="max-w-screen-sm">
                <h2
                  class="font-brand text-3xl font-semibold tracking-tight text-white sm:text-5xl"
                >
                  The Era of Smart Websites has Begun
                </h2>
                <p class="font-brand mt-6 max-w-2xl text-xl md:text-3xl">
                  The era of smart, conversational websites is here. Create an
                  account to explore how PageLines will help your business.
                </p>
                <div class="mt-10 flex items-center gap-x-6">
                  <ElButton
                    to="/auth/register"
                    btn="primary"
                    class="border-primary-400 hover:border-primary-300 px-6 py-3 text-base"
                  >
                    Get My Account
                  </ElButton>
                </div>
              </div>
            </div>
          </div>
        </ElLine>
      </main>
    </div>
    <template #bg />
  </SiteWrapDark>
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
