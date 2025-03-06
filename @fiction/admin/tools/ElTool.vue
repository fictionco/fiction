<script lang="ts" setup>
import type { ActionButton, MediaObject, vue } from '@fiction/core'
import type { EditorTool } from './tools'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'

defineOptions({ name: 'ElTool' })

const { buttons = [], title = '', icon } = defineProps<{
  tool: EditorTool
  buttons?: ActionButton[]
  title?: string
  icon?: MediaObject
}>()

</script>

<template>
  <div class="tool pb-24 pt-1" >
    <div v-if="title" class="header p-2 flex justify-between items-center">
      <div
        class="flex items-center"
      >
        <div
          v-if="icon"
          class="icon mr-2 shrink-0 flex  items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50"
        >
          <XIcon :media="icon" class="size-[1em]" />
        </div>
        <div class="title text-sm font-semibold">
          {{ title }}
        </div>
      </div>
      <div class="buttons flex gap-2 flex-end items-center">
        <XButton
          v-for="button in buttons"
          :key="button.label"
          :label="button.label"
          :theme="button.theme || 'primary'"
          :design="button.design || 'outline'"
          :icon="button.icon"
          :disabled="button.disabled"
          :loading="button.loading"
          :size="button.size || 'xs'"
          :href="button.href"
          @click="button.onClick"
        >
          {{ button.label }}
        </XButton>
      </div>
    </div>

    <slot />
  </div>
</template>
