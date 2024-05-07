<script lang="ts" setup>
import { vue } from '@fiction/core'
import TransitionSlide from '@fiction/ui/TransitionSlide.vue'
import type { Handle } from '@fiction/admin'
import { iconStyle } from '../util'

const props = defineProps({
  handle: { type: Object as vue.PropType<Handle>, required: true },
})

const draggableMode = vue.ref<number>(-1)

const i = vue.computed(() => {
  const isActive = props.handle.isActive
  const stl = iconStyle[isActive ? 'primary' : (props.handle.iconTheme || 'theme')]
  return `${stl.bg} ${stl.color} ${stl.border}`
})
</script>

<template>
  <div
    class="handle "
    :data-handle-id="handle.handleId"
    :data-handle-depth="handle.depth"

    :class="
      handle.isActive
        ? 'border-theme-300 dark:border-theme-600'
        : 'border-theme-300'
    "
  >
    <div
      class="handlebar flex group rounded-md select-none min-w-0 hover:opacity-80"
      :class="[handle.isActive ? 'bg-theme-50 dark:bg-theme-800 text-theme-700 dark:text-theme-0' : '']"
      @mouseover="draggableMode = handle.depth"
      @mouseleave="draggableMode = -1"
    >
      <div
        class="flex items-center justify-center border    shrink-0 p-1 px-2 "
        :class="[handle.hasDrawer ? 'rounded-tl-md' : 'rounded-l-md', handle.isActive ? 'dark:border-theme-500 border-theme-300' : 'dark:border-theme-500 border-theme-200']"
      >
        <div :class="handle.icon ?? 'i-carbon-blockchain'" />
      </div>
      <div
        class="flex grow border-y border-r   min-w-0 overflow-hidden"
        :class="[
          handle.hasDrawer ? 'rounded-tr-md' : 'rounded-r-md',
          handle.isActive ? 'dark:border-theme-500 border-theme-300' : 'dark:border-theme-500 border-theme-200']"
      >
        <div
          class="flex grow cursor-pointer items-center px-3 truncate gap-1 text-[10px] min-w-0"
          @click="handle.onClick?.({ event: $event })"
        >
          <div class="py-1 uppercase font-medium tracking-wide shrink-0">
            {{ handle.title || "Untitled" }}
          </div>
          <div v-if="handle.sub" class="py-1 text-theme-400 font-medium italic truncate" :class="handle.isActive ? 'text-primary-300' : 'text-theme-400'">
            {{ handle.sub }}
          </div>
        </div>

        <div
          class="flex cursor-grab items-center p-1 active:cursor-grabbing"
          :class="handle.isActive ? 'hover:bg-primary-200 dark:hover:bg-primary-600' : 'hover:bg-theme-200 dark:hover:bg-theme-600'"
        >
          <div
            class="i-carbon-draggable text-sm"
          />
        </div>
        <div
          v-for="(action, ii) in handle.actions"
          :key="ii"
          class="flex  items-center p-1"
          :class="[
            handle.isActive && action.onClick ? 'hover:bg-primary-200 dark:hover:bg-primary-600' : action.onClick ? 'hover:bg-theme-200 dark:hover:bg-theme-600' : '',
            action.onClick ? 'cursor-pointer' : ' ',
          ]"
        >
          <div
            class="text-sm"
            :class="action.icon"
            @click.stop="action.onClick?.({ event: $event, item: action })"
          />
        </div>
      </div>
    </div>

    <TransitionSlide>
      <div
        v-show="handle.hasDrawer"
        class="card-drawer rounded-b-md border-x border-b   p-3 bg-theme-0 dark:bg-theme-700"
        :class="handle.isActive ? 'border-primary-300 dark:border-primary-600' : 'border-theme-200 dark:border-theme-600'"
      >
        <div>
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
      </div>
    </TransitionSlide>
  </div>
</template>
