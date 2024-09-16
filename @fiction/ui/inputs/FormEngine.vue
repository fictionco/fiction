<script lang="ts" setup>
import type { ActionItem } from '@fiction/core'
import type { UiElementSize } from '../utils'
import type { InputOption } from './index.js'
import { getNested, localRef, setNested, vue } from '@fiction/core'
import TransitionSlide from '../anim/TransitionSlide.vue'
import ElActions from '../buttons/ElActions.vue'
import ElInput from './ElInput.vue'
import ElToolSep from './ElToolSep.vue'

const {
  options,
  stateKey,
  modelValue = {},
  depth = 0,
  basePath = '',
  inputProps = {},
  uiSize = 'md',
  actions = [],
  disableGroupHide = false,
} = defineProps<{
  stateKey: string
  options: InputOption[]
  loading?: boolean
  modelValue?: Record<string, unknown>
  depth?: number
  basePath?: string
  inputProps?: Record<string, unknown>
  uiSize?: UiElementSize
  actions?: ActionItem[]
  disableGroupHide?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: Record<string, unknown>): void
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

const menuVisibility = localRef<Record<string, boolean>>({
  lifecycle: 'session',
  def: getGroupClosedStatus(options),
  key: `FormEngine-${stateKey}`,
})

function hide(key: string, val?: boolean) {
  if (disableGroupHide)
    return

  if (val !== undefined)
    menuVisibility.value = { ...menuVisibility.value, [key]: val }

  return menuVisibility.value[key]
}

function getOptionPath(key: string) {
  return basePath ? `${basePath}.${key}` : key
}

const cls = vue.computed(() => {
  const configs = {
    md: {
      groupHeader: 'py-1.5 px-3 text-xs',
      groupPad: 'p-4',
      inputGap: 'gap-4',
    },
    lg: {
      groupHeader: 'py-2.5 px-4 text-sm',
      groupPad: 'px-8 lg:px-10 py-6',
      inputGap: 'gap-6',
    },
  }

  return configs[uiSize as 'md' | 'lg']
})
</script>

<template>
  <div :data-options-len="options.length">
    <div class="flex flex-col" :class="cls.inputGap">
      <div v-for="(opt, i) in options.filter(_ => !_.settings.isHidden)" :key="i">
        <div
          v-if="opt.input.value === 'group'"
          :class="[
            depth > 0 ? 'border rounded-md ' : '',
            hide(opt.key.value) ? 'overflow-hidden border-theme-300 dark:border-theme-600' : 'border-theme-200 dark:border-theme-700',
          ]"
        >
          <div
            v-if="opt.label.value"
            class=" select-none flex justify-between cursor-pointer items-center hover:opacity-90 antialiased"
            :class="[
              cls.groupHeader,
              !hide(opt.key.value) || depth === 0 ? 'border-b ' : '',
              hide(opt.key.value) ? 'bg-theme-50 dark:bg-theme-700 text-theme-600 dark:text-theme-100 border-primary-200 dark:border-theme-600' : 'border-theme-300/50 dark:border-theme-700 text-theme-500 dark:text-theme-100 hover:bg-theme-50 dark:hover:bg-theme-800 active:bg-theme-100 dark:active:bg-theme-700',
            ]"
            @click="hide(opt.key.value, !hide(opt.key.value))"
          >
            <div class="font-semibold" v-html="opt.label.value" />
            <div v-if="opt.key.value && !disableGroupHide" class="text-lg i-tabler-chevron-up transition-all" :class="hide(opt.key.value) ? 'rotate-180' : ''" />
          </div>
          <TransitionSlide>
            <div v-show="!hide(opt.key.value)">
              <div :class="cls.groupPad">
                <FormEngine
                  :state-key="stateKey"
                  :ui-size="uiSize"
                  :input-props="inputProps"
                  :options="opt.options.value || []"
                  :model-value="modelValue"
                  :depth="depth + 1"
                  :base-path="basePath"
                  @update:model-value="emit('update:modelValue', $event)"
                />
              </div>
            </div>
          </TransitionSlide>
        </div>

        <ElToolSep
          v-else-if="opt.input.value === 'title'"
          :text="opt.label.value"
          class="mb-2"
          :class="i === 0 ? 'mt-0' : 'mt-8'"
        />
        <div v-else :class="opt.settings.uiFormat !== 'naked' && depth === 0 ? 'px-6' : ''" :data-depth="depth">
          <ElInput
            v-if="opt.isHidden.value !== true"
            :ui-size="uiSize"
            :data-key="opt.key.value"
            class="setting-input"
            :input-class="opt.settings.inputClass || 'max-w-md'"
            v-bind="{ ...inputProps, ...opt.outputProps.value }"
            :input="opt.input.value"
            :model-value="getNested({ path: getOptionPath(opt.key.value), data: modelValue })"
            @update:model-value="emit('update:modelValue', setNested({ path: getOptionPath(opt.key.value), data: modelValue, value: $event }))"
          />
        </div>
      </div>
    </div>
    <ElActions :actions class="mt-4 flex items-center justify-center" />
  </div>
</template>
