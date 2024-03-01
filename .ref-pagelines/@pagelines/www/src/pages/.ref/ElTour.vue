<script setup lang="ts">
import VideoThumbs from '@fiction/core/ui/VideoThumbs.vue'
import { useMeta, vue } from '@factor/api'
import ElButton from '@fiction/core/ui/ElButton.vue'
import ElShowcaseGallery from '@fiction/core/ui/ElShowcaseGallery.vue'
import ContentBox from '@fiction/core/ui/ContentBox.vue'
import screen from '@fiction/core/img/screenshot-render.svg'
import screen2 from '@fiction/core/img/screen-webui.svg'
import EffectGrid from '@factor/ui/EffectGrid.vue'
import PageWrap2 from '../el/PageWrap2.vue'
import { useSiteService } from '../inject'
import FigureMultiConcept from './tour-figures/FigureMultiConcept.vue'
import FigureAvatars from './tour-figures/FigureAvatars.vue'
import FigureVideo from './tour-figures/FigureVideo.vue'
import FigureBrowser from './tour-figures/FigureBrowser.vue'
import ElTourSteps from './ElTourSteps.vue'
import ElBenefits from './ElBenefits.vue'

useSiteService()

useMeta({
  title: 'AI Photo and Avatar Generator | Fiction',
  meta: [
    {
      name: `description`,
      content: `Fiction helps you create custom AI avatars, mockups, and more. Upload your photos and get started.`,
    },
  ],
})

const features = [
  {
    key: 'avatar',
    title: 'AI Avatars the Professional Way',
    description:
      'Create avatars in as many styles as you can imagine. Create collections and share them.',
    figure: FigureAvatars,
    format: 'hero',
    animateTrigger: vue.ref(false),
  },

  {
    key: 'collections',
    title: 'Combine Concepts',
    description:
      'Merge and combine concepts to create new and useful results. Combine faces, styles, and motifs to expand your creativity.',
    figure: FigureMultiConcept,
    format: 'banner',
    animateTrigger: vue.ref(false),
  },
  {
    key: 'webui',
    title: 'Inpainting, Outpainting, Animation',
    description:
      'Your AI server comes with Stable Diffusion WebUI pre-installed. It\'s a powerful tool for inpainting, outpainting, and animation.',
    figure: FigureVideo,
    format: 'hero',
    animateTrigger: vue.ref(false),
  },
  {
    key: 'browser',
    title: 'Full Access to Your Files, Media, and Models',
    description:
      'Fiction provides you with a file browser to access your media and models. You can also upload and download files.',
    figure: FigureBrowser,
    format: 'hero',

    animateTrigger: vue.ref(false),
  },
  // {
  //   key: "multi",
  //   title: "Multi-Concept Training",
  //   description:
  //     "Train your models on multiple concepts at once. Combine faces, styles, and motifs to create new and exciting results.",
  //   figure: FigureAvatars,
  //   animateTrigger: vue.ref(false),
  // },
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
  <PageWrap2
    class="homepage text-theme-800 from-theme-100 to-theme-50 bg-gradient-to-br"
  >
    <div class="space-y-12 px-4">
      <ContentBox wrap-class="p-8 lg:p-20 overflow-hidden">
        <div class="relative grid-cols-12 gap-12 lg:grid">
          <div class="z-50 col-span-12 lg:col-span-7">
            <div class="max-w-8xl mx-auto my-8 text-left">
              <div class="text-3xl font-extrabold tracking-tight lg:text-7xl">
                A New Way to Generate

                <span
                  class="bg-gradient-to-br from-blue-500 to-blue-200 bg-clip-text py-1 text-transparent"
                >with AI
                </span>
              </div>
              <div
                class="sub text-theme-300 my-8 max-w-2xl text-xl font-normal lg:text-2xl"
              >
                <span class="text-theme-600 font-bold tracking-tight">Teach AI your concepts then use any prompt to render images
                  and media.
                </span>
              </div>
              <div class="mt-12 space-y-4 lg:flex lg:space-x-6 lg:space-y-0">
                <ElButton
                  class="px-6 py-3 text-base font-semibold lg:text-xl"
                  btn="primary"
                  href="https://studio.fiction.com/register"
                >
                  Create Your Account &rarr;
                </ElButton>
              </div>
            </div>
          </div>
          <div
            class="relative col-span-12 -mt-0 aspect-[7/6] min-w-0 pt-6 lg:col-span-5 lg:-mr-32 lg:h-auto"
          >
            <div class="stage relative inset-0 h-[90%] w-full lg:top-16">
              <img
                :src="screen2"
                class="app-adjust-right screenshot-shadow absolute bottom-0 left-0 z-10 w-[45%] rounded-lg lg:w-[38%]"
              >
              <img
                :src="screen"
                class="app-adjust-left screenshot-shadow absolute bottom-8 left-0 w-[85%] !max-w-none rounded-lg lg:w-[110%]"
              >
            </div>
          </div>
        </div>
        <ElBenefits />

        <div class="mt-16">
          <VideoThumbs class="light" />
        </div>
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
            <component :is="item.figure" />
          </div>
          <div
            :class="
              item.format === 'banner'
                ? 'px-4 lg:px-12 pb-4 lg:pb-12 text-center max-w-4xl mx-auto'
                : 'px-4 lg:py-24 lg:pl-0 lg:pr-16'
            "
          >
            <div
              class="text-2xl font-extrabold tracking-tight lg:text-5xl"
              v-html="item.title"
            />
            <div
              class="text-theme-500 my-4 text-xl font-medium tracking-tight lg:text-3xl"
            >
              {{ item.description }}
            </div>
          </div>
        </div>
      </ContentBox>
      <ContentBox wrap-class="p-5 lg:p-12">
        <div class="text-center lg:pb-12">
          <div class="text-2xl font-extrabold tracking-tight lg:text-5xl">
            Avatar Showcase
          </div>
          <div
            class="text-theme-500 my-4 text-xl font-medium tracking-tight lg:text-3xl"
          >
            Here are the latest avatars shared by Fiction users
          </div>
        </div>
        <ElShowcaseGallery />
      </ContentBox>
      <ContentBox scheme="dark" wrap-class="p-16">
        <div class="text-center lg:pb-12">
          <div class="text-2xl font-extrabold tracking-tight lg:text-5xl">
            Turn Imagination into Reality
          </div>
          <div
            class="text-theme-400 my-4 text-xl font-medium tracking-tight lg:text-3xl"
          >
            Fiction is free to try, and you can cancel at any time.
          </div>
        </div>
        <div class="flex justify-center">
          <ElButton
            class="px-6 py-3 text-base font-semibold lg:text-xl"
            btn="default"
            target="_blank"
            href="https://studio.fiction.com/register"
          >
            Create Your Account &rarr;
          </ElButton>
        </div>
      </ContentBox>
    </div>
    <div class="pointer-events-none fixed top-0 h-screen w-screen">
      <EffectGrid alt-color="bg-pink-500" mode="light" />
    </div>
  </PageWrap2>
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
