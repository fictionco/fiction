<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { Site } from '../../site'
import DraggableLayout from './LayoutDraggable.vue'
import LayoutToolRegion from './LayoutToolRegion.vue'

const { site } = defineProps<{
  site: Site
  tool: EditorTool
}>()
</script>

<template>
  <div class="list relative">
    <DraggableLayout class="relative rounded-md space-y-4" :site="site" @update:model-value="site.updateLayout({ order: $event })">
      <LayoutToolRegion scope="page" region-id="main" :card="site.currentPage.value" :site="site" />
    </DraggableLayout>
  </div>
</template>
