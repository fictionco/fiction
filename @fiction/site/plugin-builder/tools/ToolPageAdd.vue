<script lang="ts" setup>
import { toSlug, vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import ToolForm from '@fiction/admin/tools/ToolForm.vue'
import type { CardConfigPortable } from '../../tables'
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

const options = [
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

const page = vue.ref<CardConfigPortable>({ title: '', slug: '' })

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

  props.controller.useTool({ toolId: 'pageMaster' })
}
</script>

<template>
  <ElTool
    :actions="[]"
    v-bind="props"
    :back="{ name: 'Manage Pages', onClick: () => controller.useTool({ toolId: 'pageMaster' }) }"
    title="Add Page"
  >
    <ElForm @submit="save()">
      <ToolForm v-model="page" :options :input-props="{ site }" />

      <div class="text-right px-4 py-2">
        <ElInput input="InputSubmit" :loading rounding="full">
          Create New Page
        </ElInput>
      </div>
    </ElForm>
  </ElTool>
</template>
