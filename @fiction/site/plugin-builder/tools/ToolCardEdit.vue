<script lang="ts" setup>
import type { AdminEditorController } from '@fiction/admin'
import type { InputOption } from '@fiction/ui'
import type { Card, FictionSites } from '../..'
import type { Site } from '../../site'
import type { TableCardConfig } from '../../tables'
import type { ToolKeys } from './tools'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import ElToolBanner from '@fiction/admin/tools/ElToolBanner.vue'
import { useService, vue } from '@fiction/core'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { SITE_INJECTION_KEY } from '../../site'
import { getCardOptionConfig } from '../../utils/cardHelpers'

const props = defineProps<{
  site: Site
  card?: Card
  controller: AdminEditorController<{ toolIds: ToolKeys }>
}>()

useService<{ fictionSites: FictionSites }>()

const tool = { toolId: 'settings', icon: { class: 'i-tabler-settings' }, title: 'Settings' }

const options = vue.shallowRef<InputOption[]>([])

vue.provide(SITE_INJECTION_KEY, vue.computed(() => props.site))

const activeCard = vue.computed(() => props.site?.activeCard.value)

const activeCardConfig = vue.computed({
  get: () => activeCard.value?.toConfig() as Partial<TableCardConfig> || {},
  set: v => activeCard.value && v && activeCard.value.update(v, { caller: 'ToolCardEditComputed' }),
})

function setActiveCardConfig(config: Partial<TableCardConfig>) {
  activeCardConfig.value = config
}

vue.onMounted(() => {
  vue.watch(
    () => props.site?.activeCard.value,
    async (card) => {
      options.value = await getCardOptionConfig({ card }) || []
    },
    { immediate: true },
  )
})
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
        title="Point and Click"
        sub="Settings appear here"
        :icon="{ class: 'i-tabler-click' }"
      />
      <ElToolBanner
        v-else-if="!options.length"
        class="m-4"
        title="No Options"
        sub="This element doesn't have any settings."
        :icon="{ class: 'i-tabler-settings' }"
      />
      <template v-else>
        <FormEngine
          :key="activeCardConfig.cardId"
          state-key="cardEdit"
          :data-active-template="activeCardConfig.templateId"
          :model-value="activeCardConfig"
          :options
          :input-props="{ site }"
          base-path="userConfig"
          :active-path="site.editor.value.editPath"
          :site
          aligned="right"
          @update:model-value="setActiveCardConfig($event)"
          @update:active-path="props.site?.setEditPath({ path: $event, caller: 'toolCardEdit' })"
        />
      </template>
    </transition>
  </ElTool>
</template>
