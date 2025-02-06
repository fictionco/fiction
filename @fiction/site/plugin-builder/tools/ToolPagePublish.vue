<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { FictionApp } from '@fiction/core'
import type { InputOption } from '@fiction/ui'
import type { Site } from '../../site'
import type { ToolKeys } from './tools'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { useService, vue } from '@fiction/core'
import { createOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { t } from '../../tables'
import { activeSiteHostname, updateSite } from '../../utils/site'

const props = defineProps<{
  site: Site
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
  saveText?: string
}>()

const { fictionAppSites } = useService<{ fictionAppSites: FictionApp }>()

function getSuffixUrl() {
  return new URL(fictionAppSites.liveUrl.value).hostname.split('.').slice(-2).join('.')
}
const options: InputOption[] = [
  createOption({
    key: 'editor.hidePublishing',
    label: 'Site Domain',
    input: 'group',
    icon: { class: 'i-tabler-world' },
    options: [
      createOption({
        key: 'group.subDomain',
        label: 'Fiction Subdomain',
        input: 'group',
        icon: { class: 'i-tabler-world-latitude' },
        options: [
          createOption({
            key: 'subDomain',
            label: 'Free Fiction Domain',
            subLabel: 'Your site\'s included web address',
            description: 'Choose a unique name for your free Fiction-hosted domain. This will be your site\'s default address.',
            input: 'InputUsername',
            isRequired: true,

            props: {
              beforeInput: 'https://',
              afterInput: getSuffixUrl(),
              table: t.sites,
              columns: [{ name: 'subDomain' }],
              uiSize: 'md',
            },
          }),
        ],
      }),
      createOption({
        key: 'group.subDomain',
        label: 'Custom Domain',
        input: 'group',
        icon: { class: 'i-tabler-world-longitude' },
        options: [
          createOption({
            key: 'customDomains',
            label: 'Enter Custom Domain',
            subLabel: 'Add custom domains for this site (e.g. www.example.com)',
            description: 'Connect your own domain name to your site. You\'ll need to update your DNS settings with your domain provider.',
            input: vue.defineAsyncComponent(() => import('./CustomDomain.vue')),
            isRequired: true,

            props: {
              destination: activeSiteHostname(props.site, { isProd: true }).value,
              uiSize: 'md',
            },
          }),
        ],
      }),
      createOption({
        key: 'group.instructions',
        label: 'Domain Setup Instructions',
        input: 'group',
        icon: { class: 'i-tabler-world-longitude' },
        options: [
          createOption({
            key: 'domainSetupInstructions',
            input: vue.defineAsyncComponent(() => import('./CustomDomainInstructions.vue')),
            props: {
              destination: activeSiteHostname(props.site, { isProd: true }).value,
            },
          }),
        ],
      }),

    ],
  }),

]

const v = vue.computed({
  get: () => props.site.toConfig(),
  set: async (v) => {
    await updateSite({ site: props.site, newConfig: v, caller: 'updateGlobalSettings' })
  },
})
</script>

<template>
  <ElTool
    v-bind="props"
  >
    <ElForm>
      <FormEngine
        v-model="v"
        state-key="publishSettings"
        :options="options"
        :input-props="{ site }"
      />
    </ElForm>
  </ElTool>
</template>
