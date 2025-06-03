<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { UiElementSize } from '../utils'
import { resetUi, vue, waitFor } from '@fiction/core'
import { inputs } from '.'
import { smoothScrollToView } from '../anim/scrolling'

defineOptions({ name: 'ElInput' })

const {
  modelValue,
  label = '',
  subLabel = '',
  description = '',
  inputProps = {},
  uiSize = 'md',
  input,
  defaultValue,
  editPath,
  activePath,
  placeholder,
  required,
  disabled,
  list,
  rows,
} = defineProps<{
  modelValue?: any
  label?: string
  subLabel?: string
  description?: string
  inputProps?: InputProps
  uiSize?: UiElementSize
  input?: keyof typeof inputs | vue.Component | 'title' | 'group' | 'hidden'
  defaultValue?: any
  editPath?: string
  activePath?: string
  placeholder?: string
  disabled?: boolean | string
  required?: boolean
  list?: (NavListItem | string)[] | readonly (NavListItem | string)[]
  rows?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'update:editIndex', value: number): void
  (e: 'update:activePath', value: string): void
  (e: 'keydown', value: KeyboardEvent): void
  (e: 'activate', value: string): void
}>()

type InputProps = {
  class?: string
  required?: boolean
  disabled?: boolean | string
  readonly?: boolean
  placeholder?: string
  autocomplete?: string
  autofocus?: boolean
  spellcheck?: boolean
  tabindex?: number
  inputmode?: string
  pattern?: string
  minlength?: number
  maxlength?: number
  min?: number
  max?: number
  step?: number
  multiple?: boolean
  accept?: string
  capture?: string
  [key: string]: any
}

if (defaultValue && modelValue === undefined)
  emit('update:modelValue', defaultValue)

const attrs = vue.useAttrs() as { for?: string, class?: string, required?: string, [key: string]: any }

const inputEl = vue.ref<vue.ComponentPublicInstance>()
const valid = vue.ref<boolean | undefined>()
const inputComponent = vue.computed(() => {
  const inp = input
  if (inp === 'title' || inp === 'group' || inp === 'hidden') {
    return ''
  }
  else if (inp && typeof inp === 'string') {
    const r = inputs[inp]?.el
    return r
  }
  else {
    return input || ''
  }
})

/**
 * Set the validity of the input using the native constraint API
 */
async function setValidity(): Promise<void> {
  const el = inputEl.value?.$el as HTMLElement | HTMLInputElement

  if (el) {
    if ((el instanceof HTMLInputElement || el instanceof HTMLSelectElement) && el.checkValidity) {
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

const inputRef = vue.ref<HTMLElement>()
const activated = vue.ref(false)
const isHighlighted = vue.ref(false)

vue.onMounted(() => {
  // Let the child els load
  setTimeout(async () => {
    await setValidity()
  }, 300)

  vue.watch(
    () => activePath,
    async () => {
      if (activePath && activePath === editPath) {
        activated.value = true
        emit('activate', activePath)
        await waitFor(500)
        if (inputRef.value) {
          const scrolled = await smoothScrollToView({
            element: inputRef.value,
            onlyIfNeeded: true,
            containerClass: 'scroll-container',
          })

          // Brief pause after scrolling if needed
          if (scrolled)
            await waitFor(50)

          // Show highlight animation
          isHighlighted.value = true
          setTimeout(() => {
            isHighlighted.value = false
          }, 600)
        }
      }
      else {
        activated.value = false
        isHighlighted.value = false
      }
    },
    { immediate: true },
  )
})

const cls = vue.computed(() => {
  const size = uiSize
  const map = {
    sm: { labelSize: 'text-[11px]' },
    md: { labelSize: 'text-xs' },
    lg: { labelSize: 'text-sm' },
    xl: { labelSize: 'text-base' },
  }

  return map[size as keyof typeof map] || map.md
})

function updateActivePath() {
  emit('update:activePath', editPath || '')
  resetUi({ scope: 'inputs', cause: `ElInputClick`, trigger: 'elementClick' })
}

const componentProps = vue.computed(() => {
  return {
    //   ...omit(attrs, 'class', 'data-test-id', 'data-option-path', 'model-value'),
    placeholder,
    required,
    disabled,
    list,
    rows,
    ...inputProps,
  }
})
</script>

<template>
  <div
    ref="inputRef"
    :key="label"
    :edit-path="editPath || '---'"
    :active-path="activePath || '---'"
    class="f-el-input space-y-0.5 font-sans "
    :class="[
      valid ? 'valid' : 'not-valid',
      attrs.class,
      isHighlighted ? 'highlight-selected' : '',
    ]"
    @click.stop="updateActivePath()"
  >
    <div v-if="label || description" class="text-input-label-size flex justify-between mb-1.5" :class="disabled ? 'opacity-50' : ''">
      <div class="text items-center" :class="cls.labelSize">
        <div
          class="flex items-center space-x-2 text-theme-700 dark:text-theme-0"
        >
          <label v-if="label" class="font-semibold" :for="attrs.for" v-text="label" />
          <div v-if="description || subLabel" class="group relative flex items-center">
            <div class="text-lg text-theme-500 hover:text-theme-400 i-tabler-help group-hover:opacity-40 cursor-help" />
            <div class="pointer-events-none bg-theme-0 dark:bg-theme-700 dark:border-theme-600 border dark:text-theme-0 absolute -left-4 top-full z-30 mt-2 opacity-0 max-h-0 w-56 origin-top-right rounded-md p-4 text-xs shadow-lg ring-1 ring-black/10 focus:outline-none group-hover:max-h-[300px] group-hover:opacity-100 transition-all">
              {{ description || subLabel }}
            </div>
          </div>
        </div>
      </div>
      <slot name="labelRight" />
    </div>
    <div
      class="input-area"
    >
      <component
        :is="inputComponent"
        v-if="inputComponent"
        ref="inputEl"
        :data-input-el="typeof input === 'string' ? input : 'custom'"
        :model-value="modelValue"
        :ui-size="uiSize"
        v-bind="componentProps"
        :edit-path="editPath"
        :active-path="activePath"
        @update:model-value="updateValue($event)"
        @update:edit-index="emit('update:editIndex', $event)"
        @keydown="emit('keydown', $event)"
        @activate="emit('activate', $event)"
      >
        <slot />
      </component>
      <slot v-else />
      <slot name="after" />
    </div>
  </div>
</template>
