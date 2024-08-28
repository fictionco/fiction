<script lang="ts" setup>
import type { ActionItem, vue } from '@fiction/core'
import { toLabel } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import { iconStyle } from '../util'
import type { EditorTool } from './tools'

const props = defineProps({
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  actions: { type: Array as vue.PropType<ActionItem[]>, default: () => [] },
  back: { type: Object as vue.PropType<ActionItem>, default: undefined },
  title: { type: String, default: '' },
  iconTheme: { type: String as vue.PropType<keyof typeof iconStyle>, default: 'theme' },
  icon: { type: String, default: '' },
})

const ico = iconStyle[props.iconTheme]
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
        <div
          v-for="(item, i) in actions"
          :key="i"
          class="flex space-x-1 items-center transition-all cursor-pointer text-theme-500 dark:text-theme-0 hover:bg-primary-100 dark:hover:bg-primary-700 hover:text-primary-500 rounded-md bg-theme-50 dark:bg-primary-800 py-1 px-2 text-[10px] border border-theme-200 dark:border-primary-500 hover:border-primary-300 "
          @click="item.onClick?.({ event: $event, item })"
        >
          <div :class="item.icon" class="text-base" />
          <div class="">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>
