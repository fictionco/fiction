<script lang="ts" setup>
import type { ColorThemeUser, MediaObject, PostObject } from '@fiction/core'
import XButtonList from './buttons/XButtonList.vue'
import XText from './common/XText.vue'
import ElIndexItemMedia from './lists/ElIndexItemMedia.vue'

const {
  testId = 'zero-banner',
  modelValue = {},
  colorTheme,
} = defineProps<{
  testId?: string
  icon?: string | MediaObject
  modelValue?: PostObject
  colorTheme?: ColorThemeUser
}>()
</script>

<template>
  <div class="bg-theme-50 dark:bg-theme-900 relative rounded-lg overflow-hidden ">
    <div class="mx-auto max-w-[600px] aspect-video p-8 md:p-16 flex justify-center items-center">
      <div class="">
        <div class="space-y-8">
          <div class="items-start space-y-4">
            <div v-if="modelValue.media" class="flex-shrink-0 flex gap-3 items-center">
              <ElIndexItemMedia
                :media="modelValue.media"
                class="size-16"
                :color-theme="colorTheme || modelValue.theme"
              />
            </div>
            <div class="space-y-1">
              <XText
                v-if="modelValue.title"
                tag="h1"
                :model-value="modelValue.title"
                class=" text-xl sm:text-3xl  font-bold text-theme-900 dark:text-theme-0 x-font-title"
                :data-test-id="`${testId}-title`"
              />
              <XText
                v-if="modelValue.subTitle"
                :model-value="modelValue.subTitle"
                class="text-base md:text-lg font-normal text-theme-500 dark:text-theme-500 line-clamp-2"
                :data-test-id="`${testId}-subTitle`"
              />
            </div>
          </div>
          <XButtonList
            v-if="modelValue.action?.buttons?.length"
            class="flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse @xs:mt-0 @xs:flex-row @xs:space-x-3"
            :buttons="modelValue.action.buttons"
          />
        </div>
      </div>
    </div>
  </div>
</template>
