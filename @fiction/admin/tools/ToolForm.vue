<script lang="ts" setup>
import { getNested, localRef, setNested, vue } from '@fiction/core'
import type { ActionItem } from '@fiction/core'
import type { InputOption } from '@fiction/ui'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import TransitionSlide from '@fiction/ui/anim/TransitionSlide.vue'
import ElToolSep from '@fiction/admin/tools/ElToolSep.vue'
import type { UiElementSize } from '@fiction/ui/utils'
import type { Card } from '@fiction/site/card'
import ElActions from '@fiction/ui/buttons/ElActions.vue'

const props = defineProps({
  options: { type: Array as vue.PropType<InputOption[]>, required: true },
  loading: { type: Boolean, default: false },
  modelValue: { type: Object as vue.PropType<Record<string, unknown>>, default: () => {} },
  depth: { type: Number, default: 0 },
  basePath: { type: String, default: '' },
  inputProps: { type: Object as vue.PropType<Record<string, unknown>>, default: () => ({}) },
  uiSize: { type: String as vue.PropType<UiElementSize>, default: 'md' },
  card: { type: Object as vue.PropType<Card>, default: undefined },
  actions: { type: Array as vue.PropType<ActionItem[]>, default: () => [] },
  disableGroupHide: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: Record<string, unknown>): void
}>()

const menuVisibility = localRef<Record<string, boolean>>({ lifecycle: 'local', def: {}, key: 'toolForm' })

function hide(key: string, val?: boolean) {
  if (props.disableGroupHide)
    return

  if (val !== undefined)
    menuVisibility.value = { ...menuVisibility.value, [key]: val }

  return menuVisibility.value[key]
}

function getOptionPath(key: string) {
  return props.basePath ? `${props.basePath}.${key}` : key
}

const cls = vue.computed(() => {
  const configs = {
    md: {
      groupHeader: 'py-2 px-4 text-xs',
      groupPad: 'p-4',
      inputGap: 'gap-4',
    },
    lg: {
      groupHeader: 'py-3 px-5 text-sm',
      groupPad: 'p-8 lg:p-10',
      inputGap: 'gap-6',
    },
  }

  return configs[props.uiSize as 'md' | 'lg']
})
</script>

<template>
  <div>
    <div class="flex flex-col" :class="cls.inputGap">
      <div
        v-for="(opt, i) in options.filter(_ => !_.settings.isHidden)"
        :key="i"
      >
        <div
          v-if="opt.input.value === 'group'"
          :class="[
            depth > 0 ? 'border rounded-md overflow-hidden' : '',
            hide(opt.key.value) ? 'border-theme-300 dark:border-theme-600' : 'border-theme-200 dark:border-theme-700',
          ]"
        >
          <div
            class=" select-none flex justify-between cursor-pointer items-center hover:opacity-90 antialiased"
            :class="[
              cls.groupHeader,
              !hide(opt.key.value) || depth === 0 ? 'border-b ' : '',
              hide(opt.key.value) ? 'bg-theme-50 dark:bg-theme-700 text-theme-600 dark:text-theme-100 border-primary-200 dark:border-theme-500' : 'border-theme-300/50 dark:border-theme-700 text-theme-500 dark:text-theme-100 hover:bg-theme-50 dark:hover:bg-theme-800 active:bg-theme-100 dark:active:bg-theme-700',
            ]"
            @click="hide(opt.key.value, !hide(opt.key.value))"
          >
            <div class="font-semibold" v-html="opt.label.value" />
            <div v-if="opt.key.value && !disableGroupHide" class="text-lg i-tabler-chevron-up transition-all" :class="hide(opt.key.value) ? 'rotate-180' : ''" />
          </div>
          <TransitionSlide>
            <div v-show="!hide(opt.key.value)">
              <div :class="cls.groupPad">
                <ToolForm
                  :ui-size="uiSize"
                  :input-props="inputProps"
                  :options="opt.options.value || []"
                  :model-value="modelValue"
                  :depth="1"
                  :base-path="basePath"
                  :card
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
        <div v-else :class="opt.settings.uiFormat !== 'naked' && depth === 0 ? 'px-4' : ''" :data-depth="depth">
          <ElInput
            v-if="opt.isHidden.value !== true"
            :ui-size="uiSize"
            class="setting-input"
            v-bind="{ ...inputProps, ...opt.outputProps.value }"
            :input="opt.input.value"
            :model-value="getNested({ path: getOptionPath(opt.key.value), data: modelValue })"
            :card
            @update:model-value="emit('update:modelValue', setNested({ path: getOptionPath(opt.key.value), data: modelValue, value: $event }))"
          />
        </div>
      </div>
    </div>
    <ElActions :actions class="mt-4 flex items-center justify-center" />
  </div>
</template>
