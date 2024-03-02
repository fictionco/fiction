<script setup lang="ts">
import type { FactorUser } from '@factor/api'
import { useService, vue } from '@factor/api'
import ContentBox from '@fiction/core/ui/ContentBox.vue'
import FigureServer from './tour-figures/FigureServer.vue'
import FigureRender from './tour-figures/FigureRender.vue'
import FigureTrain from './tour-figures/FigureTrain.vue'
import FigureShare from './tour-figures/FigureShare.vue'

useService<{ factorUser: FactorUser }>()

const steps = [
  {
    key: 'launch',
    sup: 'Step 1:',
    title: 'Launch Your Dedicated AI Server',
    description:
      'All the magic happens on a custom server built just for you. Your own high performance AI engine.',
    figure: FigureServer,
    actionText: 'Upload Your Photos',
    animateTrigger: vue.ref(false),
  },
  {
    key: 'train',
    sup: 'Step 2:',
    title: 'Train Your Model(s)',
    description:
      'Training models used to be tough, not anymore! Fiction allows you to point-and-click your way to a trained model in seconds.',
    figure: FigureTrain,
    actionText: 'Upload Your Photos',
    animateTrigger: vue.ref(false),
  },

  {
    key: 'render',
    sup: 'Step 3:',
    title: 'Render Photos and Media',
    description:
      'With your custom models you can now render photos and videos of your concepts. You won\'t believe what the AI can do.',
    figure: FigureRender,
    actionText: 'Upload Your Photos',
    animateTrigger: vue.ref(true),
  },
  {
    key: 'share',
    sup: 'Step 4:',
    title: 'Share Your Galleries and Collections',
    description:
      'Select the best photos and videos for your collections. Share your galleries with friends and colleagues.',
    figure: FigureShare,
    actionText: 'Upload Your Photos',
    animateTrigger: vue.ref(true),
  },
] as const

vue.onMounted(() => {
  steps.forEach((f) => {
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
  <ContentBox>
    <div class="py-6 text-center lg:pb-6 lg:pt-16">
      <div class="text-2xl font-extrabold tracking-tight md:text-5xl">
        How It Works
      </div>
    </div>
    <div class="mx-auto grid max-w-screen-xl grid-cols-1 gap-4 md:grid-cols-2">
      <div
        v-for="(item, i) in steps"
        :key="i"
        class="border-theme-200 relative overflow-hidden border-b"
        :class="`feature-${item.key}`"
      >
        <div class="max-w-screen-md p-5 pb-4 md:p-12">
          <div
            class="text-theme-400 text-lg font-extrabold uppercase tracking-wider"
          >
            {{ item.sup }}
          </div>
          <div class="text-2xl font-extrabold tracking-tight md:text-3xl">
            {{ item.title }}
          </div>
          <div class="text-theme-500 my-4 text-xl font-medium md:text-2xl">
            {{ item.description }}
          </div>
        </div>
        <div>
          <component :is="item.figure" />
        </div>
      </div>
    </div>
  </ContentBox>
</template>

<style lang="less"></style>
