<script lang="ts" setup generic="T extends Record<string, unknown> = Record<string, unknown>">
import type { Card } from '@fiction/site'
import type { AdminEditorController } from '../admin'
import { resetUi, toLabel, vue } from '@fiction/core'
import TransitionWidth from '@fiction/ui/anim/TransitionWidth.vue'
import ElTooltip from '@fiction/ui/common/ElTooltip.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'

const { controller, toolProps, loading = false, card } = defineProps<{
  controller: AdminEditorController
  toolProps: T
  loading?: boolean
  card: Card
}>()

const primaryTool = vue.computed(() => controller.activeTool.primary.value)
const contextTool = vue.computed(() => controller.activeTool.context.value)
</script>

<template>
  <div>
    <div class="flex flex-col h-full md:h-[100dvh]">
      <!-- Header Bar -->
      <div class="flex-none border-b border-theme-200 dark:border-theme-700 bg-theme-0 dark:bg-theme-950">
        <div class="flex py-2 items-center justify-between px-4">
          <div class="items-center flex text-sm lg:text-base gap-4">
            <slot name="headerLeft" />
          </div>
          <div class="flex items-center justify-end gap-3 md:gap-3 text-right ">
            <slot name="headerRight" />
          </div>
        </div>
      </div>
      <!-- Main Work Area -->
      <div
        class="editor-work-area flex flex-1 min-h-0"
      >
        <!-- Tools Sidebar -->
        <TransitionWidth>
          <div
            v-show="!controller.hideToolDrawers.value"
            class="no-scrollbar flex-none w-[60px] relative "
            @click.stop="resetUi({ scope: 'inputs', cause: 'clickEditorTools', trigger: 'elementClick' })"
          >
            <div class="flex flex-col justify-between py-6 z-40 relative h-full bg-theme-0 dark:bg-theme-900 border-r border-theme-200 dark:border-theme-700">
              <div class="space-y-1">
                <div
                  v-for="(tool, i) in controller.tools?.filter(_ => _.isPrimary && _.isPrimary !== 'bottom') || []"
                  :key="i"
                  class="flex items-center justify-center"
                >
                  <ElTooltip :content="toLabel(tool.title || tool.toolId)">
                    <div
                      :data-test-id="`tool-button-${tool.toolId}`"
                      class=" space-x-2 cursor-pointer p-2 justify-end size-[40px] rounded-lg transition-all"
                      :title="toLabel(tool.title || tool.toolId)"
                      :class="controller.isUsingTool({ toolId: tool.toolId })
                        ? 'bg-primary-500 dark:bg-primary-600/60 ring-1 dark:ring-primary-500 ring-primary-600 text-white'
                        : 'text-theme-600/80 dark:text-theme-0 hover:bg-primary-500 hover:text-white ring-primary-600 dark:hover:bg-primary-600/60  hover:ring-1 ring-inset dark:hover:ring-primary-500  '"
                      @click="controller.useTool({ toolId: tool.toolId })"
                    >
                      <div class="text-2xl" :class="tool.icon" />
                    </div>
                  </ElTooltip>
                </div>
              </div>
              <div class="space-y-1">
                <div
                  v-for="(tool, i) in controller.tools?.filter(_ => _.isPrimary && _.isPrimary === 'bottom') || []"
                  :key="i"
                  class="flex items-center justify-center"
                >
                  <ElTooltip :content="toLabel(tool.title || tool.toolId)">
                    <div
                      :data-test-id="`tool-button-${tool.toolId}`"
                      class=" space-x-2 cursor-pointer p-2 justify-end size-[40px] rounded-lg transition-all"
                      :title="toLabel(tool.title || tool.toolId)"
                      :class="controller.isUsingTool({ toolId: tool.toolId })
                        ? 'bg-primary-500 dark:bg-primary-600/60 ring-1 dark:ring-primary-500 ring-primary-600 text-white'
                        : 'text-theme-600/80 dark:text-theme-0 hover:bg-primary-500 hover:text-white ring-primary-600 dark:hover:bg-primary-600/60  hover:ring-1 ring-inset dark:hover:ring-primary-500  '"
                      @click="controller.useTool({ toolId: tool.toolId })"
                    >
                      <div class="text-2xl" :class="tool.icon" />
                    </div>
                  </ElTooltip>
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
                :key="primaryTool.toolId"
                class="absolute left-full h-full bg-theme-0 dark:bg-theme-900 top-0 z-30 border-r shadow-[10px_0_18px_-15px_rgba(0,0,0,0.6)] border-theme-300/70 dark:border-theme-600 overflow-scroll no-scrollbar "
                :class="primaryTool.widthClasses || 'w-[360px]'"
              >
                <component
                  :is="primaryTool.el"
                  v-bind="{ card, controller, ...toolProps, tool: primaryTool, ...primaryTool.props?.(toolProps).value }"
                />
              </div>
            </transition>
          </div>
        </TransitionWidth>
        <!-- Content Area -->
        <div class="flex flex-1 min-w-0" @click="controller.useTool({ toolId: '' })">
          <div class="flex flex-1 min-w-0 relative">
            <!-- Main Content -->
            <div
              class="flex-1 h-full overflow-scroll bg-theme-50/50 dark:bg-theme-800/60"
            >
              <div v-if="loading" class="pt-32 flex justify-center">
                <ElSpinner class="size-12 text-theme-300 dark:text-theme-600" />
              </div>
              <template v-else>
                <slot />
              </template>
            </div>

            <!-- Context Drawer -->
            <TransitionWidth>
              <div
                v-show="!controller.hideToolDrawers.value && contextTool"
                class="hidden md:block flex-none w-[300px] lg:w-[370px] xl:w-[400px] 2xl:w-[420px] bg-theme-0 dark:bg-theme-900 border-l border-theme-200 dark:border-theme-700 overflow-y-scroll overflow-x-clip scroll-container no-scrollbar"
              >
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
                    v-bind="{ card, controller, ...toolProps, tool: contextTool, ...contextTool.props?.(toolProps).value }"
                  />
                </transition>
              </div>
            </TransitionWidth>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
