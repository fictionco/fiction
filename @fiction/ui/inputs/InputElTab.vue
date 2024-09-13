<script lang="ts" setup>
import type { StandardSize } from '@fiction/core'
import type { PropType } from 'vue'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  label: { type: [String, Number], default: '' },
  icon: { type: String, default: '' },
  prefix: { type: [String, Number], default: '' },
  selected: { type: Boolean, default: false },
  notSelected: { type: Boolean, default: false },
  animate: { type: Boolean, default: true },
  uiSize: { type: String as PropType<StandardSize>, default: 'md' },
})

const animateSelected = ref(false)

watch(() => props.selected, (newValue) => {
  if (props.animate && newValue) {
    animateSelected.value = true
    setTimeout(() => {
      animateSelected.value = false
    }, 1000)
  }
})

function getClasses(uiSize: StandardSize) {
  const baseClasses = {
    container: 'grow cursor-pointer select-none',
    button: 'w-full flex items-center border transition-colors duration-200 ease-in-out rounded-lg',
    prefixContainer: 'inline-flex aspect-square shrink-0 items-center justify-center rounded-md text-right font-sans leading-[1em]',
    label: 'font-sans',
    icon: 'text-theme-400 shrink-0',
  }

  const sizeClasses = {
    'xxs': { button: 'text-xs py-0.5 px-1', label: 'text-xs', prefix: 'size-3 text-[0.6em] -ml-0.5', labelMargin: 'ml-1' },
    'xs': { button: 'text-xs py-1 px-2', label: 'text-xs', prefix: 'size-3.5 text-[0.7em] -ml-0.5', labelMargin: 'ml-1.5' },
    'sm': { button: 'text-sm py-1.5 px-3 ', label: 'text-sm', prefix: 'size-4 text-[0.8em] -ml-1', labelMargin: 'ml-2' },
    'md': { button: 'text-base py-2 px-4', label: 'text-base', prefix: 'size-5 text-[0.9em] -ml-1', labelMargin: 'ml-2.5' },
    'lg': { button: 'text-lg py-2.5 px-4', label: 'text-lg', prefix: 'size-6 text-[1em] -ml-1.5', labelMargin: 'ml-3' },
    'xl': { button: 'text-xl py-3 px-5', label: 'text-xl', prefix: 'size-7 text-[1.1em] -ml-1.5', labelMargin: 'ml-3.5' },
    '2xl': { button: 'text-2xl py-3.5 px-6', label: 'text-2xl', prefix: 'size-8 text-[1.2em] -ml-2', labelMargin: 'ml-4' },
  }

  return {
    container: baseClasses.container,
    button: `${baseClasses.button} ${sizeClasses[uiSize].button}`,
    prefixContainer: `${baseClasses.prefixContainer} ${sizeClasses[uiSize].prefix}`,
    label: `${baseClasses.label} ${sizeClasses[uiSize].label}`,
    labelMargin: sizeClasses[uiSize].labelMargin,
    icon: baseClasses.icon,
    selected: 'border-primary-300 dark:border-primary-800 bg-primary-200 dark:bg-primary-900/50 text-primary-700 dark:text-primary-0',
    notSelected: 'border-theme-300 dark:border-theme-600 bg-theme-100/60 dark:bg-theme-800 text-theme-700 dark:text-theme-0',
    prefixSelected: 'bg-primary-200 dark:bg-primary-800 text-primary-600 dark:text-primary-400 font-bold',
    prefixNotSelected: 'text-theme-400/70 dark:text-theme-600 font-medium dark:bg-theme-800/60 group-hover:text-theme-700 group-hover:bg-theme-400',
  }
}

const cls = computed(() => getClasses(props.uiSize))
</script>

<template>
  <div :class="cls.container">
    <div
      :class="[
        cls.button,
        animateSelected ? 'notify-selected' : '',
        selected ? cls.selected : cls.notSelected,
        notSelected ? 'opacity-80' : '',
      ]"
    >
      <div
        v-if="prefix"
        :class="[
          cls.prefixContainer,
          selected ? cls.prefixSelected : cls.prefixNotSelected,
        ]"
      >
        <span v-if="selected" class="i-tabler-check text-[1.2em]" />
        <span v-else>{{ prefix }}</span>
      </div>
      <div
        :class="[
          cls.label,
          selected ? 'font-semibold' : 'font-medium',
          prefix ? cls.labelMargin : '',
        ]"
      >
        {{ label || "No Label" }}
      </div>
      <div
        v-if="icon"
        :class="[cls.icon, icon]"
      />
    </div>
  </div>
</template>

<style lang="less">
.notify-selected {
  animation: fadeInOut 0.4s linear forwards;
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  25% { opacity: 0.2; }
  50% { opacity: 1; }
  75% { opacity: 0.2; }
  100% { opacity: 1; }
}
</style>
