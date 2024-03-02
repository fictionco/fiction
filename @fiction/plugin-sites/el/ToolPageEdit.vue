<script lang="ts" setup>
import { toSlug, vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import ElInput from '@fiction/ui/ElInput.vue'
import ElForm from '@fiction/ui/ElForm.vue'
import type { CardConfigPortable } from '../tables'
import type { Site } from '../site'
import { requestManagePage } from '../utils/region'
import type { EditorTool } from './tools'
import ElTool from './ElTool.vue'
import ToolForm from './ToolForm.vue'
import InputSlug from './InputSlug.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  saveText: { type: String, default: 'Save' },
  mode: { type: String as vue.PropType<'editPage' | 'createPage'>, required: true },
})
const control = props.site.settings.factorSites
const loading = vue.ref(false)

const options = [
  new InputOption({
    key: 'pageSetup',
    label: 'Page Setup',
    input: 'group',
    options: [
      new InputOption({ key: 'title', label: 'Name', input: 'InputText', placeholder: 'Page Name', isRequired: true }),
      new InputOption({ key: 'slug', label: 'Slug', input: InputSlug, placeholder: 'my-page', isRequired: true }),
      new InputOption({ key: 'slug', label: 'Default Page / Home', input: 'InputCheckbox', props: { text: 'Use as Homepage' } }),
    ],
  }),
  new InputOption({
    key: 'pageSeo',
    label: 'SEO / Meta Tags',
    input: 'group',
    options: [
      new InputOption({ key: 'userConfig.seoTitle', label: 'Title', input: 'InputText' }),
      new InputOption({ key: 'userConfig.seoDescription', label: 'Description', input: 'InputTextarea', props: { rows: 5 } }),
    ],
  }),

]

const page = vue.ref<CardConfigPortable>({})

vue.onMounted(() => {
  if (props.mode === 'createPage') {
    page.value = {
      title: '',
      slug: '',
      userConfig: {
        seoTitle: '',
        seoDescription: '',
      },
    }
  }
  else {
    vue.watch(
      () => props.site.editor.value.selectedPageId,
      (v) => {
        if (v)
          page.value = props.site.pages.value.find(r => r.cardId === v)?.toConfig() || {}
      },
      { immediate: true },
    )
  }

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

  control.useTool({ toolId: 'pages' })
}
</script>

<template>
  <ElTool
    :actions="[]"
    v-bind="props"
    :back="{
      name: 'All Pages',
      onClick: () => control.useTool({ toolId: 'pages' }),
    }"
  >
    <ElForm @submit="save()">
      <ToolForm
        v-model="page"
        :options="options"
        :site="site"
      />

      <div class="text-right px-4 py-2">
        <ElInput input="InputSubmit" :loading="loading">
          {{ saveText }}
        </ElInput>
      </div>
    </ElForm>
  </ElTool>
</template>

<style lang="less" scoped>
.region-setting-input {
  --input-bg: theme('colors.theme.100');
}
</style>
