<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { Site } from '../../site'
import type { ToolKeys } from './tools.js'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { requestManagePage } from '../../utils/region'
import InputSlug from '../InputSlug.vue'

const props = defineProps<{
  site: Site
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
}>()

const { controller, site, tool } = props

const loading = vue.ref(false)

const page = vue.computed(() => site.editPageConfig.value)

const options = vue.computed<InputOption[]>(() => {
  return [
    new InputOption({
      key: 'pageSetup',
      label: 'Name / Slug',
      input: 'group',
      options: [
        new InputOption({ key: 'title', label: 'Name', input: 'InputText', placeholder: 'Page Name', isRequired: true }),
        new InputOption({ key: 'slug', label: 'Slug', input: InputSlug, placeholder: 'my-page', isRequired: true, props: { site } }),
      ],
    }),
    new InputOption({
      key: 'manageLayout',
      label: 'Page Layout',
      input: 'group',
      options: [
        new InputOption({
          key: 'manageLayoutInput',
          input: vue.defineAsyncComponent(() => import('./InputManageLayout.vue')),
          props: { site, tool },
        }),
        new InputOption({
          key: 'addElementsInputs',
          input: vue.defineAsyncComponent(() => import('./InputAddElements.vue')),
          props: { site, tool },
        }),
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
    site,
    _action: 'upsert',
    regionCard: page.value,
    delay: 400,
    successMessage: 'Page Saved',
  })
  loading.value = false

  controller.useTool({ toolId: 'managePages' })
}
</script>

<template>
  <ElTool
    :actions="[]"
    v-bind="props"
    title="Edit Page"
  >
    <ElForm @submit="save()">
      <FormEngine
        state-key="pageEdit"
        v-model="site.editPageConfig.value"
        :options
        :input-props="{ site, tool }"
      />

      <div class="text-right px-4 py-2">
        <ElInput input="InputSubmit" :loading rounding="full">
          Save Page
        </ElInput>
      </div>
    </ElForm>
  </ElTool>
</template>
