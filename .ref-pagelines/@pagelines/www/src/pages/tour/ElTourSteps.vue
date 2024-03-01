<script setup lang="ts">
import { vue } from '@factor/api'
import ContentBox from '@fiction/core/ui/ContentBox.vue'
import FigureServer from './tour-figures/FigureServer.vue'
import FigureTrain from './tour-figures/FigureTrain.vue'
import FigureShare from './tour-figures/FigureShare.vue'

const steps = [
  {
    key: 'launch',
    sup: 'Step 1:',
    title: 'Add Your Url or Text',
    description:
      'Start by creating an AI agent and selecting its application. Add your website URL or text data to train your AI agent.',
    figure: FigureServer,
    actionText: 'Start Free',
    animateTrigger: vue.ref(false),
    icon: 'i-heroicons-link',
    iconColor: 'bg-primary-600 text-primary-50',
  },
  {
    key: 'train',
    sup: 'Step 2:',
    title: 'Personalize',
    description:
      'Adjust your AI agent\'s design and details. Control its personality by changing the base prompt, change from multiple templates.',
    figure: FigureTrain,
    actionText: 'Start Free',
    animateTrigger: vue.ref(false),
    icon: 'i-heroicons-chat-bubble-bottom-center-text',
    iconColor: 'bg-emerald-500 text-emerald-50',
  },
  {
    key: 'automate',
    sup: 'Step 3:',
    title: 'Add To Site',
    description:
      'You can add your AI agent to your website or CMS. You can also use PageLines API to integrate with your favorite tools.',
    figure: FigureShare,
    actionText: 'Start Free',
    animateTrigger: vue.ref(true),
    icon: 'i-heroicons-arrow-down-on-square',
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
      <div class="font-brand text-2xl font-bold tracking-tight md:text-6xl">
        How It Works
      </div>
    </div>
    <div class="mx-auto grid max-w-screen-xl grid-cols-1 gap-4">
      <div
        v-for="(item, i) in steps"
        :key="i"
        class="border-theme-200 relative overflow-hidden border-b"
        :class="`feature-${item.key}`"
      >
        <div class="mx-auto flex max-w-3xl gap-8 p-5 pb-4 md:p-12">
          <div>
            <div
              class="text-theme-300 font-sans text-base font-semibold uppercase tracking-widest"
            >
              {{ item.sup }}
            </div>
            <div
              class="font-brand text-2xl font-bold tracking-tight md:text-4xl"
              v-html="item.title"
            />
            <div class="font-brand my-4 text-xl font-medium md:text-2xl">
              {{ item.description }}
            </div>
          </div>
          <div>
            <div
              class="bg-theme-200 text-theme-400 mt-1 flex items-center justify-center rounded-full p-4"
            >
              <div class="text-4xl" :class="item.icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </ContentBox>
</template>

<style lang="less"></style>
