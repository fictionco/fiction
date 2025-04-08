<script lang="ts" setup>
import type { SuperTitle } from '@fiction/core'
import { SuperTitleSchema as schema, vue } from '@fiction/core'
import FormEngine from './FormEngine.vue'
import { createOption } from './index.js'

defineOptions({ name: 'InputSuperTitle' })

const { modelValue, activePath, editPath } = defineProps<{ modelValue?: SuperTitle, activePath?: string, editPath?: string }>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: SuperTitle): void
  (event: 'update:activePath', payload: string): void
}>()

const options = vue.computed(() => {
  const o = [
    createOption({ key: 'text', label: 'Text', input: 'InputText', schema, placeholder: 'Enter text' }),
    createOption({ key: 'icon', label: 'Icon', input: 'InputIcon', schema }),
    createOption({ key: 'theme', label: 'Theme', input: 'InputColorTheme', schema }),
    createOption({ key: 'href', label: 'Link', input: 'InputSiteRoute', schema }),
  ]

  return [
    createOption({
      key: 'superTitleGroup',
      label: 'Context Title',
      input: 'group',
      icon: { class: 'i-tabler-heading' },
      isClosed: true,
      options: o,
    }),
  ]
})
</script>

<template>
  <div class="super-title-input">
    <FormEngine
      state-key="superTitleInput"
      :depth="1"
      :model-value="modelValue"
      ui-size="md"
      :options
      :active-path="activePath"
      :edit-path="editPath"
      @update:model-value="emit('update:modelValue', $event)"
      @update:active-path="emit('update:activePath', $event)"
    />
  </div>
</template>
