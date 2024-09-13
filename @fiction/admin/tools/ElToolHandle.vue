<script lang="ts" setup>
import type { Handle } from './tools'
import { vue } from '@fiction/core'
import TransitionSlide from '@fiction/ui/anim/TransitionSlide.vue'

const props = defineProps({
  handle: { type: Object as vue.PropType<Handle>, required: true },
})

const draggableMode = vue.ref<number>(-1)
</script>

<template>
  <div
    :data-test-id="handle.testId ?? 'handle'"
    :data-handle-id="handle.handleId"
    :data-handle-depth="handle.depth"
    class="handle border rounded-md"
    :class="[handle.isActive ? 'border-theme-300/90 dark:border-theme-500' : 'border-theme-300/70 dark:border-theme-600']"
  >
    <div
      class="handlebar flex group rounded-md select-none min-w-0 hover:opacity-80 justify-between cursor-pointer"
      :class="[handle.isActive ? 'bg-theme-100/50 dark:bg-theme-800 text-theme-700 dark:text-theme-0' : 'text-theme-500']"
      @mouseover="draggableMode = handle.depth"
      @mouseleave="draggableMode = -1"
      @click="handle.onClick?.({ event: $event })"
    >
      <div
        class="p-1 flex gap-0.5 font-medium items-center justify-center  shrink-0 font-mono text-xs"
        :class="[
          handle.hasDrawer ? 'rounded-tl-full' : 'rounded-l-full',
        ]"
      >
        <div
          class="p-0.5 flex cursor-grab items-center active:cursor-grabbing hover:opacity-80 opacity-30"
        >
          <div class="i-carbon-draggable text-lg" />
        </div>
        <div class="flex items-center gap-1.5">
          <div :class="handle.icon ?? 'i-carbon-blockchain'" class="text-base" />

          <div>{{ handle.title || "Untitled" }}</div>
        </div>
      </div>
      <div
        class="flex grow justify-end pr-0.5 min-w-0 overflow-hidden gap-0.5"
        :class="[
          handle.isActive ? 'dark:border-theme-500 border-theme-300' : 'dark:border-theme-500 border-theme-200']"
      >
        <div
          v-for="(action, ii) in handle.actions"
          :key="ii"
          class="flex items-center p-1"
          :class="[
            action.onClick ? 'hover:text-primary-500 dark:hover:text-primary-400 hover:scale-125 transition-all  ' : '',
            action.onClick ? 'cursor-pointer' : ' ',
          ]"
          @click.stop.prevent="action.onClick?.({ event: $event, item: action })"
        >
          <div
            class="text-sm"
            :class="action.icon"
          />
        </div>
      </div>
    </div>

    <TransitionSlide>
      <div
        v-show="handle.hasDrawer"
        class="card-drawer border-t rounded-b-md border-theme-300 dark:border-theme-600 px-2 py-3 bg-theme-0 dark:bg-theme-700/50"
      >
        <div class="drag-input-zone min-h-[1em] space-y-2">
          <div
            tag="div"
            class="space-y-2 sortable-zone min-h-[40px]"
            data-drag-zone
            :data-drag-depth="handle.depth + 1"
          >
            <ElToolHandle
              v-for="subHandle in handle.handles ?? []"
              :key="subHandle.handleId"
              :handle="subHandle"
            />
          </div>
        </div>
      </div>
    </TransitionSlide>
  </div>
</template>
