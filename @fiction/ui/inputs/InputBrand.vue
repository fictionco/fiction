<script lang="ts" setup>
import type { BrandObject } from '@fiction/core'
import type { InputOption } from './index.js'
import { brandSchema as schema } from '@fiction/core'
import FormEngine from './FormEngine.vue'
import { createOption } from './index.js'

const { modelValue } = defineProps<{ modelValue?: BrandObject }>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: BrandObject): void
}>()

const options: InputOption[] = [
  createOption({ key: 'logo', label: 'Logo', input: 'InputLogo', schema }),
  createOption({ key: 'href', label: 'Link', input: 'InputSiteRoute', schema }),
  createOption({ key: 'tagline', label: 'Tagline / Alt', input: 'InputText', schema }),
  createOption({ key: 'action', input: 'InputActionArea', label: 'Action Area', isClosed: true, schema }),
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
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>
