<script lang="ts" setup>
import { systemIcons } from '@fiction/ui/lib/systemIcons'
import type { MediaObject, vue } from '@fiction/core'
import type { IconId } from '@fiction/ui/lib/systemIcons'
import XIcon from '../media/XIcon.vue'

const props = defineProps({
  modelValue: { type: Object as vue.PropType<MediaObject>, default: () => ({}) },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
}>()

function selectIcon(iconId: IconId) {
  emit('update:modelValue', { iconId, format: 'iconId' })
}
</script>

<template>
  <div class="p-4 grid grid-cols-8 gap-4 max-h-[400px] overflow-scroll">
    <button
      v-for="icon in systemIcons"
      :key="icon.iconId"
      class="flex flex-col items-center justify-center p-2 rounded hover:bg-theme-100 dark:hover:bg-theme-800"
      @click="selectIcon(icon.iconId)"
    >
      <XIcon :media="{ format: 'iconId', iconId: icon.iconId }" class="w-8 h-8" />
      <span class="mt-1 text-xs">{{ icon.name }}</span>
    </button>
  </div>
</template>
