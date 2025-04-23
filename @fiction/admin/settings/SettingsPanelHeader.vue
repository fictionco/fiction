<script lang="ts" setup>
import type { ColorThemeUser, PostObject } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XButtonList from '@fiction/ui/buttons/XButtonList.vue'
import XText from '@fiction/ui/common/XText.vue'
import ElIndexItemMedia from '@fiction/ui/lists/ElIndexItemMedia.vue'

const {
  modelValue = {},
  editable = ['title'],
  colorTheme,
} = defineProps<{
  modelValue?: PostObject
  editable?: (keyof PostObject)[]
  colorTheme?: ColorThemeUser
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: PostObject): void
}>()

function updateValue<T extends keyof PostObject = keyof PostObject>(key: T, value: PostObject[T]) {
  const v = { ...modelValue, [key]: value }
  emit('update:modelValue', v)
}
</script>

<template>
  <div class="">
    <div class="flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex flex-col md:flex-row items-start gap-4 md:gap-6 grow w-full">
        <div v-if="modelValue.media" class="flex-shrink-0 flex gap-3 items-center">
          <ElIndexItemMedia
            :media="modelValue.media"
            class="size-12 md:size-16"
            :theme="colorTheme"
          />
        </div>
        <div class="space-y-1.5">
          <XText
            v-if="modelValue.title"
            tag="h1"
            :model-value="modelValue.title"
            class="text-lg md:text-xl font-semibold text-theme-900 dark:text-theme-0 x-font-title"
            :is-editable="editable.includes('title')"
            @update:model-value="updateValue('title', $event)"
          />
          <p class="flex gap-4 items-center">
            <XButton v-if="modelValue.status" size="sm" :theme="modelValue.theme" design="outline">
              {{ modelValue.status }}
            </XButton>
            <XText
              v-if="modelValue.subTitle"
              :model-value="modelValue.subTitle"
              class="text-sm md:text-base font-normal text-theme-500 dark:text-theme-400"
              :is-editable="editable.includes('subTitle')"
              @update:model-value="updateValue('subTitle', $event)"
            />
          </p>
        </div>
      </div>
      <XButtonList
        v-if="modelValue.action?.buttons?.length"
        class="flex w-full md:w-auto md:justify-end gap-3"
        :buttons="modelValue.action.buttons"
        ui-size="sm"
      />
    </div>
  </div>
</template>
