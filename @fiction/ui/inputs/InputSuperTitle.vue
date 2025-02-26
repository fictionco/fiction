<script lang="ts" setup>
import type { SuperTitle } from '@fiction/core'
import { SuperTitleSchema as schema, vue } from '@fiction/core'
import FormEngine from './FormEngine.vue'
import { createOption } from './index.js'

defineOptions({ name: 'InputActionArea' })

const { modelValue } = defineProps<{ modelValue?: SuperTitle }>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: SuperTitle): void
}>()

const options = vue.computed(() => {
  const o = [
    createOption({ key: 'text', label: 'Text', input: 'InputText', schema }),
    createOption({ key: 'icon', label: 'Icon', input: 'InputIcon', schema }),
    createOption({ key: 'theme', label: 'Theme', input: 'InputColorTheme', schema }),
    createOption({ key: 'href', label: 'Link', input: 'InputSiteRoute', schema }),
  ]

  return [
    createOption({
      key: 'superTitleGroup',
      label: 'Super Title',
      input: 'group',
      icon: { class: 'i-tabler-arrow-badge-up' },
      isClosed: true,
      options: o,
    }),
  ]
})
</script>

<template>
  <div>
    <FormEngine
      state-key="superTitleInput"
      :depth="1"
      :model-value="modelValue"
      ui-size="md"
      :options
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>
