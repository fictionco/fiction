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
  <div class="md:flex md:items-center md:justify-between md:space-x-5 ">
    <div class="flex items-center space-x-6">
      <div v-if="modelValue.media" class="flex-shrink-0">
        <ElIndexItemMedia :media="modelValue.media" class="size-20" />
      </div>
      <div class="pt-1.5 space-y-1">
        <XText
          v-if="modelValue.title"
          tag="h1"
          :model-value="modelValue.title"
          class="text-2xl lg:text-3xl font-semibold text-theme-900 dark:text-theme-0 x-font-title !leading-[1.1]"
          :is-editable="editable.includes('title')"
          @update:model-value="updateValue('title', $event)"
        />
        <XText
          v-if="modelValue.subTitle"
          :model-value="modelValue.subTitle"
          class="text-base lg:text-xl  font-normal text-theme-500 dark:text-theme-500"
          :is-editable="editable.includes('subTitle')"
          @update:model-value="updateValue('subTitle', $event)"
        />
      </div>
    </div>
    <div class="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
      <XButton v-for="(action, i) in modelValue.actions" :key="i" size="sm" :icon="action.icon" @click.stop="action.onClick?.({ event: $event })">
        {{ action.name }}
      </XButton>
    </div>
  </div>
</template>
