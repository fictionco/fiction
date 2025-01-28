<script lang="ts" setup>
import type { ActionArea, MediaObject } from '@fiction/core'
import XButton from './buttons/XButton.vue'
import XIcon from './media/XIcon.vue'

const { testId = 'zero-banner', icon, title, description, action = {} } = defineProps<{
  testId?: string
  icon?: string | MediaObject
  title: string
  description?: string
  action: ActionArea
}>()
</script>

<template>
  <div class="bg-theme-0 border border-theme-300/70 bg-theme-50/80  dark:border-theme-700 dark:bg-theme-800/70 relative rounded-lg overflow-hidden ">
    <div class="mx-auto max-w-7xl px-12 py-16">
      <div class="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl flex md:flex-col justify-center ">
        <div class="flex gap-5">
          <div v-if="icon" class="mb-4 lg:mb-6 relative">
            <XIcon class="size-10 lg:size-14 text-theme-500/30" :media="icon" />
          </div>
          <div>
            <h1
              class=" text-lg sm:text-xl font-semibold dark:text-theme-0 x-font-title"
              :data-test-id="`${testId}-title`"
            >
              {{ title }}
            </h1>
            <p
              v-if="description"
              class="mt-3 text-base text-theme-600 dark:text-theme-300"
              :data-test-id="`${testId}-description`"
            >
              {{ description }}
            </p>
            <div v-if="action?.buttons?.length" class="mt-10 flex items-center gap-x-6">
              <XButton
                v-for="(item, i) in action?.buttons"
                :key="i"
                :data-test-id="item.testId"
                :href="item.href"
                :theme="item.theme"
                :rounding="item.rounding || 'full'"
                :icon="item.icon"
                size="md"
                @click.stop="item.onClick && item.onClick({ event: $event })"
              >
                {{ item.label }}
              </XButton>
            </div>
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
