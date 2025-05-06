<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { InputOption } from '@fiction/ui'
import type { Site } from '../../site'
import type { CardConfigPortable } from '../../tables'
import type { ToolKeys } from './tools.js'
import { toSlug, vue } from '@fiction/core'
import TabbedOptions from '@fiction/ui/inputs/TabbedOptions.vue'
import { requestManagePage } from '../../utils/region'
import { getPageOptions } from './utils'

const { site, controller } = defineProps<{
  site: Site
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
}>()

const loading = vue.ref(false)

const pageTemplates = vue.computed(() => {
  return site.theme.value.settings.getPageTemplates?.()
})

const options = vue.computed<InputOption[]>(() => {
  const optionGroups = getPageOptions({ site, editMode: 'new', pageTemplates: pageTemplates.value })
  return [optionGroups.basic]
})

const page = vue.ref<CardConfigPortable>({
  title: '',
  slug: '',
  cards: [{ templateId: 'cardHeroV1' }],
  nav: 'show',
  pageTemplateId: '',
})

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

  const pg = page.value

  if (pg.pageTemplateId) {
    const t = pageTemplates.value?.find(tpl => tpl.pageTemplateId === pg.pageTemplateId)

    pg.cards = await t?.getCards?.({ site }) ?? []
  }

  await requestManagePage({
    site,
    _action: 'upsert',
    regionCard: page.value,
    delay: 400,
    successMessage: 'Page Saved',
  })
  loading.value = false

  controller.useTool({ toolId: 'pages' })
}
</script>

<template>
  <TabbedOptions
    :model-value="page"
    title="Create New Page"
    :options
    :input-props="{ site, tool }"
    @update:temp-value="page = $event"
    @apply="save()"
    @cancel="site.editorActivateTool({ toolId: '' })"
  />
</template>
