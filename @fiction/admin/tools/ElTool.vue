<script lang="ts" setup>
import type { ActionButton, vue } from '@fiction/core'
import type { EditorTool } from './tools'

defineOptions({ name: 'ElTool' })

defineProps({
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  actions: { type: Array as vue.PropType<ActionButton[]>, default: () => [] },
  back: { type: Object as vue.PropType<ActionButton>, default: undefined },
  title: { type: String, default: '' },
  icon: { type: String, default: '' },
})
</script>

<template>
  <div class="tool pb-24 pt-1">
    <slot />
  </div>
</template>
