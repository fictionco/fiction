<script lang="ts" setup>
import type { PostObject } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XText from '@fiction/ui/common/XText.vue'
import ElIndexItemMedia from '@fiction/ui/lists/ElIndexItemMedia.vue'

const { modelValue = {}, editable = ['title'] } = defineProps<{ modelValue?: PostObject, editable?: (keyof PostObject)[] }>()

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
    <div class="@lg:flex @lg:items-center @lg:justify-between @lg:space-x-6">
      <div class="@lg:flex items-start @lg:space-x-4 @xl:space-x-6 space-y-2 @lg:space-y-0">
        <div v-if="modelValue.media" class="flex-shrink-0 flex gap-3 items-center">
          <ElIndexItemMedia :media="modelValue.media" class="size-10 @xl:size-14" />
        </div>
        <div class="pt-1.5 space-y-1">
          <XText
            v-if="modelValue.title"
            tag="h1"
            :model-value="modelValue.title"
            class="text-xl lg:text-2xl font-semibold text-theme-900 dark:text-theme-0 x-font-title !leading-[1.1]"
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
      <div class="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse @lg:mt-0 @lg:flex-row @lg:space-x-3">
        <XButton v-for="(action, i) in modelValue.actions" :key="i" :size="action.size || 'md'" :icon="action.icon" @click.stop="action.onClick?.({ event: $event })">
          {{ action.name }}
        </XButton>
      </div>
    </div>
  </div>
</template>
