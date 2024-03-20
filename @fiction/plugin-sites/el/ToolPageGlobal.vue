<script lang="ts" setup>
import { toSlug, vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import ElInput from '@fiction/ui/ElInput.vue'
import ElForm from '@fiction/ui/ElForm.vue'
import type { Site } from '../site'
import { saveSite, updateSite } from '../utils/site'
import type { EditorTool } from './tools'
import ElTool from './ElTool.vue'
import ToolForm from './ToolForm.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
})

const loading = vue.ref(false)

const options = [

  new InputOption({
    key: 'editor.hideSiteDetails',
    label: 'Global Site Details',
    input: 'group',
    options: [
      new InputOption({ key: 'title', label: 'Site Title', input: 'InputText', isRequired: true }),
      new InputOption({ key: 'userConfig.faviconUrl', label: 'Favicon', input: 'InputMediaUpload' }),
      new InputOption({ key: 'userConfig.shareImage', label: 'Share Image', description: 'Image appears when your site is shared', input: 'InputMediaUpload' }),
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
  await saveSite({ site: props.site, successMessage: 'Settings saved' })
  loading.value = false
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
