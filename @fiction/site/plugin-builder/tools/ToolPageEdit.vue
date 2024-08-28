<script lang="ts" setup>
import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import ToolForm from '@fiction/admin/tools/ToolForm.vue'
import type { Site } from '../../site'
import { requestManagePage } from '../../utils/region'
import InputSlug from '../InputSlug.vue'
import type { ToolKeys } from './tools.js'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  controller: { type: Object as vue.PropType<AdminEditorController<{ toolIds: ToolKeys }>>, required: true },
})

const loading = vue.ref(false)

const page = vue.computed(() => props.site.editPageConfig.value)

const options = vue.computed(() => {
  return [
    new InputOption({
      key: 'manageLayout',
      label: 'Page Layout',
      input: 'group',
      options: [
        new InputOption({
          key: 'manageLayoutInput',
          input: vue.defineAsyncComponent(() => import('./InputManageLayout.vue')),
        }),
        new InputOption({
          key: 'addElementsInputs',
          input: vue.defineAsyncComponent(() => import('./InputAddElements.vue')),
        }),
      ],
    }),
    new InputOption({
      key: 'pageSetup',
      label: 'Page Setup',
      input: 'group',
      options: [
        new InputOption({ key: 'title', label: 'Name', input: 'InputText', placeholder: 'Page Name', isRequired: true }),
        new InputOption({ key: 'slug', label: 'Slug', input: InputSlug, placeholder: 'my-page', isRequired: true }),
      ],
    }),
    new InputOption({
      key: 'pageSeo',
      label: 'SEO / Meta Tags',
      input: 'group',
      options: [
        new InputOption({ key: 'userConfig.seo.title', label: 'Title', input: 'InputText' }),
        new InputOption({ key: 'userConfig.seo.description', label: 'Description', input: 'InputTextarea', props: { rows: 5 } }),
      ],
    }),
  ]
})

async function save() {
  loading.value = true
  await requestManagePage({
    site: props.site,
    _action: 'upsert',
    regionCard: page.value,
    delay: 400,
    successMessage: 'Page Saved',
  })
  loading.value = false

  props.controller.useTool({ toolId: 'pageMaster' })
}
</script>

<template>
  <ElTool
    :actions="[]"
    v-bind="props"
    :back="{ name: 'Manage Pages', onClick: () => controller.useTool({ toolId: 'pageMaster' }) }"
    title="Edit Page"
  >
    <ElForm @submit="save()">
      <ToolForm
        v-model="site.editPageConfig.value"
        :options="options"
        :input-props="{ site, tool }"
      />

      <div class="text-right px-4 py-2">
        <ElInput input="InputSubmit" :loading="loading">
          Save Page
        </ElInput>
      </div>
    </ElForm>
  </ElTool>
</template>
