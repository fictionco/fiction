<script lang="ts" setup>
import type { ActionButton, vue } from '@fiction/core'
import type { EditorTool } from './tools'
import { toLabel } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'

defineProps({
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  actions: { type: Array as vue.PropType<ActionButton[]>, default: () => [] },
  back: { type: Object as vue.PropType<ActionButton>, default: undefined },
  title: { type: String, default: '' },
  icon: { type: String, default: '' },
})
</script>

<template>
  <div class="tool pb-24">
    <div class="flex justify-between p-4 items-center select-none z-10">
      <div>
        <div v-if="back" class="mb-6">
          <XButton icon="i-tabler-arrow-left" rounding="full" theme="default" size="xs" @click.stop.prevent="back?.onClick?.({ event: $event })">
            {{ back?.name || "Back" }}
          </XButton>
        </div>
        <h3 class="font-semibold flex gap-1.5 items-center">
          <div class="text-xl" :class="icon || tool.icon" />
          <div v-html="title || tool.title || toLabel(tool.toolId)" />
        </h3>
      </div>
      <div class="flex space-x-2 text-xs items-center font-semibold text-theme-200">
        <XButton
          v-for="(item, i) in actions"
          :key="i"
          :icon="item.icon"
          :rounding="item.rounding || 'full'"
          :theme="item.theme || 'default'"
          :size="item.size || 'xs'"
          @click.prevent="item.onClick?.({ event: $event, item })"
        >
          {{ item?.name }}
        </XButton>
      </div>
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>
