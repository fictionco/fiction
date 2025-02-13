<script lang="ts" setup>
import type { LogoObject } from '@fiction/core'
import { logoSchema as schema, vue } from '@fiction/core'
import { createOption } from '.'
import ElInput from './ElInput.vue'
import FormEngine from './FormEngine.vue'

defineOptions({ name: 'InputLogo' })

const props = defineProps({
  modelValue: { type: Object as vue.PropType<LogoObject>, default: () => ({}) },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: LogoObject): void
}>()

const v = vue.computed(() => props.modelValue || {})
const variant = vue.computed(() => v.value.variant || 'typography')
function handleLogoUpdate(newValue: LogoObject) {
  emit('update:modelValue', newValue)
}

const mediaOptions = [
  createOption({
    schema,
    key: 'group',
    label: 'Logo Media',
    input: 'group',
    options: [
      createOption({
        schema,
        key: 'media',
        label: 'Logo Media',
        input: 'InputMedia',
      }),
      createOption({
        schema,
        key: 'scale',
        label: 'Size Scale',
        input: 'InputRange',
        props: { min: 0.5, max: 3, step: 0.01, startValue: 1 },
      }),
    ],
  }),
]

const typographyOptions = [
  createOption({
    schema,
    key: 'group',
    label: 'Logo Typography',
    input: 'group',
    options: [
      createOption({
        schema,
        key: 'typography.label',
        label: 'Logo Text',
        input: 'InputText',
      }),
      createOption({
        schema,
        key: 'typography.font',
        label: 'Font',
        input: 'InputFont',
        props: { noPreview: true },
      }),
      createOption({
        schema,
        key: 'typography.weight',
        label: 'Weight',
        input: 'InputSelect',
        list: [
          { value: 'inherit', name: 'Inherit' },
          { value: '400', name: 'Regular' },
          { value: '500', name: 'Medium' },
          { value: '600', name: 'Medium' },
          { value: '700', name: 'Bold' },
          { value: '800', name: 'Extra-Bold' },
          { value: '900', name: 'Black' },
          { value: '300', name: 'Light' },
        ],
      }),
      createOption({
        schema,
        key: 'scale',
        label: 'Size Scale',
        input: 'InputRange',
        props: { min: 0.5, max: 3, step: 0.01, startValue: 1 },
      }),
    ],
  }),
]
</script>

<template>
  <div class="relative space-y-4">
    <ElInput
      :model-value="variant"
      class="my-2"
      input="InputRadioButton"
      ui-size="sm"
      :list="['typography', 'media']"
      @update:model-value="handleLogoUpdate({ ...v, variant: $event })"
    />
    <div v-if="variant === 'media'">
      <FormEngine
        state-key="typographyHandling"
        :depth="2"
        :model-value="modelValue"
        ui-size="md"
        :options="mediaOptions"
        @update:model-value="handleLogoUpdate"
      />
    </div>
    <div v-else>
      <FormEngine
        state-key="typographyHandling"
        :depth="2"
        :model-value="modelValue"
        ui-size="md"
        :options="typographyOptions"
        @update:model-value="handleLogoUpdate"
      />
    </div>
  </div>
</template>
