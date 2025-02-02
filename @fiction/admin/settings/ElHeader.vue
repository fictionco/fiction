<script lang="ts" setup>
import type { PostObject } from '@fiction/core'
import XButtonList from '@fiction/ui/buttons/XButtonList.vue'
import XText from '@fiction/ui/common/XText.vue'
import ElIndexItemMedia from '@fiction/ui/lists/ElIndexItemMedia.vue'

const {
  modelValue = {},
  editable = ['title'],
} = defineProps<{ modelValue?: PostObject, editable?: (keyof PostObject)[] }>()

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
      <div class="@xs:flex items-start @xs:space-x-4 @xl:space-x-6 space-y-2 @xs:space-y-0">
        <div v-if="modelValue.media" class="flex-shrink-0 flex gap-3 items-center">
          <ElIndexItemMedia :media="modelValue.media" class="size-10 @xl:size-14" />
        </div>
        <div class="pt-1.5 @xs:pt-0 space-y-1">
          <XText
            v-if="modelValue.title"
            tag="h1"
            :model-value="modelValue.title"
            class="text-base font-semibold text-theme-900 dark:text-theme-0 x-font-title"
            :is-editable="editable.includes('title')"
            @update:model-value="updateValue('title', $event)"
          />
          <XText
            v-if="modelValue.subTitle"
            :model-value="modelValue.subTitle"
            class="text-base font-normal text-theme-500 dark:text-theme-500"
            :is-editable="editable.includes('subTitle')"
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
