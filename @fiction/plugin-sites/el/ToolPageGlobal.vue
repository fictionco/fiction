<script lang="ts" setup>
import { toSlug, vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import ElInput from '@fiction/ui/ElInput.vue'
import ElForm from '@fiction/ui/ElForm.vue'
import type { Site } from '../site'
import { requestManagePage } from '../utils/region'
import { updateSite } from '../utils/site'
import type { EditorTool } from './tools'
import ElTool from './ElTool.vue'
import ToolForm from './ToolForm.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
})

const control = props.site.settings.fictionSites
const loading = vue.ref(false)

const options = [

  new InputOption({
    key: 'editor.hideSiteDetails',
    label: 'Global Site Details',
    input: 'group',
    options: [
      new InputOption({ key: 'title', label: 'Site Title', input: 'InputText', isRequired: true }),
      new InputOption({ key: 'userConfig.faviconUrl', label: 'Favicon (32px x 32px)', input: 'InputMediaUpload' }),
      new InputOption({ key: 'userConfig.timeZone', label: 'Site Time Zone', input: 'InputTimezone' }),
      new InputOption({ key: 'userConfig.languageCode', label: 'Site Language Code', input: 'InputText', placeholder: 'en' }),
    ],
  }),

]

vue.onMounted(() => {
  /**
   * Set viewId when title is written for convenience
   */
  const idByTitle = vue.ref('')
  vue.watch(
    () => props.site.editPageConfig.value,
    (v) => {
      if (v && v.title && (!v.slug || v.slug === idByTitle.value))
        v.slug = idByTitle.value = toSlug(v.title)
    },
  )
})

async function save() {
  loading.value = true
  await requestManagePage({
    site: props.site,
    _action: 'upsert',
    regionCard: props.site.editPageConfig.value,
    delay: 400,
    successMessage: 'Page Saved',
  })
  loading.value = false

  props.site.editPageConfig.value = {}

  control.useTool({ toolId: 'pages' })
}

const v = vue.computed({
  get: () => props.site.toConfig(),
  set: (v) => {
    updateSite({ site: props.site, newConfig: v })
    props.site.frame.syncSite({ caller: 'updateGlobalSettings' })
  },
})
</script>

<template>
  <ElTool
    :actions="[]"
    v-bind="props"
  >
    <ElForm @submit="save()">
      <ToolForm
        v-model="v"
        :options="options"
        :site="site"
      />

      <div class="text-right px-4 py-2">
        <ElInput input="InputSubmit" :loading="loading">
          Save Global Settings
        </ElInput>
      </div>
    </ElForm>
  </ElTool>
</template>
