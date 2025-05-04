<script lang="ts" setup>
import type { ActionButton, MediaObject, SuperTitle } from '@fiction/core'
import { vue } from '@fiction/core'
import XText from '@fiction/ui/common/XText.vue'
import InputActionList from '@fiction/ui/inputs/InputActionList.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'

const props = defineProps({
  loading: { type: Boolean, default: false },
  icon: { type: String, default: '' },
  media: { type: Object as vue.PropType<MediaObject>, default: undefined },
  superTitle: { type: Object as vue.PropType<SuperTitle>, default: () => {} },
  title: { type: String, default: '' },
  subTitle: { type: String, default: '' },
  status: { type: String as vue.PropType<'success' | 'error' | 'pending'>, default: '' },
  buttons: { type: Array as vue.PropType<ActionButton[]>, default: () => [] },
  links: { type: Array as vue.PropType<ActionButton[]>, default: () => [] },
})

const iconThemes: Record<string, { class: string, icon?: string }> = {
  pending: { class: 'text-theme-800 border-theme-300/50 dark:border-theme-500 bg-theme-100/50 dark:bg-theme-800/30 dark:text-theme-50', icon: 'i-tabler-stop' },
  success: { class: 'text-primary-800 border-primary-500 dark:border-primary-400 bg-primary-100/50 dark:bg-primary-800/30 dark:text-primary-50', icon: 'i-tabler-check' },
  error: { class: 'text-rose-800 border-rose-500 dark:border-rose-400 bg-rose-100/50 dark:bg-rose-800/30 dark:text-rose-50', icon: 'i-tabler-x' },
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
        <div v-if="title || subTitle" :key="title" class="mb-6 md:text-center md:flex md:flex-col space-y-4  items-center justify-center">
          <div
            v-if="icon || ico.icon"
            class="rounded-full size-10 md:size-12 inline-flex items-center justify-center border"
            :class="ico.class"
            :title="superTitle?.text"
          >
            <div class="text-xl md:text-2xl" :class="icon || ico.icon" />
          </div>
          <div>
            <XText
              animate="fade"
              tag="h1"
              class="x-font-title text-2xl font-semibold tracking-tight md:text-pretty"
              :model-value="title"
            />
            <XText
              v-if="subTitle"
              class="mt-1 text-base font-normal x-font-title text-theme-500 dark:text-theme-300 md:text-pretty"
              animate="fade"
              tag="h4"
              :model-value="subTitle"
            />

            <slot name="links" />
          </div>
        </div>
        <div class="pb-8 relative space-y-6">
          <slot />

          <InputActionList
            v-if="buttons.length"
            :data-test-buttons="buttons.length"
            class="justify-center"
            ui-size="md"
            :buttons="() => buttons"
          />
        </div>
      </div>
    </transition>
  </div>
</template>
