<script lang="ts" setup>
import { vue } from '@fiction/core'

const props = defineProps({
  modelValue: { type: [Boolean, String], default: false },
  textOff: { type: String, default: '' },
  textOn: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: boolean): void
}>()

const attrs = vue.useAttrs()

function em(v: boolean): void {
  if (props.disabled)
    return
  emit('update:modelValue', v)
}

function handleEmit(target: EventTarget | null): void {
  const el = target as HTMLInputElement
  em(el.checked)
}

const val = vue.computed<boolean>(() => {
  const mv = props.modelValue
  if (typeof mv === 'string') {
    if (mv === 'on' || mv === 'true')
      return true
    else return false
  }
  else { return mv }
})
</script>

<template>
  <label
    class="toggle-wrap flex items-center py-1"
    :class="disabled ? 'opacity-50' : ''"
    :title="disabled ? 'Disabled' : ''"
  >
    <input
      class="absolute h-1 w-1 opacity-0"
      v-bind="attrs"
      type="checkbox"
      :value="val"
      :checked="val"
      @input="handleEmit($event.target)"
    >
    <button
      type="button"
      aria-pressed="false"
      :class="val === true ? 'bg-primary-600' : 'bg-theme-300 dark:bg-theme-700'"
      class="relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
      @click.stop="em(!val)"
    >
      <span class="sr-only">{{ val ? "on" : "off" }}</span>

      <span
        aria-hidden="true"
        :class="
          val === true
            ? 'translate-x-5 bg-primary-0 ring-primary-600'
            : 'translate-x-0 bg-theme-0 ring-theme-300'
        "
        class="inline-block h-4 w-4 rounded-full transition duration-200 ease-in-out"
      />
    </button>
    <span
      v-if="textOn || textOff"
      id="toggleLabel"
      class="text-theme-500 hover:text-primary ml-4 cursor-pointer text-xs font-bold tracking-tight"
    >
      <span v-if="val">{{ textOn }}</span>
      <span v-else>{{ textOff }}</span>
    </span>
  </label>
</template>
