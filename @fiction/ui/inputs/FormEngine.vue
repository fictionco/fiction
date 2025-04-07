<script lang="ts" setup>
import type { ActionButton } from '@fiction/core'
import type { UiElementSize } from '../utils'
import type { InputOption } from './index.js'
import { getNested, setNested, vue } from '@fiction/core'
import { twMerge } from 'tailwind-merge'
import TransitionSlide from '../anim/TransitionSlide.vue'
import XButtonList from '../buttons/XButtonList.vue'
import XIcon from '../media/XIcon.vue'
import ElInput from './ElInput.vue'
import ElToolSep from './ElToolSep.vue'

defineOptions({ name: 'FormEngine' })

const {
  options,
  activePath,
  editPath,
  basePath = '',
  stateKey = 'formEngine',
  modelValue = {},
  depth = 0,
  classes = {},
  inputProps = {},
  uiSize = 'md',
  buttons = [],
  disableGroupHide = false,
  format = 'input',
} = defineProps<{
  stateKey?: string
  options: InputOption[]
  activePath?: string
  editPath?: string
  loading?: boolean
  modelValue?: Record<string, unknown>
  depth?: number
  basePath?: string
  classes?: { inputWrap?: string }
  inputProps?: Record<string, unknown>
  uiSize?: UiElementSize
  buttons?: ActionButton[]
  disableGroupHide?: boolean
  format?: 'control' | 'input'
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: Record<string, unknown>): void
  (event: 'update:activePath', payload: string): void
  (event: 'update:updatePath', payload: string): void
  (event: 'keydown', payload: KeyboardEvent): void
  (event: 'activate', payload: string): void
}>()

// Create a function to recursively get all group options and their isClosed status
function getGroupClosedStatus(options: InputOption[]): Record<string, boolean> {
  return options.reduce((acc, opt) => {
    if (opt.input.value === 'group') {
      acc[opt.key.value] = opt.isClosed.value
      if (opt.options.value) {
        Object.assign(acc, getGroupClosedStatus(opt.options.value))
      }
    }
    return acc
  }, {} as Record<string, boolean>)
}

const menuVisibility = vue.ref<Record<string, boolean>>(getGroupClosedStatus(options))

function hide(opt: InputOption, change?: 'toggle' | 'show' | 'hide') {
  const key = opt.key.value || opt.label.value

  if (disableGroupHide || !key)
    return

  if (change) {
    let val: boolean
    if (change === 'toggle') {
      val = !menuVisibility.value[key]
    }
    else if (change === 'show') {
      val = false
    }
    else {
      val = true
    }

    menuVisibility.value = { ...menuVisibility.value, [key]: val }
  }

  return menuVisibility.value[key]
}

const cls = vue.computed(() => {
  const configs = {
    md: {
      groupHeader: 'py-1.5 px-2 text-xs',
      groupPad: 'p-4 @[500px]:p-8 @[700px]:p-10 pr-0',
      inputGap: 'gap-5 @sm:gap-7 @xl:gap-10',
    },
    lg: {
      groupHeader: 'py-2.5 px-3 text-sm',
      groupPad: 'px-8 lg:px-10 @xl:p-12 py-8 pb-10  pr-0',
      inputGap: 'gap-7',
    },
  }

  return configs[uiSize as 'md' | 'lg']
})

function getGroupHeaderClasses(opt: InputOption) {
  const isHidden = hide(opt)

  const out = [cls.value.groupHeader]

  if (isHidden) {
    out.push(' text-theme-600 dark:text-theme-100 border-primary-200 dark:border-theme-600')
  }
  else {
    out.push('border-theme-300/50 dark:border-theme-500/30 text-theme-500 dark:text-theme-100 hover:bg-theme-50 dark:hover:bg-theme-800 active:bg-theme-100 dark:active:bg-theme-700')
    if (depth > 0) {
      out.push('')
    }
    else {
      out.push('border-b')
    }
  }

  return out.join(' ')
}

const rootListClasses = vue.computed(() => {
  const defaultClass = format === 'control' ? '@[800px]:grid grid-cols-2 divide-y divide-theme-200/50 dark:divide-theme-600/50 gap-0' : cls.value.inputGap

  return twMerge(['flex flex-col', defaultClass])
})

function getInputWrapClasses(opt: InputOption) {
  const defaultClass = format === 'control' ? '@[500px]:p-8 px-4 py-6' : opt.settings.uiFormat !== 'naked' && depth === 0 ? 'px-6' : ''
  return twMerge([defaultClass, classes.inputWrap || ''])
}

function getGroupClasses(opt: InputOption) {
  return opt.settings.format === 'control' ? '' : [cls.value.groupPad, '']
}

