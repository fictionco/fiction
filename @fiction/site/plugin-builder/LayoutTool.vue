<script lang="ts" setup>
import type { ActionItem, ListItem } from '@fiction/core'
import { vue } from '@fiction/core'
import ElInput from '@fiction/ui/ElInput.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import type { Site } from '../site'
import type { EditorTool } from './tools'
import ElTool from './ElTool.vue'
import DraggableLayout from './LayoutDraggable.vue'
import LayoutToolRegion from './LayoutToolRegion.vue'

const props = defineProps({
  site: {
    type: Object as vue.PropType<Site>,
    required: true,
  },
  tool: {
    type: Object as vue.PropType<EditorTool>,
    required: true,
  },
})

const control = props.site.settings.fictionSites

const actions: ActionItem[] = [
  {
    name: 'Add Elements',
    icon: 'i-tabler-new-section',
    onClick: () => {
      props.site.activeRegionKey.value = 'main'
      control.builder.useTool({ toolId: 'add' })
    },
  },
]

const pageList = vue.computed<ListItem[]>(() => {
  return props.site.pages.value.map((r) => {
    return {
      name: r.displayTitle.value || 'Untitled',
      value: r.cardId,
    }
  })
})
</script>

<template>
  <ElTool :tool="tool" :actions="actions">
    <div class="list relative p-4">
      <DraggableLayout class="relative rounded-md space-y-4" @update:model-value="site.updateLayout({ order: $event })">
        <div class=" rounded-md space-y-1">
          <div class="relative flex justify-between items-center">
            <span class="text-[10px] uppercase text-theme-400/40 font-semibold tracking-wide">Current Page</span>
            <ElButton size="xxs" @click="control.builder.useTool({ toolId: 'pages' })">
              Change Page
            </ElButton>
          </div>
          <LayoutToolRegion region-id="main" :card="site.currentPage.value" :site="site" />
          <ElInput
            v-model="site.activePageId.value"
            class="hidden"
            label="Active Page"
            input="InputSelectCustom"
            :list="pageList"
          />
        </div>
        <div class="rounded-md space-y-1">
          <div class="relative">
            <span class="text-[10px] uppercase text-theme-400/40 font-semibold tracking-wide">Global Areas</span>
          </div>

          <LayoutToolRegion
            v-for="(card, regionId) in site.sections.value"
            :key="regionId"
            :region-id="String(regionId)"
            :card="card"
            :site="site"
          />
        </div>
      </DraggableLayout>
    </div>
  </ElTool>
</template>
