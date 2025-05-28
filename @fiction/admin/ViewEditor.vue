<script lang="ts" setup generic="T extends Record<string, unknown> = Record<string, unknown>">
import type { Card } from '@fiction/site'
import type { AdminEditorController } from '../admin'
import { resetUi, toLabel, vue } from '@fiction/core'
import TransitionWidth from '@fiction/ui/anim/TransitionWidth.vue'
import ElTooltip from '@fiction/ui/common/ElTooltip.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'

const { controller, toolProps, loading = false, card } = defineProps<{
  controller?: AdminEditorController
  toolProps: T
  loading?: boolean
  card: Card
}>()

const primaryTool = vue.computed(() => controller?.activeTool.primary.value)
const contextTool = vue.computed(() => controller?.activeTool.context.value)

const topTools = vue.computed(() =>
  controller?.tools?.filter(tool => tool.isPrimary && tool.isPrimary !== 'bottom') || [],
)

const bottomTools = vue.computed(() =>
  controller?.tools?.filter(tool => tool.isPrimary && tool.isPrimary === 'bottom') || [],
)

const hasIconNav = vue.computed(() => topTools.value.length > 0)

function getToolButtonClass(toolId: string) {
  const isActive = controller?.isUsingTool({ toolId })
  return [
    'group flex flex-col cursor-pointer py-2 px-1 items-center justify-center w-[60px] rounded-lg transition-all',
    isActive
      ? 'bg-primary-500 dark:bg-primary-600/30 ring-1 dark:ring-primary-600 ring-primary-600 text-white'
      : 'text-theme-600/80 dark:text-theme-0 hover:bg-primary-500 hover:text-white ring-primary-600 dark:hover:bg-primary-600/60 hover:ring-1 ring-inset dark:hover:ring-primary-500',
  ]
}

function getToolTextClass(toolId: string) {
  const isActive = controller?.isUsingTool({ toolId })
  return [
    'text-[11px] tracking-tight font-medium truncate min-w-0 w-full text-center select-none',
    isActive
      ? 'text-white'
      : 'text-theme-500 dark:text-theme-400 group-hover:text-white',
  ]
}
</script>

<template>
  <div class="flex flex-col h-[100dvh]">
    <!-- Header Bar -->
    <div class="flex-none border-b border-theme-200 dark:border-theme-600/60 bg-theme-0 dark:bg-theme-950">
      <div class="flex py-2 items-center justify-between px-4 gap-4">
        <div class="items-center flex gap-4 basis-0 grow">
          <slot name="headerLeft" />
        </div>
        <div class="flex items-center justify-end gap-3 basis-0 grow">
          <slot name="headerRight" />
        </div>
      </div>
    </div>

    <!-- Main Work Area -->
    <div class="editor-work-area flex flex-1 min-h-0 h-full">
      <!-- Tools Sidebar -->
      <TransitionWidth>
        <div
          v-show="controller?.hideToolDrawers.value !== 'both' && controller?.hideToolDrawers.value !== 'left'"
          class="no-scrollbar flex-none relative hidden md:block"
          :class="hasIconNav ? 'w-[90px]' : 'w-0'"
          @click.stop="resetUi({ scope: 'inputs', cause: 'clickEditorTools', trigger: 'elementClick' })"
        >
          <div
            v-if="hasIconNav"
            class="flex flex-col justify-between items-center py-3 z-40 relative h-full border-r border-theme-200 dark:border-theme-600/60"
          >
            <!-- Top Tools -->
            <div class="space-y-1">
              <div
                v-for="tool in topTools"
                :key="tool.toolId"
                class="flex items-center justify-center"
              >
                <ElTooltip :content="toLabel(tool.title || tool.toolId)">
                  <div
                    :data-test-id="`tool-button-${tool.toolId}`"
                    :class="getToolButtonClass(tool.toolId)"
                    :title="toLabel(tool.title || tool.toolId)"
                    @click="controller?.useTool({ toolId: tool.toolId, caller: 'editorButtonTop' })"
                  >
                    <XIcon class="size-7" :media="tool.icon" />
                    <span :class="getToolTextClass(tool.toolId)">
                      {{ tool.title }}
                    </span>
                  </div>
                </ElTooltip>
              </div>
            </div>

            <!-- Bottom Tools -->
            <div class="space-y-1">
              <div
                v-for="tool in bottomTools"
                :key="tool.toolId"
                class="flex items-center justify-center"
              >
                <ElTooltip :content="toLabel(tool.title || tool.toolId)">
                  <div
                    :data-test-id="`tool-button-${tool.toolId}`"
                    :class="getToolButtonClass(tool.toolId)"
                    :title="toLabel(tool.title || tool.toolId)"
                    @click="controller?.useTool({ toolId: tool.toolId, caller: 'editorButton' })"
                  >
                    <XIcon class="size-7" :media="tool.icon" />
                    <span :class="getToolTextClass(tool.toolId)">
                      {{ tool.title }}
                    </span>
                  </div>
                </ElTooltip>
              </div>
            </div>
          </div>

          <!-- Primary Tool Modal -->
          <ElModal
            :vis="!!primaryTool?.el && primaryTool?.design !== 'drawer'"
            :modal-class="primaryTool?.modalClass || 'h-[80vh] w-full max-w-screen-md overflow-scroll no-scrollbar'"
            transition-mode="slideUp"
            :has-close="true"
            @update:vis="controller?.useTool({ toolId: '', caller: 'modalClose' })"
          >
            <component
              :is="primaryTool.el"
              v-if="primaryTool"
              :key="primaryTool.toolId"
              v-bind="{ card, controller, ...toolProps, tool: primaryTool, ...primaryTool.props?.(toolProps).value }"
            />
          </ElModal>

          <!-- Primary Tool Drawer -->
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
              v-if="primaryTool?.el && primaryTool.design === 'drawer'"
              :key="primaryTool.toolId"
              class="max-w-[70vw] absolute left-full h-full bg-theme-0 dark:bg-theme-900 top-0 z-30 border-r shadow-[10px_0_18px_15px_rgba(0,0,0,0.6)] border-theme-300/70 dark:border-theme-600 overflow-scroll no-scrollbar"
              :class="primaryTool.modalClass || 'w-[420px]'"
            >
              <component
                :is="primaryTool.el"
                :data-test-id="`primary-tool-${primaryTool.toolId}`"
                v-bind="{ card, controller, ...toolProps, tool: primaryTool, ...primaryTool.props?.(toolProps).value }"
              />
            </div>
          </transition>
        </div>
      </TransitionWidth>

      <!-- Content Area -->
      <div class="flex flex-1 min-w-0" @click="controller?.useTool({ toolId: '', caller: 'editorClick' })">
        <div class="flex flex-1 min-w-0 relative">
          <!-- Main Content -->
          <div class="flex-1 h-full overflow-scroll no-scrollbar">
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
              v-show="controller?.hideToolDrawers.value !== 'both' && controller?.hideToolDrawers.value !== 'right' && contextTool"
              class="hidden md:block flex-none w-[300px] lg:w-[370px] xl:w-[400px] 2xl:w-[420px] border-l border-theme-200 dark:border-theme-600/60 overflow-y-scroll overflow-x-clip scroll-container no-scrollbar"
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
                  :data-test-id="`context-tool-${contextTool.toolId}`"
                  v-bind="{ card, controller, ...toolProps, tool: contextTool, ...contextTool.props?.(toolProps).value }"
                />
              </transition>
            </div>
          </TransitionWidth>
        </div>
      </div>
    </div>
  </div>
</template>
