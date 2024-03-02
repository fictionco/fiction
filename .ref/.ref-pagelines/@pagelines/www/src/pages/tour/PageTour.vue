<script setup lang="ts">
import { useMeta, vue } from '@factor/api'
import ElButton from '@factor/ui/ElButton.vue'
import ContentBox from '@fiction/core/ui/ContentBox.vue'
import SplashFigure from '../figures/SplashFigure.vue'
import SiteWrap from '../SiteWrap.vue'
import ElTourSteps from './ElTourSteps.vue'
import ElBenefits from './ElBenefits.vue'

useMeta({
  title: 'PageLines Tour - How it works',
  meta: [
    {
      name: `description`,
      content: `How PageLines works.`,
    },
  ],
})

const features = [
  {
    key: 'contacts',
    title: 'Quickly Answer Questions',
    description:
      'Reduce your support workload with a 24/7 AI assistant. 72% of customers questions can be answered by a bot.',
    figure: SplashFigure,
    format: 'banner',
    animateTrigger: vue.ref(false),
  },
] as const

vue.onMounted(() => {
  features.forEach((f) => {
    const el = document.querySelector(`.feature-${f.key}`) as HTMLElement

    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          f.animateTrigger.value = true
          setTimeout(() => {
            f.animateTrigger.value = false
            observer.unobserve(el)
          }, 2000)
        }
      },
      { threshold: 0.3 },
    )
    if (el)
      observer.observe(el)
  })
})
</script>

<template>
  <SiteWrap class="homepage">
    <div class="space-y-12 px-4">
      <ContentBox wrap-class="p-8 md:p-16 overflow-hidden">
        <div class="relative isolate px-6 pt-14 lg:px-8">
          <div class="mx-auto max-w-2xl">
            <div class="hidden sm:mb-8 sm:flex sm:justify-center">
              <div
                class="text-theme-400 relative inline-flex items-center gap-x-2 rounded-full py-1 text-xs font-bold uppercase tracking-wider"
              >
                <span class="text-theme-600"><span class="text-theme-300 mr-2">PageLines &rarr;</span>
                  <span class="">Tour</span></span>
              </div>
            </div>
            <div class="text-center">
              <h1
                class="font-brand text-4xl font-bold tracking-tight sm:text-6xl"
              >
                Imagine a website that can
                <span class="under italic">talk to your users</span>
              </h1>
              <p class="font-brand mt-6 text-2xl">
                Train ChatGPT to know your company docs and content. Then
                personalize it to create a 24/7 employee that answers questions,
                provides support, and guide your visitors.
              </p>
              <div class="mt-10 flex items-center justify-center gap-x-6">
                <ElButton btn="primary" href="/auth/register">
                  Create Account &rarr;
                </ElButton>
              </div>
            </div>
          </div>
        </div>

        <ElBenefits />
      </ContentBox>
      <ElTourSteps />
      <ContentBox
        v-for="(item, i) in features"
        :key="i"
        wrap-class="relative overflow-hidden"
        :class="`feature-${item.key}`"
      >
        <div
          class="relative z-10 grid grid-cols-1"
          :class="item.format === 'banner' ? '' : 'lg:grid-cols-2 lg:gap-8'"
        >
          <div class="relative">
            <component :is="item.figure" :feature-id="item.key" />
          </div>
          <div
            :class="
              item.format === 'banner'
                ? 'px-4 lg:px-12 pb-4 lg:pb-12 text-center max-w-4xl mx-auto'
                : 'px-4 lg:py-24 lg:pl-0 lg:pr-16'
            "
          >
            <div
              class="font-brand text-2xl font-bold tracking-tight lg:text-5xl"
              v-html="item.title"
            />
            <div
              class="font-brand my-4 text-xl font-medium tracking-tight lg:text-3xl"
            >
              {{ item.description }}
            </div>
          </div>
        </div>
      </ContentBox>

      <ContentBox scheme="dark" wrap-class="p-24">
        <div class="text-center lg:pb-12">
          <div class="font-brand text-2xl font-bold tracking-tight lg:text-5xl">
            AI for Websites
          </div>
          <div
            class="text-theme-400 font-brand my-4 text-xl font-medium lg:text-3xl"
          >
            AI-first enhancements for professional websites.
          </div>
        </div>
        <div class="flex justify-center">
          <ElButton
            class="px-6 py-3 text-base font-semibold lg:text-xl"
            btn="default"
            target="_blank"
            href="/auth/register"
          >
            Create Your Account &rarr;
          </ElButton>
        </div>
      </ContentBox>
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
