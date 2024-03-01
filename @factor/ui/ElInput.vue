<script lang="ts">
</script>

<script lang="ts" setup>
import { omit, vue } from '@factor/api'
import { inputs } from './inputs'

const props = defineProps({
  modelValue: {
    type: [String, Object, Array, Number, Date, Boolean],
    default: undefined,
  },
  label: { type: String, default: '' },
  subLabel: { type: String, default: '' },
  description: { type: String, default: '' },
  descriptionFormat: {
    type: String as vue.PropType<'popover' | 'subhead'>,
    default: 'popover',
  },
  input: {
    type: [String, Object] as vue.PropType<keyof typeof inputs | vue.Component | 'title' | 'group'>,
    default: undefined,
  },
  defaultValue: {
    type: [String, Object, Array, Number, Date, Boolean],
    default: undefined,
  },
})

const emit = defineEmits(['update:modelValue'])

if (props.defaultValue && props.modelValue === undefined)
  emit('update:modelValue', props.defaultValue)

const attrs = vue.useAttrs() as {
  for?: string
  class?: string
  required?: string
}

const inputEl = vue.ref<vue.ComponentPublicInstance>()
const valid = vue.ref<boolean | undefined>()
const inputComponent = vue.computed(() => {
  const inp = props.input
  if (inp === 'title' || inp === 'group') {
    return ''
  }
  else if (inp && typeof inp === 'string') {
    const r = inputs[inp].el
    return r
  }
  else {
    return props.input || ''
  }
})

/**
 * Set the validity of the input using the native constraint API
 */
async function setValidity(): Promise<void> {
  const el = inputEl.value?.$el as HTMLElement | HTMLInputElement

  if (el) {
    if (
      (el instanceof HTMLInputElement || el instanceof HTMLSelectElement)
      && el.checkValidity
    ) {
      valid.value = el.checkValidity()
    }
    else if (el.querySelector) {
      const realEl = el.querySelector('input') ?? el.querySelector('select')

      // for regular inputs
      if (realEl && realEl.checkValidity)
        valid.value = realEl.checkValidity()
      else valid.value = true
    }
  }
}

async function updateValue(value: any): Promise<void> {
  await setValidity()
  emit('update:modelValue', value)
}

vue.onMounted(() => {
  // Let the child els load
  setTimeout(async () => {
    await setValidity()
  }, 300)
})
</script>

<template>
  <div
    :key="label"
    class="f-el-input space-y-0.5 font-sans"
    :class="[valid ? 'valid' : 'not-valid', attrs.class]"
  >
    <div
      v-if="label || description"
      class="text-input-label-size flex justify-between mb-1"
    >
      <div class="text items-center text-xs">
        <div class="flex items-center space-x-2 text-theme-700 dark:text-theme-0">
          <label
            v-if="label"
            class="font-medium"
            :for="attrs.for"
            v-text="label"
          />
          <div v-if="description" class="group relative">
            <div class="text-theme-500 hover:text-theme-400">
              <div class="i-carbon-information" />
            </div>
            <div
              class="bg-theme-0 absolute -left-4 z-30 mt-2 hidden w-56 origin-top-right rounded-md p-3 text-[10px] shadow-lg ring-1 ring-black/10 focus:outline-none group-hover:block"
            >
              {{ description }}
            </div>
          </div>
        </div>
        <div
          v-if="subLabel"
          class="text-theme-500 text-xs"
          v-html="subLabel"
        />
      </div>
      <slot name="labelRight" />
    </div>
    <div class="input-area">
      <component
        :is="inputComponent"
        v-if="inputComponent"
        ref="inputEl"
        :model-value="modelValue"
        v-bind="omit(attrs, 'class')"
        @update:model-value="updateValue($event)"
      >
        <slot />
      </component>
      <slot v-else />
      <slot name="after" />
    </div>
  </div>
</template>
