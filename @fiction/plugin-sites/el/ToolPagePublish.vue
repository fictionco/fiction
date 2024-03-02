<script lang="ts" setup>
import type { FictionApp } from '@fiction/core'
import { useService, vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import ElButton from '@fiction/ui/ElButton.vue'
import ElForm from '@fiction/ui/ElForm.vue'
import type { Site } from '../site'
import type { TableSiteConfig } from '../tables'
import { tableNames } from '../tables'
import { saveSite } from '../utils/site'
import type { EditorTool } from './tools'
import ElTool from './ElTool.vue'
import ToolForm from './ToolForm.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  saveText: { type: String, default: 'Save' },
})

const { fictionAppSites } = useService<{ fictionAppSites: FictionApp }>()
const loading = vue.ref(false)

function getSuffixUrl() {
  return new URL(fictionAppSites.liveUrl.value).hostname.split('.').slice(-2).join('.')
}
const options = [
  new InputOption({
    key: 'editor.hidePublishing',
    label: 'Publishing',
    input: 'group',
    options: [
      new InputOption({
        key: 'subDomain',
        label: 'Development / Staging Domain',
        input: 'InputUsername',
        isRequired: true,
        props: {
          beforeInput: 'https://',
          afterInput: getSuffixUrl(),
          table: tableNames.sites,
          column: 'subDomain',
        },
      }),
      new InputOption({
        key: 'customDomains',
        label: 'Production Domain (Custom)',
        input: vue.defineAsyncComponent(() => import('./InputCustomDomains.vue')),
        isRequired: true,
        props: {
          destination: props.site.hostname.value,
        },
      }),
    ],
  }),

]

const tempSite = vue.ref<Partial<TableSiteConfig>>({})

const v = vue.computed({
  get: () => ({ ...props.site.toConfig(), ...tempSite.value }),
  set: v => (tempSite.value = v),
})

async function save() {
  const confirmed = confirm('Make sure to update your DNS settings to point to the new domain')

  if (!confirmed)
    return

  loading.value = true
  await saveSite({ site: props.site, delayUntilSaveConfig: tempSite.value })
  tempSite.value = {}
  loading.value = false
}

function reset() {
  tempSite.value = {}
}
</script>

<template>
  <ElTool
    :actions="[]"
    v-bind="props"
  >
    <ElForm @submit="save()">
      <ToolForm v-model="v" :options="options" :site="site" />

      <div class="text-right px-4 py-2 border-t border-theme-200 dark:border-theme-600 pt-4 space-x-4 flex justify-between">
        <ElButton btn="default" @click="reset()">
          Reset
        </ElButton>
        <ElButton :loading="loading" type="submit" btn="primary" :disabled="Object.keys(tempSite).length === 0">
          Save Publish Settings
        </ElButton>
      </div>
    </ElForm>
  </ElTool>
</template>

<style lang="less" scoped>
.region-setting-input {
  --input-bg: theme('colors.theme.100');
}
</style>
