<script lang="ts" setup>
import { vue } from '@fiction/core'

const props = defineProps({
  label: { type: [String, Number], default: '' },
  icon: { type: String, default: '' },
  prefix: { type: [String, Number], default: '' },
  selected: { type: Boolean, default: false },
  notSelected: { type: Boolean, default: false },
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
</script>

<template>
  <div
    class="text-theme-400 hover:text-theme-500 text-input-size max-w-[5em] grow cursor-pointer select-none"
  >
    <div
      class="hover:bg-theme-200 hover:border-theme-400 flex aspect-square items-center justify-center rounded-md border p-1"
      :class="[
        animateSelected ? 'notify-selected' : '',
        selected
          ? 'dark:border-theme-500 border-theme-400 bg-theme-200 dark:bg-theme-700 text-theme-600 dark:text-theme-0'
          : 'dark:border-theme-600 border-theme-300 bg-theme-100 dark:bg-theme-800 text-theme-500 dark:text-theme-300',
        notSelected ? 'opacity-60' : '',
      ]"
    >
      <div class="relative text-center">
        <div
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div
            v-if="icon"
            class="text-[1.8em]"
            :class="icon"
          />
          <div v-else class="text-[1.3em] font-bold">
            {{ label }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="icon"
      class="mt-1 text-center text-[.9em]"
      :class="selected ? 'text-theme-500' : ' '"
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
