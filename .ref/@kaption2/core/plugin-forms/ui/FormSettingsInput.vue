<script lang="ts">
</script>

<script lang="ts" setup>
import { vue } from '@factor/api'
import ElInput from '@factor/ui/ElInput.vue'
import type { InputOption } from '../../utils/inputOption'

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

const attrs = vue.useAttrs()

const passAttributes = vue.computed(() => {
  const { label, description, props: optionProps } = props.option
  return { label, description, ...optionProps.value, ...attrs }
})

const classes = vue.computed(() => {
  let format: string[] = []
  if (input.value === 'InputToggle')
    format = ['flex', 'justify-between', 'items-center']

  return ['form-setting-input', ...format]
})
</script>

<template>
  <div class="form-setting-input">
    <template v-if="typeof input === 'string'">
      <ElInput
        :class="classes"
        v-bind="passAttributes"
        :input="input"
      />
    </template>
    <template v-else>
      <component
        :is="input"
        :class="classes"
        v-bind="passAttributes"
      />
    </template>
  </div>
</template>

<style lang="less" scoped>
.form-setting-input {
  --input-size: 12px;
  --input-label-size: 11px;
  --input-bg: #ffffff;
}
</style>
