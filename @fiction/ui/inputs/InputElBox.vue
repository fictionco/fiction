<script lang="ts" setup>
import type { StandardSize } from '@fiction/core'
import { vue } from '@fiction/core'

const props = defineProps({
  label: { type: [String, Number], default: '' },
  icon: { type: String, default: '' },
  prefix: { type: [String, Number], default: '' },
  selected: { type: Boolean, default: false },
  notSelected: { type: Boolean, default: false },
  uiSize: { type: String as vue.PropType<StandardSize>, default: 'md' },
})
const animateSelected = vue.ref()

vue.watch(
  () => props.selected,
  (v) => {
    if (v) {
      animateSelected.value = v
      setTimeout(() => {
        animateSelected.value = ''
      }, 1000)
    }
  },
)

function getClasses(uiSize: StandardSize) {
  const baseClasses = {
    container: 'text-theme-400 hover:text-theme-500 grow cursor-pointer select-none',
    iconContainer: 'hover:bg-theme-200 hover:border-theme-400 flex items-center justify-center rounded-md border p-1 aspect-square',
    icon: '',
    label: 'font-bold',
    labelContainer: 'mt-1 text-center',
  }

  const sizeClasses = {
    'xxs': { container: '', iconContainer: '', icon: '', label: '', labelContainer: '' },
    'xs': {
      container: 'max-w-[2.5em] text-xs',
      iconContainer: '',
      icon: 'text-[1.2em]',
      label: 'text-[0.9em]',
      labelContainer: 'text-[0.7em]',
    },
    'sm': {
      container: 'max-w-[3em] text-sm',
      iconContainer: '',
      icon: 'text-[1.5em]',
      label: 'text-[1.1em]',
      labelContainer: 'text-[0.8em]',
    },
    'md': {
      container: 'max-w-[4em] text-base',
      iconContainer: '',
      icon: 'text-[1.8em]',
      label: 'text-[1.3em]',
      labelContainer: 'text-[0.9em]',
    },
    'lg': {
      container: 'max-w-[4.5em] text-lg',
      iconContainer: '',
      icon: 'text-[2.1em]',
      label: 'text-[1.5em]',
      labelContainer: 'text-[1em]',
    },
    'xl': {
      container: 'max-w-[5em] text-xl',
      iconContainer: '',
      icon: 'text-[2.4em]',
      label: 'text-[1.7em]',
      labelContainer: 'text-[1.1em]',
    },
    '2xl': {
      container: 'max-w-[5.5em] text-2xl',
      iconContainer: '',
      icon: 'text-[2.7em]',
      label: 'text-[1.9em]',
      labelContainer: 'text-[1.2em]',
    },
  }

  return {
    container: `${baseClasses.container} ${sizeClasses[uiSize].container}`,
    iconContainer: `${baseClasses.iconContainer} ${sizeClasses[uiSize].iconContainer}`,
    icon: `${baseClasses.icon} ${sizeClasses[uiSize].icon}`,
    label: `${baseClasses.label} ${sizeClasses[uiSize].label}`,
    labelContainer: `${baseClasses.labelContainer} ${sizeClasses[uiSize].labelContainer}`,
    selected: 'dark:border-primary-500 border-primary-400 bg-primary-200 dark:bg-primary-700 text-primary-600 dark:text-primary-0',
    notSelected: 'dark:border-theme-600 border-theme-300 bg-theme-100 dark:bg-theme-800 text-theme-500 dark:text-theme-300',
  }
}

const cls = vue.computed(() => getClasses(props.uiSize))
</script>

<template>
  <div :class="cls.container">
    <div
      :class="[
        cls.iconContainer,
        animateSelected ? 'notify-selected' : '',
        selected ? cls.selected : cls.notSelected,
        notSelected ? 'opacity-60' : '',
      ]"
    >
      <div class="relative text-center">
        <div
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div
            v-if="icon"
            :class="[cls.icon, icon]"
          />
          <div v-else :class="cls.label">
            {{ label }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="icon"
      class="font-sans"
      :class="[cls.labelContainer, selected ? 'text-theme-500' : '']"
    >
      {{ String(label) || "No Label" }}
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
