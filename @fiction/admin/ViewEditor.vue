<script lang="ts" setup>
import { resetUi, toLabel, vue } from '@fiction/core'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import type { AdminEditorController } from '../admin'

const props = defineProps({
  controller: { type: Object as vue.PropType<AdminEditorController>, required: true },
  loading: { type: Boolean, default: false },
  toolProps: { type: Object as vue.PropType<Record<string, unknown>>, default: () => ({}) },
})

const primaryTool = vue.computed(() => props.controller.activeTool.primary.value)
const contextTool = vue.computed(() => props.controller.activeTool.context.value)
</script>

<template>
  <div>
    <div class="grid grid-flow-dense h-full md:h-[100dvh] grid-cols-[1fr] grid-rows-[auto_minmax(0,1fr)]">
      <div class="border-b border-theme-200 dark:border-theme-700 bg-theme-0 dark:bg-theme-950">
        <div class="flex py-2 items-center justify-between px-4">
          <div class="items-center flex text-sm lg:text-base space-x-4">
            <slot name="headerLeft" />
          </div>
          <div class="flex items-center justify-end space-x-4 text-right ">
            <slot name="headerRight" />
          </div>
        </div>
      </div>
      <div
        class="editor-work-area min-h-0 grid grid-flow-dense grid-cols-[60px_1fr] grid-rows-[minmax(0,1fr)]"
      >
        <div
          class="no-scrollbar min-w-0 grow-0 relative "
          @click.stop="resetUi({ scope: 'inputs', cause: 'clickEditorTools' })"
        >
          <div class="space-y-1 py-2 z-30 relative h-full bg-theme-0 dark:bg-theme-900 border-r border-theme-200 dark:border-theme-700">
            <div
              v-for="(tool, i) in controller.tools?.filter(_ => _.isPrimary) || []"
              :key="i"
              class="flex items-center justify-center"
            >
              <div
                class=" space-x-2 cursor-pointer p-2 justify-end w-[40px] h-[40px] rounded-lg transition-all"
                :title="toLabel(tool.title || tool.toolId)"
                :class="controller.isUsingTool({ toolId: tool.toolId })
                  ? 'bg-theme-100/80 dark:bg-theme-700 text-theme-900 dark:text-theme-50'
                  : 'text-theme-700 dark:text-theme-0 dark:hover:bg-theme-600 hover:bg-theme-100/80'"
                @click="controller.useTool({ toolId: tool.toolId })"
              >
                <div class="text-2xl" :class="tool.icon" />
              </div>
            </div>
          </div>
          <transition
            mode="out-in"
            enter-active-class="ease-out duration-200"
            enter-from-class="transform -translate-x-10 opacity-0"
            enter-to-class="transform translate-x-0 opacity-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="transform translate-x-0 opacity-100"
            leave-to-class="transform -translate-x-10 opacity-0"
          >
            <div
              v-if="primaryTool"
              class="absolute left-full h-full bg-theme-0 dark:bg-theme-900 top-0 z-30 border-r shadow-[10px_0_18px_-15px_rgba(0,0,0,0.6)] border-theme-300/70 dark:border-theme-600 overflow-scroll no-scrollbar "
              :class="primaryTool.widthClasses || 'w-[300px]'"
            >
              <component
                :is="primaryTool.el"
                v-bind="{ ...toolProps, tool: primaryTool, ...primaryTool.props?.(toolProps).value }"
              />
            </div>
          </transition>
        </div>
        <div @click="controller.useTool({ toolId: '' })">
          <div class="h-full min-h-0 grid grid-flow-dense relative grid-rows-[minmax(0,1fr)] grid-cols-[1fr_300px] xl:grid-cols-[1fr_400px]">
            <div class="cards relative  h-full w-full  overflow-scroll bg-theme-50/50 dark:bg-theme-800/60">
              <div v-if="loading" class="">
                <div class="text-theme-300 dark:text-theme-600 flex justify-center pt-32">
                  <ElSpinner class="size-12" />
                </div>
              </div>
              <template v-else>
                <slot />
              </template>
            </div>

            <div class="no-scrollbar  bg-theme-0 dark:bg-theme-900 border-l border-theme-200 dark:border-theme-700 relative overflow-scroll">
              <transition
                mode="out-in"
                enter-active-class="ease-out duration-200"
                enter-from-class="transform scale-80 translate-y-4 opacity-0"
                enter-to-class="transform translate-y-0 opacity-100"
                leave-active-class="ease-in duration-200"
                leave-from-class="transform translate-y-0 opacity-100"
                leave-to-class="transform scale-80 translate-y-4 opacity-0"
              >
                <component
                  :is="contextTool.el"
                  v-if="contextTool"
                  v-bind="{ ...toolProps, tool: contextTool, ...contextTool.props?.(toolProps).value }"
                />
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
