<script setup lang="ts">
import type { FactorUser } from '@factor/api'
import { useMeta, vue } from '@factor/api'
import PressLogos from '@fiction/core/ui/PressLogos.vue'
import VideoThumbs from '@fiction/core/ui/VideoThumbs.vue'
import ElButton from '@fiction/core/ui/ElButton.vue'
import screen from '@fiction/core/img/screenshot-render.svg'
import screen2 from '@fiction/core/img/screen-webui.svg'
import FigureGenAvatar from '../figures/GenAvatar.vue'
import FigureTrainProgress from './tour-figures/TrainProgress.vue'

const { factorUser } = useService<{ factorUser: FactorUser }>()

useMeta({
  title: 'AI Generated Images and Media',
  meta: [
    {
      name: `description`,
      content: `Professional AI generated images, videos and audio. Fiction is a platform for AI Generated Media. Install apps to create avatars, animations, models, and more.`,
    },
  ],
})

const features = [
  {
    key: 'avatar',
    title: 'Insanely Awesome Mockups, Avatars, Animations, and More',
    description: 'AI generated designs, avatars and mockups made easy.',
    figure: FigureGenAvatar,
    beforeImages: ['avatar-before-1'],
    afterImages: ['avatar-after-1', 'avatar-after-2'],
    actionText: 'Upload Your Photos',
    animateTrigger: vue.ref(false),
  },
  {
    key: 'train',
    title: 'The easiest way to train models for professional media.',
    description: 'Fiction\'s tools are power and control made easy. ',
    figure: FigureTrainProgress,
    beforeImages: ['yeti-before'],
    afterImages: ['yeti-after-1', 'yeti-after-2'],
    actionText: 'Upload Your Photos',
    animateTrigger: vue.ref(false),
  },

  {
    key: 'share',
    title: 'Collaborate and Promote with Collections and Galleries',
    description:
      'Collaborate on AI generated designs. Promote and get feedback.',
    figure: FigureGenAvatar,
    beforeImages: ['interior-before'],
    afterImages: ['interior-after-1', 'interior-after-2'],
    actionText: 'Upload Your Photos',
    animateTrigger: vue.ref(true),
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
  <PageWrap2 class="homepage bg-gradient-to-b from-white via-white to-slate-50">
    <div class="my-12">
      <div class="z-50 mx-auto max-w-screen-xl py-16">
        <div class="px-4 lg:flex">
          <div class="w-full lg:mr-[3%] lg:w-[53%]">
            <div class="mb-6 hidden">
              <RouterLink
                class="from-primary-400 to-primary-400 text-theme-0 inline-block rounded-full bg-gradient-to-br px-4 py-1 text-xs font-bold uppercase tracking-wider"
                to="/tour"
              >
                Generate to Match Your Brands ↘︎
              </RouterLink>
            </div>
            <h2
              class="text-theme-800 text-3xl font-extrabold tracking-tighter md:text-7xl"
            >
              One Concept,
              <div
                class="from-theme-800 to-theme-300 bg-gradient-to-r bg-clip-text pr-2 text-transparent"
              >
                Infinite Possibilities
              </div>
            </h2>
            <div
              class="sub text-theme-300 my-8 max-w-2xl text-lg font-semibold md:text-2xl"
            >
              <span class="text-theme-700 font-semibold tracking-tight"><h1 class="font-bold">
                                                                          Fiction is a platform for
                                                                          <span
                                                                            class="from-primary-600 to-primary-400 bg-gradient-to-b bg-clip-text text-transparent"
                                                                          >
                                                                            AI Generated Media</span>.
                                                                        </h1>
                <span class="text-theme-400">Install apps to create avatars, animations, models, and
                  more.</span>
              </span>
            </div>
            <div
              class="mt-12 flex max-w-md flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0 md:max-w-xl"
            >
              <ElButton
                class="px-6 py-3 text-base font-semibold md:text-xl"
                btn="primary"
                href="https://studio.fiction.com/register"
              >
                Try It Free &rarr;
              </ElButton>
              <ElButton
                class="space-x-2 px-6 py-3 text-base font-semibold md:text-xl"
                btn="default"
                to="/tour"
              >
                <div>Take the Tour</div>
              </ElButton>
            </div>
            <div class="mt-16 justify-between space-y-8">
              <div class="text-theme-600 max-w-screen-xl">
                <VideoThumbs />
              </div>
            </div>
          </div>
          <div
            class="relative col-span-12 -mt-0 hidden aspect-[7/6] w-full min-w-0 lg:-mr-32 lg:block lg:h-auto lg:w-[40%]"
          >
            <div class="stage relative inset-0 h-[75%] w-full lg:top-16">
              <img
                :src="screen2"
                class="app-adjust-right screenshot-shadow absolute bottom-0 left-0 z-10 w-[30%] rounded-lg lg:w-[38%]"
              >
              <img
                :src="screen"
                class="app-adjust-left screenshot-shadow absolute bottom-8 left-0 w-[65%] !max-w-none rounded-lg lg:w-[120%]"
              >
            </div>
          </div>
        </div>
      </div>

      <div class="relative hidden overflow-hidden">
        <div class="mx-auto max-w-screen-xl py-12">
          <div
            class="relative z-10 mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-8 md:grid-cols-12"
          >
            <div
              v-for="(item, i) in features"
              :key="i"
              class="col-span-4 flex flex-col justify-between rounded-lg"
              :class="`feature-${item.key}`"
            >
              <div class="flex flex-col">
                <component :is="item.figure" v-if="item.figure" />
              </div>
              <div class="px-6 pb-6">
                <div class="text-2xl font-bold tracking-tight">
                  {{ item.title }}
                </div>
                <div class="text-theme-600 mt-4 text-xl">
                  {{ item.description }}
                  <RouterLink
                    to="/"
                    class="text-primary-500 hover:text-primary-700"
                  >
                    More &rarr;
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="z-50 mx-auto mt-8 max-w-screen-xl px-4">
        <div class="justify-between space-y-8">
          <div
            class="text-theme-500 max-w-screen-xl items-center justify-center space-x-6 md:text-center"
          >
            <PressLogos />
          </div>
        </div>
      </div>
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
