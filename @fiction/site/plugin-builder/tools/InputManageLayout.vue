<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { Site } from '../../site'
import { vue } from '@fiction/core'
import DraggableLayout from './LayoutDraggable.vue'
import LayoutToolRegion from './LayoutToolRegion.vue'

const { site } = defineProps<{
  site: Site
  tool: EditorTool
}>()

const sections = vue.computed(() => {
  const { header, ...rest } = site.sections.value || {}
  return rest
})
</script>

<template>
  <div class="list relative">
    <DraggableLayout class="relative rounded-md space-y-4" :site="site" @update:model-value="site.updateLayout({ order: $event })">
      <!-- <LayoutToolRegion v-if="site.sections.value.header" scope="global" region-id="header" :card="site.sections.value.header" :site="site" /> -->
      <LayoutToolRegion scope="page" region-id="main" :card="site.currentPage.value" :site="site" />
      <!-- <LayoutToolRegion
        v-for="(card, regionId) in sections"
        :key="regionId"
        :region-id="String(regionId)"
        :card
        :site
        scope="global"
      /> -->
    </DraggableLayout>
  </div>
</template>
