<script lang="ts" setup>
import type { FactorRouter, vue } from '@factor/api'
import { resetUi, toLabel, useService } from '@factor/api'
import type { Site } from '../site'
import type { FactorSites } from '..'
import SiteEditorFrame from './SiteEditorFrame.vue'
import { tools } from './tools'

defineProps({
  site: {
    type: Object as vue.PropType<Site>,
    default: undefined,
  },
})

const { factorSites } = useService<{ factorSites: FactorSites, factorRouterSites: FactorRouter }>()
</script>

<template>
  <div
    v-if="site"
    class="editor-work-area min-h-0 grid grid-flow-dense grid-cols-[60px_1fr] grid-rows-[minmax(0,1fr)]"
  >
    <div
      class="no-scrollbar min-w-0 grow-0 relative"
      @click.stop="resetUi({ scope: 'inputs', cause: 'clickEditorTools' })"
    >
      <div class="space-y-1 py-2 z-30 relative h-full bg-theme-0 dark:bg-theme-900 border-r border-theme-100 dark:border-theme-700">
        <div
          v-for="(tool, i) in tools().filter(_ => _.isPrimary)"
          :key="i"
          class="flex items-center justify-center"
        >
          <div
            class=" space-x-2 cursor-pointer p-2 justify-end w-[40px] h-[40px] rounded-lg transition-all"
            :title="toLabel(tool.title || tool.toolId)"
            :class="
              factorSites.isUsingTool({ toolId: tool.toolId })
                ? 'bg-primary-100 dark:bg-primary-700 text-primary-600 dark:text-primary-50'
                : 'text-theme-700 dark:text-theme-0 dark:hover:bg-theme-600 hover:bg-theme-100 d'"
            @click="factorSites.useTool({ toolId: tool.toolId })"
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
          v-if="factorSites.activeTool.left.value"
          :key="factorSites.activeTool.left.value.toolId"
          class="absolute left-full h-full bg-theme-0 dark:bg-theme-900 top-0 z-30 border-r shadow-[10px_0_8px_-5px_rgba(0,0,0,0.05)] border-theme-300 dark:border-theme-600 overflow-scroll no-scrollbar "
          :class="factorSites.activeTool.left.value.widthClasses || 'w-[300px]'"
        >
          <component
            :is="factorSites.activeTool.left.value.el"
            v-bind="{
              site,
              tool: factorSites.activeTool.left.value,
              ...factorSites.activeTool.left.value.props?.(site).value,
            }"
          />
        </div>
      </transition>
    </div>
    <div @click="factorSites.useTool({ toolId: '' })">
      <div class="h-full min-h-0 grid grid-flow-dense relative grid-rows-[minmax(0,1fr)] grid-cols-[1fr_300px] xl:grid-cols-[1fr_350px]">
        <div

          class="cards relative flex h-full w-full flex-col justify-center overflow-scroll bg-theme-50 dark:bg-theme-800"
        >
          <SiteEditorFrame :site="site" />
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
              :is="factorSites.activeTool.right.value.el"
              v-if="factorSites.activeTool.right.value"
              :key="site.activeCard.value?.cardId"
              v-bind="{
                site,
                tool: factorSites.activeTool.right.value,
                ...factorSites.activeTool.right.value.props?.(site).value,
              }"
            />
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.editor-work-area {

  .manager-area {
    --input-size: 13px;
    --input-bg: #ffffff;
  }
}
</style>
