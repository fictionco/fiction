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
  engineIndex,
  initialGroupKey,
} = defineProps<{
  stateKey?: string
  options: InputOption[]
  activePath?: string
  editPath?: string
  loading?: boolean
  modelValue?: Record<string, unknown>
  depth?: number
  basePath?: string
  classes?: { inputWrap?: string, tabWrap?: string, groupPad?: string }
  inputProps?: Record<string, unknown>
  uiSize?: UiElementSize
  buttons?: ActionButton[]
  disableGroupHide?: boolean
  format?: 'control' | 'input'
  aligned?: 'left' | 'right' | 'center'
  engineIndex?: number
  initialGroupKey?: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: Record<string, unknown>): void
  (event: 'update:activePath', payload: string): void
  (event: 'update:updatePath', payload: string): void
  (event: 'keydown', payload: KeyboardEvent): void
  (event: 'activate', payload: string): void
}>()

const filteredOptions = vue.computed(() => {
  return options.filter((opt) => {
    return !opt.isHidden.value && opt.isVisible({ index: engineIndex, value: modelValue, path: basePath })
  })
})

// Groups at the current depth
const groupOptions = vue.computed(() =>
  filteredOptions.value.filter(opt => opt.input.value === 'group'),
)

// Non-group elements at the current depth
const standardOptions = vue.computed(() =>
  filteredOptions.value.filter(opt => opt.input.value !== 'group'),
)

// Use tabs only when multiple groups exist at the same depth
const useTabsForGroups = vue.computed(() => groupOptions.value.length)

// Initialize activeTabIndex with the matching group index if provided
function initialTabIndex() {
  if (initialGroupKey && depth === 0) {
    const index = groupOptions.value.findIndex(opt =>
      opt.key.value === initialGroupKey || opt.key.value === `group.${initialGroupKey}`,
    )
    return index >= 0 ? index : (groupOptions.value[0]?.isClosed.value ? -1 : 0)
  }
  return groupOptions.value[0]?.isClosed.value ? -1 : 0
}

const activeTabIndex = vue.ref(initialTabIndex())
const lastTabIndex = vue.ref(-1)

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
    return false

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
      groupPad: 'p-4 @[350px]:px-6 @[500px]:px-8 @[700px]:px-10 pt-6',
      inputGap: 'gap-5 @sm:gap-7 @xl:gap-10',
      tab: 'py-2 px-4 text-xs font-normal',
    },
    lg: {
      groupHeader: 'py-2.5 px-3 text-sm',
      groupPad: 'px-8 lg:px-10 @xl:px-12 py-8 pb-10  pt-10',
      inputGap: 'gap-7',
      tab: 'py-3 px-4 text-sm font-normal',
    },
  }

  const out = configs[uiSize as 'md' | 'lg']

  return out
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

function getTabClasses(index: number) {
  const base = cls.value.tab
  const active = activeTabIndex.value === index
    ? 'text-theme-600 dark:text-theme-0 border-b-2 border-theme-500 dark:border-theme-0 bg-theme-50 dark:bg-theme-700/50'
    : 'text-theme-600 dark:text-theme-400 hover:text-theme-500 dark:hover:text-theme-200 border-b-2 border-transparent'

  return `rounded-t ${base} ${active}`
}

const rootListClasses = vue.computed(() => {
  const defaultClass = format === 'control' ? 'divide-y divide-theme-200/50 dark:divide-theme-600/50 gap-0' : cls.value.inputGap

  return twMerge(['flex flex-col', defaultClass])
})

function getInputWrapClasses(opt: InputOption) {
  const defaultClass = format === 'control' ? '@[800px]:px-16 @[800px]:py-12 @[500px]:p-8 px-4 py-6' : opt.settings.uiFormat !== 'naked' && depth === 0 ? 'px-6' : ''
  return twMerge([defaultClass, classes.inputWrap || 'max-w-[600px]'])
}

