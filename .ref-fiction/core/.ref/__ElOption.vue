<script lang="ts">
</script>

<script lang="ts" setup>
import { vue } from '@factor/api'
import ElInput from '@factor/ui/ElInput.vue'
import type { InputOption } from '../inputOption'

const props = defineProps({
  option: {
    type: Object as vue.PropType<InputOption<string>>,
    required: true,
  },
})

export default {
  inheritAttrs: false,
}

const input = vue.computed(() => {
  return props.option.input
})

const isComponent = vue.computed(() => {
  return typeof input.value !== 'string'
})

const attrs = vue.useAttrs()

const passAttributes = vue.computed(() => {
  const { label, subLabel, description, props: optionProps } = props.option
  return { label, subLabel, description, ...optionProps.value, ...attrs }
})

const classes = vue.computed(() => {
  let format: string[] = []
  if (input.value === 'InputToggle')
    format = ['flex', 'justify-between', 'items-center']

  return ['form-setting-input', ...format]
})
</script>

<template>
  <div
    class="form-setting-input"
    :class="option.isVisible.value ? '' : 'hidden'"
  >
    <ElInput
      :class="classes"
      v-bind="passAttributes"
      :input="input"
    >
      <component
        :is="input"
        v-if="isComponent"
        :class="classes"
        v-bind="passAttributes"
      />
    </ElInput>
  </div>
</template>
