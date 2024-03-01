<script lang="ts" setup>
import type { ActionItem, vue } from '@factor/api'
import { toLabel } from '@factor/api'
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
    <div
      class="flex justify-between p-4 items-center select-none z-10  "
    >
      <div>
        <div v-if="back" class="mb-3">
          <div

            class="inline-block text-[10px] rounded-md py-0.5 px-2 bg-theme-50 dark:bg-theme-600 uppercase font-semibold tracking-wide cursor-pointer text-theme-400 dark:text-theme-0 hover:bg-theme-100"
            @click.stop="back.onClick?.({ event: $event })"
          >
            &larr; {{ back?.name || "Back" }}
          </div>
        </div>
        <h3 class="font-semibold flex space-x-2 items-center">
          <div
            class="rounded-md p-1 size-7 border flex items-center justify-center"
            :class="[
              ico.color, ico.bg, ico.border,
            ]"
          >
            <div :class="icon || tool.icon" />
          </div>
          <div v-html="title || tool.title || toLabel(tool.toolId)" />
        </h3>
      </div>
      <div class="">
        <div
          v-for="(item, i) in actions"
          :key="i"
          class="transition-all cursor-pointer text-theme-600 dark:text-theme-0 hover:bg-primary-100 dark:hover:bg-primary-700 hover:text-primary-500 rounded-md bg-theme-50 dark:bg-primary-800 p-1 text-xl border border-theme-300 dark:border-primary-500 hover:border-primary-300 "
          @click="item.onClick?.({ event: $event, item })"
        >
          <div :class="item.icon" />
        </div>
      </div>
    </div>

    <div>
      <slot />
    </div>
  </div>
</template>

<style lang="less" scoped>
.tool {
  --input-bg: theme("colors.theme.50");
}
</style>
