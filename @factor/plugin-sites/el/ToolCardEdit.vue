<script lang="ts" setup>
import { useService, vue } from '@factor/api'
import type { Site } from '../site'
import type { FactorSites } from '..'
import type { TableCardConfig } from '../tables'
import ElTool from './ElTool.vue'
import ElToolBanner from './ElToolBanner.vue'
import ToolForm from './ToolForm.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
})
useService<{ factorSites: FactorSites }>()

const tool = { toolId: 'settings', icon: 'i-tabler-settings', title: 'Settings' }

const options = vue.computed(() => props.site.activeCard.value?.options.value || [])

function setActiveCardConfig(config: Partial<TableCardConfig>) {
  props.site.activeCardConfig.value = config
  props.site.frame.syncSite({ caller: 'updateCardConfig' })
}
</script>

<template>
  <ElTool v-if="site" :tool="tool">
    <ElToolBanner
      v-if="!site.editor.value.selectedCardId"
      class="m-4"
      title="Make A Selection"
      sub="Element settings appear here"
      icon="i-tabler-click"
    />
    <ElToolBanner
      v-else-if="!options.length"
      class="m-4"
      title="No Options"
      sub="This element doesn't have any settings."
      icon="i-tabler-settings"
    />
    <template v-else>
      <ToolForm
        :model-value="site.activeCardConfig.value"
        :options="options"
        :site="site"
        @update:model-value="setActiveCardConfig($event)"
      />
    </template>
  </ElTool>
</template>
