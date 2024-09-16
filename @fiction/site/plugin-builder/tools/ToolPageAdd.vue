<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { Site } from '../../site'
import type { CardConfigPortable } from '../../tables'
import type { ToolKeys } from './tools.js'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { toSlug, vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { requestManagePage } from '../../utils/region'
import InputSlug from '../InputSlug.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  controller: { type: Object as vue.PropType<AdminEditorController<{ toolIds: ToolKeys }>>, required: true },
})
const loading = vue.ref(false)

const options: InputOption[] = [
  new InputOption({
    key: 'pageSetup',
    label: 'Page Setup',
    input: 'group',
    options: [
      new InputOption({ key: 'title', label: 'Name', input: 'InputText', placeholder: 'Page Name', isRequired: true }),
      new InputOption({ key: 'slug', label: 'Slug', input: InputSlug, placeholder: 'my-page', isRequired: true }),
    ],
  }),

]

const page = vue.ref<CardConfigPortable>({ title: '', slug: '', cards: [{ templateId: 'hero' }] })

vue.onMounted(() => {
  /**
   * Set viewId when title is written for convenience
   */
  const slugFromTitle = vue.ref('')
  vue.watch(
    () => page.value.title,
    (title) => {
      if (page.value && title && (!page.value.slug || page.value.slug === slugFromTitle.value)) {
        slugFromTitle.value = toSlug(title)
        page.value = { ...page.value, slug: slugFromTitle.value }
      }
    },
  )
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

  props.controller.useTool({ toolId: 'managePages' })
}
</script>

<template>
  <ElTool
    :actions="[]"
    v-bind="props"
    :back="{ name: 'Manage Pages', onClick: () => controller.useTool({ toolId: 'managePages' }) }"
    title="Add Page"
  >
    <ElForm @submit="save()">
      <FormEngine v-model="page" state-key="pageEdit" :options :input-props="{ site }" />

      <div class="text-right px-4 py-2">
        <ElInput input="InputSubmit" :loading rounding="full" data-test-id="requestCreateNewPage">
          Create New Page
        </ElInput>
      </div>
    </ElForm>
  </ElTool>
</template>
