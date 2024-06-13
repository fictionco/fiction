<script lang="ts" setup>
import { vue } from '@fiction/core'
import { selectInputClasses } from './theme'

const props = defineProps({
  label: { type: [String, Number], default: '' },
  icon: { type: String, default: '' },
  prefix: { type: [String, Number], default: '' },
  selected: { type: Boolean, default: false },
  notSelected: { type: Boolean, default: false },
  animate: { type: Boolean, default: false },
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

const cls = selectInputClasses({ inputClass: '' })
</script>

<template>
  <div>
    <div
      :class="[
        cls.buttonClasses.always,
        animateSelected && animate ? 'notify-selected' : '',
        selected
          ? 'border-theme-300 dark:border-theme-500  bg-theme-200 dark:bg-theme-600 text-theme-900 dark:text-theme-0'
          : 'border-theme-300 dark:border-theme-600 bg-theme-100 dark:bg-theme-800 text-theme-700 dark:text-theme-0',
        notSelected ? 'opacity-80' : '',
      ]"
    >
      <div class="flex items-center -ml-1">
        <div
          v-if="prefix"
          class=" inline-flex aspect-square w-[1.5em] shrink-0 items-center justify-center rounded-md text-right font-sans text-[max(14px,.9em)] leading-[1em]"
          :class="[
            selected
              ? 'bg-theme-300 dark:bg-theme-600 text-theme-800 dark:text-theme-400 font-bold'
              : 'bg-theme-300 text-theme-500 dark:text-theme-400 font-semibold bg-theme-200 dark:bg-theme-700 group-hover:text-theme-700 group-hover:bg-theme-400',
          ]"
        >
          <span v-if="selected" class="i-carbon-checkmark" />
          <span v-else>{{ prefix }}</span>
        </div>
        <div
          class="text-theme-600 dark:text-theme-0"
          :class="[
            selected ? ' font-semibold' : 'font-medium',
            prefix ? 'ml-[.6em]' : '',
          ]"
        >
          {{ label || "No Label" }}
        </div>
      </div>
      <div
        v-if="icon"
        class="text-theme-400 shrink-0"
        :class="icon"
      />
    </div>
  </div>
</template>

<style lang="less">
.notify-selected {
  animation: fadeInOut 0.4s linear forwards;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  25% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
}
</style>
