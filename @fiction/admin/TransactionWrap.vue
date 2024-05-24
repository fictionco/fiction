<script lang="ts" setup>
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import type { ActionItem, vue } from '@fiction/core'
import InputActions from '@fiction/ui/inputs/InputActions.vue'

defineProps({
  loading: { type: Boolean, default: false },
  sending: { type: Boolean, default: false },
  icon: { type: String, default: '' },
  superHeading: { type: String, default: '' },
  heading: { type: String, default: '' },
  subHeading: { type: String, default: '' },
  status: { type: String as vue.PropType<'success' | 'error'>, default: '' },
  actions: { type: Array as vue.PropType<ActionItem[]>, default: () => [] },
})
</script>

<template>
  <div class="relative min-h-[40dvh] my-12">
    <div
      v-if="loading"
      class="text-theme-300 dark:text-theme-600 absolute inset-0 flex h-full w-full flex-col items-center justify-center"
    >
      <ElSpinner class="h-10 w-10" />
    </div>
    <div v-else>
      <div v-if="heading || subHeading" class="mb-8 text-left md:text-center flex flex-col gap-6 items-center">
        <div
          class="rounded-full size-16 inline-flex items-center justify-center"
          :class="status === 'success' ? 'bg-green-300 text-green-800 dark:bg-green-800 dark:text-green-50' : 'bg-rose-300 text-rose-800 dark:bg-rose-900 dark:text-rose-100'"
        >
          <div class="text-4xl" :class="status === 'success' ? 'i-tabler-check' : 'i-tabler-x'" />
        </div>
        <div>
          <div v-if="superHeading" class="mb-4 font-sans text-xs text-theme-400 dark:text-theme-500 uppercase tracking-widest" v-html="superHeading" />
          <h1 class="x-font-title text-3xl font-bold tracking-tight" v-html="heading" />
          <div class="mt-2 text-xl font-normal x-font-title text-theme-500 capitalize">
            <h4 v-if="subHeading" class="space-x-2" v-html="subHeading" />
          </div>
        </div>
      </div>

      <div class="pb-24 md:pb-8 relative">
        <slot />
      </div>

      <InputActions class="justify-center" default-size="md" :actions />
    </div>
  </div>
</template>
