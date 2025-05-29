<script lang="ts" setup>
import type { ColorThemeUser, MediaObject, PostObject } from '@fiction/core'
import XButtonList from './buttons/XButtonList.vue'
import XText from './common/XText.vue'

const {
  testId = 'zero-banner',
  modelValue = {},
} = defineProps<{
  testId?: string
  icon?: string | MediaObject
  modelValue?: PostObject
  theme?: ColorThemeUser
}>()
</script>

<template>
  <div class="bg-theme-50 dark:bg-theme-900 relative rounded-lg overflow-hidden ">
    <div class="mx-auto max-w-[600px] aspect-video p-8 md:p-16 flex justify-center items-center">
      <div class="">
        <div class="space-y-8">
          <div class="items-start flex flex-col md:flex-row gap-6">
            <div class="space-y-8">
              <div class="space-y-1 text-center">
                <XText
                  v-if="modelValue.title"
                  tag="h1"
                  :model-value="modelValue.title"
                  class=" text-xl sm:text-2xl font-semibold text-theme-900 dark:text-theme-0 x-font-title"
                  :data-test-id="`${testId}-title`"
                />
              </div>
              <XButtonList
                v-if="modelValue.action?.buttons?.length"
                class="flex flex-wrap gap-2 justify-center"
                :buttons="modelValue.action.buttons"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
