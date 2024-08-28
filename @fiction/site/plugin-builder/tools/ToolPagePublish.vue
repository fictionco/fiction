<script lang="ts" setup>
import type { FictionApp } from '@fiction/core'
import { useService, vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElModalConfirm from '@fiction/ui/ElModalConfirm.vue'
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import ToolForm from '@fiction/admin/tools/ToolForm.vue'
import type { Site } from '../../site'
import type { TableSiteConfig } from '../../tables'
import { tableNames } from '../../tables'
import { activeSiteHostname, saveSite } from '../../utils/site'
import type { ToolKeys } from './tools'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  saveText: { type: String, default: 'Save' },
  controller: { type: Object as vue.PropType<AdminEditorController<{ toolIds: ToolKeys }>>, required: true },
})

const { fictionAppSites } = useService<{ fictionAppSites: FictionApp }>()
const loading = vue.ref(false)

function getSuffixUrl() {
  return new URL(fictionAppSites.liveUrl.value).hostname.split('.').slice(-2).join('.')
}
const options = [
  new InputOption({
    key: 'editor.hidePublishing',
    label: 'Domain',
    input: 'group',
    options: [
      new InputOption({
        key: 'subDomain',
        label: 'Fiction Domain',
        input: 'InputUsername',
        isRequired: true,

        props: {
          beforeInput: 'https://',
          afterInput: getSuffixUrl(),
          table: tableNames.sites,
          columns: [{ name: 'subDomain' }],
          uiSize: 'lg',
        },
      }),
      new InputOption({
        key: 'customDomains',
        label: 'Custom Domain',
        input: vue.defineAsyncComponent(() => import('../InputCustomDomains.vue')),
        isRequired: true,

        props: {
          destination: activeSiteHostname(props.site, { isProd: true }).value,
          uiSize: 'lg',
        },
      }),
    ],
  }),

]

const tempSite = vue.ref<Partial<TableSiteConfig>>({})

const v = vue.computed({
  get: () => ({ ...props.site.toConfig(), ...props.site.editor.value.tempSite }),
  set: v => (props.site.editor.value.tempSite = v),
})

async function save() {
  loading.value = true
  await saveSite({ site: props.site, delayUntilSaveConfig: props.site.editor.value.tempSite, successMessage: 'Published Successfully', isPublishingDomains: true })
  props.site.editor.value.tempSite = {}
  loading.value = false
}

function reset() {
  tempSite.value = {}
}
const showConfirm = vue.ref(false)
</script>

<template>
  <ElTool
    :actions="[]"
    v-bind="props"
  >
    <ElForm @submit="showConfirm = true">
      <ToolForm v-model="v" :options="options" :input-props="{ site }" />

      <div class="text-right px-4 py-2 border-t border-theme-200 dark:border-theme-600 pt-4 space-x-4 flex justify-between">
        <XButton rounding="full" theme="default" @click="reset()">
          Reset
        </XButton>
        <XButton
          :loading="loading"
          type="submit"
          theme="primary"
          rounding="full"
          :disabled="Object.keys(props.site.editor.value.tempSite).length === 0"
          :title="Object.keys(props.site.editor.value.tempSite).length === 0 ? 'No changes to publish' : 'Publish'"
        >
          Publish Domain Changes
        </XButton>
      </div>
    </ElForm>
    <ElModalConfirm
      v-model:vis="showConfirm"
      title="Domain Changes"
      sub="Changes to your sub domain or custom domain will take effect immediately. You'll need to make appropriate changes with your domain provider. Are you sure you want to proceed?"
      @confirmed="save()"
    />
  </ElTool>
</template>
