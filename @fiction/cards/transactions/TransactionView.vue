<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import { vue } from '@fiction/core'
import EffectShootingStar from '@fiction/ui/effect/EffectShootingStar.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'

export type UserConfig = { logo?: MediaObject, termsUrl?: string, privacyUrl?: string }
const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
  quote: { type: Object as vue.PropType<{ text: string, author: string }>, default: () => ({ quote: '', author: '' }) },
})
const uc = vue.computed(() => props.card.userConfig.value)
</script>

<template>
  <div class="auth-wrap relative flex overflow-hidden bg-white dark:bg-theme-950 dark:text-theme-0">
    <div
      class="relative hidden w-[38.2%] overflow-hidden bg-gradient-to-b from-theme-1000 via-theme-1000 to-theme-950  text-theme-0 border-r border-theme-700 lg:block"
    >
      <div class="relative z-20 p-8">
        <XMedia :media="uc.logo" class="h-6 inline-block" />
      </div>

      <div class="z-40 absolute bottom-16 w-full flex justify-center">
        <blockquote v-if="quote.text" class="mx-auto max-w-xs text-right text-balance">
          <p class="text-lg lg:text-xl x-font-title">
            "{{ quote.text }}"
          </p>
          <footer v-if="quote.author" class="text-theme-500 text-base lg:text-lg mt-2">
            &mdash; <cite>{{ quote.author }}</cite>
          </footer>
        </blockquote>
      </div>

      <EffectShootingStar class="absolute inset-0" />
    </div>
    <div class="relative flex min-h-screen grow flex-col items-center shrink-0">
      <div class="relative">
        <div
          class="relative mx-auto flex items-center justify-between px-4 py-2 text-xs md:max-w-7xl"
        >
          <div class="mt-2 text-center lg:hidden">
            <XMedia :media="uc.logo" class="h-6" />
          </div>
        </div>
      </div>
      <div
        class="relative z-20 mx-auto flex w-full grow flex-col justify-center"
      >
        <div class="auth-form pb-24 transition-all">
          <div
            class="mx-auto w-full max-w-xs rounded-lg"
          >
            <div class="relative px-4 py-12 lg:py-24">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
