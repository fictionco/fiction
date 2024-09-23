<script lang="ts" setup>
import type { ActionItem, vue } from '@fiction/core'
import XButton from './buttons/XButton.vue'

defineProps({
  icon: { type: String, default: undefined },
  subTitle: { type: String, default: undefined },
  title: { type: String, required: true },
  description: { type: String, required: true },
  actions: { type: Array as vue.PropType<ActionItem[]>, default: undefined },
  bullets: { type: Array as vue.PropType<ActionItem[]>, default: undefined },
  tags: { type: Array as vue.PropType<string[]>, default: () => [] },
})
</script>

<template>
  <div class="bg-theme-0 border border-theme-300/70 bg-theme-0  dark:border-theme-700 dark:bg-theme-800/70 relative rounded-lg overflow-hidden ">
    <div class="mx-auto max-w-7xl px-6 py-24 lg:flex lg:px-24">
      <div class="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl flex flex-col justify-center lg:pt-12">
        <div class="">
          <div v-if="icon" class="mb-4 lg:mb-6 relative">
            <div class="text-4xl lg:text-6xl text-theme-500/30 lg:absolute bottom-0" :class="icon" />
          </div>
          <h1 class="mt-4 lg:mt-6  text-2xl md:text-4xl font-semibold dark:text-theme-0 sm:text-5xl x-font-title">
            {{ title }}
          </h1>
          <p class="mt-6 text-lg lg:text-xl text-theme-600 dark:text-theme-300">
            {{ description }}
          </p>
          <div v-if="actions?.length" class="mt-10 flex items-center gap-x-6">
            <XButton
              v-for="(item, i) in actions"
              :key="i"
              :data-test-id="item.testId"
              :href="item.href"
              :theme="item.theme"
              :rounding="item.rounding || 'full'"
              :icon="item.icon"
              size="lg"
              @click.stop="item.onClick && item.onClick({ event: $event })"
            >
              {{ item.name }}
            </XButton>
          </div>
        </div>
      </div>
      <div v-if="$slots.figure" class="mx-auto mt-8 flex max-w-2xl sm:mt-16 lg:ml-10 lg:mr-0 lg:-mt-6 lg:max-w-none lg:flex-none xl:ml-32">
        <div class="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none max-h-[40dvh]">
          <slot name="figure" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.angled-shape {
  clip-path: polygon(0 0, 100% 0, 121% 100%, 0 100%, 12% 0, 0 0%);
}
</style>
