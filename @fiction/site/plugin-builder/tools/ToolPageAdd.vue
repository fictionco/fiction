<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { InputOption } from '@fiction/ui'
import type { Site } from '../../site'
import type { CardConfigPortable } from '../../tables'
import type { ToolKeys } from './tools.js'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { toSlug, vue } from '@fiction/core'
import { createOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { requestManagePage } from '../../utils/region'
import { getPageOptions } from './utils'

const { site, controller } = defineProps<{
  site: Site
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
}>()

const loading = vue.ref(false)
const options = vue.computed<InputOption[]>(() => {
  const optionGroups = getPageOptions({ site })
  return [optionGroups.essentials]
})

const page = vue.ref<CardConfigPortable>({ title: '', slug: '', cards: [{ templateId: 'cardHeroV1' }] })

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
    :tool="tool"
    :title="tool.title"
    :icon="tool.icon"
  >
    <ElForm class="p-2" @submit="save()">
      <FormEngine v-model="page" state-key="pageEdit" :options :input-props="{ site }" :depth="1" />

      <div
        class="text-right mt-4"
      >
        <ElInput
          input="InputSubmit"
          :loading
          rounding="full"
          data-test-id="requestCreateNewPage"
          icon="i-tabler-plus"
        >
          Create New Page
        </ElInput>
      </div>
    </ElForm>
  </ElTool>
</template>