function getGroupClasses(opt: InputOption) {
  return classes?.groupPad || (opt.settings.format === 'control' ? '' : cls.value.groupPad)
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

function handleTabChange(index: number) {
  lastTabIndex.value = activeTabIndex.value
  activeTabIndex.value = index
}
</script>

<template>
  <div
    class="@container/engine flex flex-col "
    :class="[`form-engine-${depth}`, cls.inputGap]"
    :data-value="depth === 0 ? JSON.stringify(modelValue) : undefined"
    :data-form-engine-depth="depth"
    :data-options-len="options.length"
  >
    <!-- Standard non-group options -->
    <div v-if="standardOptions.length > 0" :class="rootListClasses">
      <template v-for="(opt, i) in standardOptions" :key="i">
        <ElToolSep
          v-if="opt.input.value === 'title'"
          :text="opt.label.value"
          class="mb-1"
          :class="i === 0 ? 'mt-0' : 'mt-1'"
        />
        <input v-else-if="opt.input.value === 'hidden'" :data-option-path="opt.key.value" type="hidden" :value="getNested({ path: getOptionPath({ opt }), data: modelValue })">

        <div v-else :class="getInputWrapClasses(opt)" :data-depth="depth" :data-option-key="opt.key.value">
          <ElInput
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

    <!-- Group options with tabbed interface -->
    <div v-if="groupOptions.length > 0">
      <!-- Tabs for groups when enabled -->
      <div v-if="useTabsForGroups" class="overflow-x-auto no-scrollbar border-b border-theme-200 dark:border-theme-600/60 sticky top-0 z-10 pt-2 bg-theme-0 dark:bg-theme-900">
        <div class="flex px-1.5">
          <button
            v-for="(opt, i) in groupOptions"
            :key="i"
            :class="getTabClasses(i)"
            @click="handleTabChange(i)"
          >
            <div class="flex items-center gap-2 font-semibold">
              <XIcon v-if="opt.settings.icon" class="size-[1.1em]" :media="opt.settings.icon" />
              <span class=" whitespace-nowrap" v-html="opt.label.value" />
            </div>
          </button>
        </div>
      </div>

      <!-- Group content -->
      <div class="relative" :class="classes.tabWrap">
        <template v-for="(opt, i) in groupOptions" :key="i">
          <div
            v-if="useTabsForGroups ? i === activeTabIndex || activeTabIndex === -1 : true"
            :class="[
              depth > 0 ? '' : '',
              hide(opt) && !useTabsForGroups ? 'overflow-hidden' : '',
            ]"
            :data-option-key="opt.key.value"
            :data-option-depth="depth"
          >
            <!-- Group header (only for non-tabbed version) -->
            <div
              v-if="!useTabsForGroups && opt.label.value"
              class="select-none flex justify-between cursor-pointer items-center hover:opacity-90 rounded-t-md overflow-hidden"
              :class="getGroupHeaderClasses(opt)"
              @click="hide(opt, 'toggle')"
            >
              <div class="flex items-center gap-2">
                <XIcon v-if="opt.settings.icon" class="size-[1.2em]" :media="opt.settings.icon" />
                <div class="font-semibold" v-html="opt.label.value" />
                <div v-if="opt.key.value && !disableGroupHide" class="text-[1.2em] i-tabler-chevron-up transition-all" :class="hide(opt) ? 'rotate-180' : ''" />
              </div>
            </div>

            <!-- Group content with transition (only for non-tabbed version) -->
            <TransitionSlide v-if="!useTabsForGroups">
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
                    :classes="classes"
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

            <!-- Group content without transition (for tabbed version) -->
            <div v-if="useTabsForGroups && i === activeTabIndex" :class="getGroupClasses(opt)">
              <FormEngine
                :state-key="stateKey"
                :ui-size="uiSize"
                :base-path="basePath"
                :edit-path="editPath"
                :active-path="activePath"
                :input-props="inputProps"
                :options="opt.options.value || []"
                :classes="classes"
                :model-value="modelValue"
                :depth="depth + 1"
                :format="opt.settings.format"
                @update:model-value="emit('update:modelValue', $event)"
                @update:active-path="emit('update:activePath', $event)"
                @activate="activateOption({ opt, path: $event })"
              />
            </div>
          </div>
        </template>
      </div>
    </div>

    <XButtonList :buttons="buttons" class="mt-4 flex items-center justify-center" />
  </div>
</template>
