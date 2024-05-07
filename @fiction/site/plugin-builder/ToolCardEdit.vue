<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import ElToolBanner from '@fiction/admin/tools/ElToolBanner.vue'
import ToolForm from '@fiction/admin/tools/ToolForm.vue'
import type { Site } from '../site'
import type { FictionSites } from '..'
import type { TableCardConfig } from '../tables'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, default: undefined },
})
useService<{ fictionSites: FictionSites }>()

const tool = { toolId: 'settings', icon: 'i-tabler-settings', title: 'Settings' }

const options = vue.computed(() => props.site?.activeCard.value?.options.value || [])

function setActiveCardConfig(config: Partial<TableCardConfig>) {
  if (props.site) {
    props.site.activeCardConfig.value = config
    props.site.frame.syncSite({ caller: 'updateCardConfig' })
  }
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
        :input-props="{ site }"
        base-path="userConfig"
        @update:model-value="setActiveCardConfig($event)"
      />
    </template>
  </ElTool>
</template>