function getOptionPath(args: { opt: InputOption, index?: number, mode?: 'base' | 'edit' }): string {
  const { opt, index, mode = 'base' } = args
  const key = opt.key.value
  const input = opt.input.value

  const root = mode === 'edit' ? editPath : basePath
  // Ignore the key if this is an InputControl
  if (typeof input === 'string' && input === 'InputControl') {
    return root || ''
  }
  const path = root ? `${root}.${key}` : key

  return (index !== undefined && index >= 0) ? `${path}.${index}` : path
}

function update(args: { opt: InputOption, value: Record<string, unknown> }) {
  const { opt, value } = args
  const path = getOptionPath({ opt })
  emit('update:modelValue', setNested({ path, data: modelValue, value }))

  // used to track which paths have been updated
  emit('update:updatePath', path)
}

function activateOption(args: { opt: InputOption, path: string }) {
  const { opt, path } = args

  if (opt.input.value === 'group') {
    hide(opt, 'show')
  }
  emit('activate', path)
}
</script>

<template>
  <div
    class="@container/engine"
    :class="`form-engine-${depth}`"
    :data-value="depth === 0 ? JSON.stringify(modelValue) : undefined"
    :data-form-engine-depth="depth"
    :data-options-len="options.length"
  >
    <div :class="rootListClasses">
      <template v-for="(opt, i) in options.filter(_ => !_.settings.isHidden)" :key="i">
        <div
          v-if="opt.input.value === 'group'"
          :class="[
            depth > 0 ? '' : 'pr-4',
            hide(opt) ? 'overflow-hidden' : '',
          ]"
          :data-option-key="opt.key.value"
          :data-option-depth="depth"
        >
          <div
            v-if="opt.label.value"
            class=" select-none flex justify-between cursor-pointer items-center hover:opacity-90 rounded-t-md overflow-hidden"
            :class="getGroupHeaderClasses(opt)"
            @click="hide(opt, 'toggle')"
          >
            <div class="flex items-center gap-2">
              <XIcon v-if="opt.settings.icon" class="size-[1.2em]" :media="opt.settings.icon" />
              <div class="font-semibold" v-html="opt.label.value" />
              <div v-if="opt.key.value && !disableGroupHide" class="text-[1.2em] i-tabler-chevron-up transition-all" :class="hide(opt) ? 'rotate-180' : ''" />
            </div>
          </div>
          <TransitionSlide>
            <div v-show="!hide(opt)">
              <div :class="getGroupClasses(opt)">
                <FormEngine
                  :state-key="stateKey"
                  :ui-size="uiSize"
                  :base-path="basePath"
                  :edit-path="editPath"
                  :active-path="activePath"
                  :input-props="inputProps"
                  :options="opt.options.value || []"
                  :classes
                  :model-value="modelValue"
                  :depth="depth + 1"
                  :format="opt.settings.format"
                  @update:model-value="emit('update:modelValue', $event)"
                  @update:active-path="emit('update:activePath', $event)"
                  @activate="activateOption({ opt, path: $event })"
                />
              </div>
            </div>
          </TransitionSlide>
        </div>

        <ElToolSep
          v-else-if="opt.input.value === 'title'"
          :text="opt.label.value"
          class="mb-1"
          :class="i === 0 ? 'mt-0' : 'mt-1'"
        />
        <input v-else-if="opt.input.value === 'hidden'" :data-option-path="opt.key.value" type="hidden" :value="getNested({ path: getOptionPath({ opt }), data: modelValue })">

        <div v-else :class="getInputWrapClasses(opt)" :data-depth="depth" :data-option-key="opt.key.value">
          <ElInput
            v-if="opt.isHidden.value !== true"
            :ui-size="uiSize"
            :active-path="activePath"
            :data-option-path="opt.key.value"
            :data-test-id="opt.settings.testId || opt.key.value"
            class="setting-input"
            :input-class="opt.settings.inputClass"
            v-bind="{ ...opt.wrapProps.value }"
            :input-props="{
              ...opt.outputProps.value,
              ...inputProps,
              ...(opt.input.value === 'InputControl' ? { controlOption: opt } : {}),
            }"
            :input="opt.input.value"
            :model-value="getNested({ path: getOptionPath({ opt }), data: modelValue })"
            :edit-path="[basePath, editPath, opt.key.value].filter(Boolean).join('.')"
            @update:model-value="update({ opt, value: $event })"
            @update:active-path="emit('update:activePath', $event)"
            @keydown="emit('keydown', $event)"
            @activate="activateOption({ opt, path: $event })"
          />
        </div>
      </template>
    </div>
    <XButtonList :buttons class="mt-4 flex items-center justify-center" />
  </div>
</template>
