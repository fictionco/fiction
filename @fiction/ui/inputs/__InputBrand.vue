<script lang="ts" setup>
import type { BrandObject } from '@fiction/core'
import type { InputOption } from './index.js'
import { brandSchema as schema } from '@fiction/core'
import FormEngine from './FormEngine.vue'
import { createOption } from './index.js'

defineOptions({ name: 'InputBrand' })

const { modelValue, activePath, editPath } = defineProps<{ modelValue?: BrandObject, activePath?: string, editPath?: string }>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: BrandObject): void
  (event: 'update:activePath', payload: string): void
}>()

const options: InputOption[] = [
  createOption({ key: 'logo', label: 'Logo', input: 'InputLogo', schema }),
  createOption({ key: 'href', label: 'Link', input: 'InputSiteRoute', schema }),
  createOption({ key: 'tagline', label: 'Tagline / Alt', input: 'InputText', schema }),
  createOption({ key: 'action.buttons', input: 'InputActions', label: 'Action Area', isClosed: true, schema }),
]
</script>

<template>
  <div>
    <FormEngine
      state-key="brandInput"
      :depth="1"
      :model-value="modelValue"
      ui-size="md"
      :options="options"
      :active-path="activePath"
      :edit-path="editPath"
      @update:model-value="emit('update:modelValue', $event)"
      @update:active-path="emit('update:activePath', $event)"
    />
  </div>
</template>
