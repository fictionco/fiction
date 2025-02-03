<script lang="ts" setup>
import type { ColorThemeUser, PostObject } from '@fiction/core'
import XButtonList from '@fiction/ui/buttons/XButtonList.vue'
import XText from '@fiction/ui/common/XText.vue'
import ElIndexItemMedia from '@fiction/ui/lists/ElIndexItemMedia.vue'

const {
  modelValue = {},
  editable = ['title'],
  colorTheme,
  testId = 'el-header',
} = defineProps<{
  modelValue?: PostObject
  editable?: (keyof PostObject)[]
  colorTheme?: ColorThemeUser
  testId?: string
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
  <div class="@container">
    <div class="@xs:flex @xs:items-center @xs:justify-between @xs:space-x-6">
      <div class="items-start space-y-2">
        <div v-if="modelValue.media" class="flex-shrink-0 flex gap-3 items-center">
          <ElIndexItemMedia
            :media="modelValue.media"
            class="size-12 @xl:size-14"
            :color-theme="colorTheme"
          />
        </div>
        <div class="space-y-1">
          <XText
            v-if="modelValue.title"
            tag="h1"
            :model-value="modelValue.title"
            class="text-base font-semibold text-theme-900 dark:text-theme-0 x-font-title"
            :is-editable="editable.includes('title')"
            :data-test-id="`${testId}-title`"
            @update:model-value="updateValue('title', $event)"
          />
          <XText
            v-if="modelValue.subTitle"
            :model-value="modelValue.subTitle"
            class="text-base font-normal text-theme-500 dark:text-theme-500 line-clamp-2"
            :is-editable="editable.includes('subTitle')"
            :data-test-id="`${testId}-subTitle`"
            @update:model-value="updateValue('subTitle', $event)"
          />
        </div>
      </div>
      <XButtonList
        v-if="modelValue.action?.buttons?.length"
        class="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse @xs:mt-0 @xs:flex-row @xs:space-x-3"
        :buttons="modelValue.action.buttons"
      />
    </div>
  </div>
</template>
