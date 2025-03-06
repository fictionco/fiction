<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { Card, FictionSites } from '@fiction/site'
import type { InputOption } from '@fiction/ui'
import type { Site } from '../../site'
import type { ToolKeys } from './tools'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { useService, vue } from '@fiction/core'
import { createOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { updateSite } from '../../utils/site'

const { site, tool, controller, card } = defineProps<{
  site: Site
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
  card: Card
}>()

const service = useService<{ fictionSites: FictionSites }>()
const sending = vue.ref(false)

const options = vue.computed<InputOption[]>(() => {
  return [

    // Advanced Settings Group
    createOption({
      key: 'siteHandling',
      label: 'Site Handling',
      input: 'group',
      options: [
        createOption({
          key: 'userConfig.customCode.gtmContainerId',
          label: 'Delete Site',
          subLabel: 'Permanently delete this site',
          input: 'InputActionList',
          props: {
            buttons: [
              {
                label: 'Permanently Delete Site...',
                design: 'outline' as const,
                theme: 'red' as const,
                size: 'sm',
                icon: 'i-tabler-trash',
                loading: sending.value,
                onClick: async () => {
                  const confirmed = confirm('This will permanently delete your site. Are you sure?')
                  const siteId = site.siteId
                  if (confirmed) {
                    sending.value = true
                    await service.fictionSites.requests.ManageSite.projectRequest({ _action: 'delete', where: { siteId }, caller: 'siteDeleter' })
                    sending.value = false
                    await card.goto('/sites')
                  }
                },
              },
            ],
          },

        }),
      ],
    }),
  ]
})

const v = vue.computed({
  get: () => site.toConfig(),
  set: async (v) => {
    await updateSite({ site, newConfig: v, caller: 'updateGlobalSettings' })
  },
})
</script>

<template>
  <ElTool
    :tool
    :title="tool.title"
    :icon="tool.icon"
  >
    <ElForm class="p-2">
      <FormEngine
        v-model="v"
        state-key="globalSettings"
        :options="options"
        :input-props="{ site }"
        :depth="1"
      />
    </ElForm>
  </ElTool>
</template>
