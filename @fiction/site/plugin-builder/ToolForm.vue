<script lang="ts" setup>
import type { vue } from '@fiction/core'
import { getNested, localRef, setNested } from '@fiction/core'
import type { InputOption } from '@fiction/ui'
import ElInput from '@fiction/ui/ElInput.vue'
import TransitionSlide from '@fiction/ui/TransitionSlide.vue'
import type { Site } from '..'
import ElToolSep from './ElToolSep.vue'

const props = defineProps({
  options: { type: Array as vue.PropType<InputOption[]>, required: true },
  loading: { type: Boolean, default: false },
  modelValue: { type: Object as vue.PropType<Record<string, unknown>>, default: () => {} },
  depth: { type: Number, default: 0 },
  site: { type: Object as vue.PropType<Site>, required: true },
  basePath: { type: String, default: '' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: Record<string, unknown>): void
}>()

const menuVisibility = localRef<Record<string, boolean>>({ lifecycle: 'local', def: {}, key: 'toolForm' })

function hide(key: string, val?: boolean) {
  if (val !== undefined)
    menuVisibility.value = { ...menuVisibility.value, [key]: val }

  return menuVisibility.value[key]
}

function getOptionPath(key: string) {
  return props.basePath ? `${props.basePath}.${key}` : key
}
</script>

<template>
  <div class="">
    <div class="flex gap-4 flex-col">
      <div
        v-for="(opt, i) in options.filter(_ => !_.settings.isHidden)"
        :key="i"
      >
        <div v-if="opt.input.value === 'group'" :class="depth > 0 ? 'border border-theme-200 dark:border-theme-700 rounded-md overflow-hidden' : ''">
          <div
            class=" py-2 px-4 text-xs flex justify-between cursor-pointer items-center"
            :class="[
              !hide(opt.key.value) || depth === 0 ? 'border-b ' : '',
              hide(opt.key.value) ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-200 border-primary-200 dark:border-primary-800' : 'border-theme-200 dark:border-theme-700 text-theme-500 dark:text-theme-100 hover:bg-theme-50 dark:hover:bg-theme-800 active:bg-theme-100 dark:active:bg-theme-700',
            ]"
            @click="hide(opt.key.value, !hide(opt.key.value))"
          >
            <div class="font-semibold" v-html="opt.label.value" />
            <div v-if="opt.key.value" class="text-lg">
              <div class="i-tabler-chevron-up transition-all" :class="hide(opt.key.value) ? 'rotate-180' : ''" />
            </div>
          </div>
          <TransitionSlide>
            <div v-show="!hide(opt.key.value)">
              <div class="p-4">
                <ToolForm
                  :options="opt.options.value || []"
                  :model-value="modelValue"
                  :depth="1"
                  :site="site"
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
        <div v-else :class="depth === 0 ? 'px-4' : ''" :data-depth="depth">
          <ElInput
            class="setting-input"
            v-bind="opt.outputProps.value"
            :input="opt.input.value"
            input-class="bg-theme-50 dark:bg-theme-800 text-theme-700 dark:text-theme-25 border-theme-300 dark:border-theme-600"
            :model-value="getNested({ path: getOptionPath(opt.key.value), data: modelValue })"
            :site="site"
            @update:model-value="emit('update:modelValue', setNested({ path: getOptionPath(opt.key.value), data: modelValue, value: $event }))"
          />
        </div>
      </div>
    </div>
  </div>
</template>
