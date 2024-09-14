<script lang="ts" setup>
import type { AdminEditorController } from '@fiction/admin'
import type { FictionSites } from '../..'
import type { Site } from '../../site'
import type { TableCardConfig } from '../../tables'
import type { ToolKeys } from './tools'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import ElToolBanner from '@fiction/admin/tools/ElToolBanner.vue'
import { useService, vue } from '@fiction/core'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, default: undefined },
  controller: { type: Object as vue.PropType<AdminEditorController<{ toolIds: ToolKeys }>>, required: true },
})
useService<{ fictionSites: FictionSites }>()

const tool = { toolId: 'settings', icon: 'i-tabler-settings', title: 'Settings' }

const options = vue.computed(() => props.site?.activeCard.value?.options.value || [])

function setActiveCardConfig(config: Partial<TableCardConfig>) {
  if (props.site) {
    props.site.activeCardConfig.value = config
    props.site.activeCard.value?.syncCard({ caller: 'updateCardConfig', cardConfig: config })
  }
}
</script>

<template>
  <ElTool v-if="site" :tool>
    <transition
      mode="out-in"
      enter-active-class="ease-out duration-200"
      enter-from-class="transform scale-80 translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform scale-80 translate-y-4 opacity-0"
    >
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
        <FormEngine
          :key="site.activeCardConfig.value.cardId"
          :model-value="site.activeCardConfig.value"
          :options="options"
          :input-props="{ site }"
          base-path="userConfig"
          @update:model-value="setActiveCardConfig($event)"
        />
      </template>
    </transition>
  </ElTool>
</template>
