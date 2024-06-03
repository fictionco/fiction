<script lang="ts" setup>
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import type { ActionItem } from '@fiction/core'
import InputActions from '@fiction/ui/inputs/InputActions.vue'
import { vue } from '@fiction/core'

const props = defineProps({
  loading: { type: Boolean, default: false },
  sending: { type: Boolean, default: false },
  icon: { type: String, default: '' },
  superHeading: { type: String, default: '' },
  heading: { type: String, default: '' },
  subHeading: { type: String, default: '' },
  iconTheme: { type: String as vue.PropType<'theme' | 'success' | 'error'>, default: '' },
  actions: { type: Array as vue.PropType<ActionItem[]>, default: () => [] },
  links: { type: Array as vue.PropType<ActionItem[]>, default: () => [] },
})

const iconThemes = {
  theme: 'bg-theme-100 text-theme-800 dark:bg-theme-900 dark:text-theme-100',
  success: 'bg-green-100 text-green-800 dark:bg-green-800/50 dark:text-green-50',
  error: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-100',
}

const ico = vue.computed(() => iconThemes[props.iconTheme as keyof typeof iconThemes] || iconThemes.theme)
</script>

<template>
  <div class="relative min-h-[40dvh] my-6 lg:my-12">
    <div
      v-if="loading"
      class="text-theme-300 dark:text-theme-600 absolute inset-0 flex h-full w-full flex-col items-center justify-center"
    >
      <ElSpinner class="h-10 w-10" />
    </div>
    <div v-else>
      <div v-if="heading || subHeading" :key="heading" class="mb-8 text-center flex flex-col gap-6 items-center justify-center">
        <div
          v-if="icon"
          class="rounded-full size-10 md:size-16 inline-flex items-center justify-center"
          :class="ico"
        >
          <div class="text-2xl md:text-4xl" :class="icon" />
        </div>
        <div>
          <div v-if="superHeading" class="mb-4 font-sans text-xs text-theme-400 dark:text-theme-500 uppercase tracking-widest" v-html="superHeading" />
          <h1 class="x-font-title text-2xl md:text-3xl font-semibold tracking-tight text-balance" v-html="heading" />
          <div class="mt-2 text-lg md:text-xl font-normal x-font-title text-theme-500 capitalize">
            <h4 v-if="subHeading" class="space-x-2" v-html="subHeading" />
          </div>
          <slot name="links" />
        </div>
      </div>
      <div class="pb-24 md:pb-8 relative">
        <slot />

        <InputActions class="justify-center mt-6" default-size="md" :actions />
      </div>
    </div>
  </div>
</template>
