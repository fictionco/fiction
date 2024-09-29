<script lang="ts" setup>
import type { ActionItem } from '@fiction/core'
import { vue } from '@fiction/core'
import XText from '@fiction/ui/common/XText.vue'
import InputActionList from '@fiction/ui/inputs/InputActionList.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'

const props = defineProps({
  loading: { type: Boolean, default: false },
  icon: { type: String, default: '' },
  superHeading: { type: String, default: '' },
  heading: { type: String, default: '' },
  subHeading: { type: String, default: '' },
  status: { type: String as vue.PropType<'success' | 'error' | 'pending'>, default: '' },
  actions: { type: Array as vue.PropType<ActionItem[]>, default: () => [] },
  links: { type: Array as vue.PropType<ActionItem[]>, default: () => [] },
})

const iconThemes: Record<string, { class: string, icon?: string }> = {
  pending: { class: 'bg-theme-100/50 text-theme-500 dark:bg-theme-700 dark:text-theme-100', icon: 'i-tabler-stop' },
  success: { class: 'bg-green-100 text-green-800 dark:bg-green-800/50 dark:text-green-50', icon: 'i-tabler-check' },
  error: { class: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-100', icon: 'i-tabler-x' },
}

const ico = vue.computed(() => iconThemes[props.status as keyof typeof iconThemes] || iconThemes.pending)
</script>

<template>
  <div class="relative min-h-[40dvh] py-6 lg:py-12 ">
    <transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0 translate-x-12"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="ease-in duration-300"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 -translate-x-12"
      mode="out-in"
    >
      <div
        v-if="loading"
        class="text-theme-300 dark:text-theme-600 absolute inset-0 flex h-full w-full flex-col items-center justify-center"
      >
        <ElSpinner class="h-10 w-10" />
      </div>
      <div v-else :key="status" :data-transaction-status="status" class="space-y-8">
        <div v-if="heading || subHeading" :key="heading" class="mb-6 md:text-center md:flex md:flex-col space-y-4  items-center justify-center">
          <div
            v-if="icon || ico.icon"
            class="rounded-full size-12 md:size-16 inline-flex items-center justify-center"
            :class="ico.class"
            :title="superHeading"
          >
            <div class="text-2xl md:text-3xl" :class="icon || ico.icon" />
          </div>
          <div>
            <XText animate="fade" tag="h1" class="x-font-title text-3xl font-semibold tracking-tight text-balance" :model-value="heading" />
            <div class="mt-2 text-lg md:text-xl font-normal x-font-title text-theme-500 capitalize">
              <XText v-if="subHeading" animate="fade" tag="h4" class="space-x-2" :model-value="subHeading" />
            </div>
            <slot name="links" />
          </div>
        </div>
        <div class="pb-24 md:pb-8 relative space-y-6">
          <slot />

          <InputActionList :data-test-actions="actions.length" class="justify-center" ui-size="md" :actions />
        </div>
      </div>
    </transition>
  </div>
</template>
