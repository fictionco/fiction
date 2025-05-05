<script lang="ts" setup>
import type { AuthPageUserConfig } from '@fiction/admin/dashboard/templates'
import type { Card } from '@fiction/site/card'
import { vue } from '@fiction/core'
import XMedia from '@fiction/ui/media/XMedia.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<AuthPageUserConfig>>, required: true },
  quote: { type: Object as vue.PropType<{ text: string, author: string }>, default: () => ({ quote: '', author: '' }) },
})
const uc = vue.computed(() => props.card.userConfig.value)
</script>

<template>
  <div class="auth-wrap relative flex overflow-hidden">
    <!-- <div
      class="relative hidden w-[38.2%] overflow-hidden bg-gradient-to-br from-primary-975/30 via-primary-975/20 to-primary-975/30 text-primary-0 border-r border-primary-950 lg:block"
    >
      <a class="relative z-20 p-8 block" :href="uc.homeUrl">
        <XMedia :media="uc.logo" class="h-6 inline-block" />
      </a>

      <div class="z-40 absolute bottom-16 w-full flex justify-center">
        <blockquote v-if="quote.text" class="mx-auto max-w-xs text-right text-balance">
          <p class="text-lg lg:text-4xl x-font-title font-bold tracking-tight text-pretty">
            "{{ quote.text }}"
          </p>
          <footer v-if="quote.author" class="text-base lg:text-lg mt-2 text-primary-500 dark:text-primary-400">
            &mdash; <cite>{{ quote.author }}</cite>
          </footer>
        </blockquote>
      </div>

      <AnimGradientBg
        class="absolute inset-0"
        color1="blue"
        :color1-scale="700"
        color2="gray"
        :color2-scale="1000"
        :speed="500"
      />
    </div> -->
    <div class="relative flex min-h-screen grow flex-col items-center shrink-0">
      <div class="relative basis-0 grow">
        <div
          class="relative mx-auto flex items-center justify-between px-4 py-2 text-xs md:max-w-7xl"
        >
          <div class="mt-2 text-center">
            <XMedia :media="uc.logo" class="h-6" />
          </div>
        </div>
      </div>
      <div
        class="relative z-20 mx-auto flex w-full grow flex-col justify-center"
      >
        <div class="auth-form transition-all">
          <div
            class="mx-auto w-full max-w-xs rounded-lg px-4"
          >
            <div class="relative">
              <slot />
            </div>
          </div>
        </div>
      </div>
      <div class="basis-0 grow" />
    </div>
  </div>
</template>
