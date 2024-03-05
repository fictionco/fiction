<script lang="ts" setup>
import type { vue } from '@fiction/core'
import { getNested, localRef, setNested } from '@fiction/core'
import type { InputOption } from '@fiction/ui'
import ElInput from '@fiction/ui/ElInput.vue'
import type { Site } from '..'
import ElToolSep from './ElToolSep.vue'

const props = defineProps({
  options: { type: Array as vue.PropType<InputOption[]>, required: true },
  loading: { type: Boolean, default: false },
  modelValue: { type: Object as vue.PropType<Record<string, unknown>>, default: () => {} },
  depth: { type: Number, default: 0 },
  site: { type: Object as vue.PropType<Site>, required: true },
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

// Animation hooks with type safety for HTMLElement
function beforeEnter(el: HTMLElement) {
  el.style.maxHeight = '0'
}

function enter(el: HTMLElement) {
  el.style.maxHeight = '0'
  requestAnimationFrame(() => {
    el.style.maxHeight = `${el.scrollHeight}px`
  })
}

function leave(el: HTMLElement) {
  el.style.maxHeight = `${el.scrollHeight}px`
  void el.offsetHeight
  requestAnimationFrame(() => {
    el.style.maxHeight = '0'
  })
}
</script>

<template>
  <div class="">
    <div class="flex gap-4 flex-col">
      <div
        v-for="(opt, i) in options"
        :key="i"
      >
        <div v-if="opt.input.value === 'group'" :class="depth > 0 ? 'border border-theme-200 dark:border-theme-700 rounded-md overflow-hidden' : ''">
          <div
            class="text-theme-500 dark:text-theme-100 hover:bg-theme-50 dark:hover:bg-theme-800 active:bg-theme-100 dark:active:bg-theme-700 py-2 px-4 text-xs flex justify-between cursor-pointer items-center"
            :class="!hide(opt.key.value) || depth === 0 ? 'border-b border-theme-200 dark:border-theme-700' : ''"
            @click="hide(opt.key.value, !hide(opt.key.value))"
          >
            <div class="font-semibold" v-html="opt.label.value" />
            <div v-if="opt.key.value" class="text-lg">
              <div class="i-tabler-chevron-up transition-all" :class="hide(opt.key.value) ? 'rotate-180' : ''" />
            </div>
          </div>
          <transition
            name="height-animation"
            @before-enter="(el) => beforeEnter(el as HTMLElement)"
            @enter="(el) => enter(el as HTMLElement)"
            @leave="(el) => leave(el as HTMLElement)"
          >
            <div v-show="!hide(opt.key.value)">
              <div class="p-4">
                <ToolForm
                  :options="opt.options.value || []"
                  :model-value="modelValue"
                  :depth="1"
                  :site="site"
                  @update:model-value="emit('update:modelValue', $event)"
                />
              </div>
            </div>
          </transition>
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
            input-class="bg-theme-50 dark:bg-theme-950 text-theme-700 dark:text-theme-25 border-theme-300 dark:border-theme-600"
            :model-value="getNested({ path: opt.key.value, data: modelValue })"
            :site="site"
            @update:model-value="emit('update:modelValue', setNested({ path: opt.key.value, data: modelValue, value: $event }))"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.height-animation-enter-active,
.height-animation-leave-active {
  transition: max-height 0.2s ease-in-out, opacity 0.2s ease-in-out;
  overflow: hidden;
  user-select: none;
}
.height-animation-enter, .height-animation-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
