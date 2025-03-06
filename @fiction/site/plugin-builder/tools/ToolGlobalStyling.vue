<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { InputOption } from '@fiction/ui'
import type { Site } from '../../site'
import type { ToolKeys } from './tools'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { colorThemeUser, vue } from '@fiction/core'
import { SiteSchema as schema } from '@fiction/site/schema'
import { createOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { updateSite } from '../../utils/site'

const { site, tool } = defineProps<{
  site: Site
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
}>()

const options: InputOption[] = [
  createOption({
    schema,
    key: 'colorScheme',
    label: 'Color Theme Settings',
    input: 'group',
    icon: { class: 'i-tabler-moon' },
    options: [
      createOption({
        schema,
        key: 'userConfig.site.prefersColorScheme',
        label: 'Theme Mode',
        subLabel: 'Control how your site appears to visitors',
        input: 'InputRadioButton',
        props: { uiSize: 'sm' },
        list: [
          { value: 'auto', label: 'Auto' },
          { value: 'light', label: 'Always Light' },
          { value: 'dark', label: 'Always Dark' },
        ],
        placeholder: 'Select theme behavior',
      }),
    ],
  }),
  createOption({
    schema,
    key: 'group.globalColors',
    label: 'Global Colors',
    input: 'group',
    icon: { class: 'i-tabler-palette' },
    options: [
      createOption({
        schema,
        key: 'userConfig.standard.primaryColor',
        label: 'Primary Color',
        subLabel: 'Used for buttons, links, and important elements',
        input: 'InputColorTheme',
        list: colorThemeUser,
        placeholder: 'Default',
      }),
    ],
  }),
  // Typography Group
  createOption({
    schema,
    key: 'globalFonts',
    label: 'Typography',
    icon: { class: 'i-tabler-text-size' },
    input: 'group',
    options: [
      createOption({
        schema,
        key: 'group.fonts.main',
        label: 'Primary Fonts',
        icon: { class: 'i-tabler-text-increase' },
        input: 'group',
        options: [
          createOption({
            schema,
            key: 'userConfig.site.fonts.title',
            label: 'Headings',
            subLabel: 'Used for page titles and major headings',
            input: 'InputFont',
            props: { noPreview: true },
          }),
          createOption({
            schema,
            key: 'userConfig.site.fonts.body',
            label: 'Main Text',
            subLabel: 'Used for paragraphs and general content',
            input: 'InputFont',
            props: { noPreview: true },
          }),
        ],
      }),

      createOption({
        schema,
        key: 'groupl.fonts.accent',
        label: 'Accent Fonts',
        icon: { class: 'i-tabler-text-decrease' },
        input: 'group',
        options: [
          createOption({
            schema,
            key: 'userConfig.site.fonts.highlight',
            label: 'Accent Text',
            subLabel: 'Used for emphasis and special text',
            input: 'InputFont',
            props: { noPreview: true },
          }),
          createOption({
            schema,
            key: 'userConfig.site.fonts.sans',
            label: 'Sans-Serif',
            subLabel: 'Modern, clean style for UI elements',
            input: 'InputFont',
            props: { noPreview: true },
          }),
          createOption({
            schema,
            key: 'userConfig.site.fonts.serif',
            label: 'Serif',
            subLabel: 'Traditional style for formal content',
            input: 'InputFont',
            props: { noPreview: true },
          }),
          createOption({
            schema,
            key: 'userConfig.site.fonts.mono',
            label: 'Monospace',
            subLabel: 'Fixed-width font for code and technical content',
            input: 'InputFont',
            props: { noPreview: true },
          }),
        ],
      }),

    ],
  }),
]

const v = vue.computed({
  get: () => site.toConfig(),
  set: async (v) => {
    await updateSite({ site, newConfig: v, caller: 'updateGlobalStyling' })
  },
})
</script>

<template>
  <ElTool
    :tool
    :title="tool.title"
    :icon="tool.icon"
  >
    <ElForm class="p-2">
      <FormEngine
        v-model="v"
        state-key="globalStyling"
        :options
        :input-props="{ site }"
        :depth="1"
      />
    </ElForm>
  </ElTool>
</template>
