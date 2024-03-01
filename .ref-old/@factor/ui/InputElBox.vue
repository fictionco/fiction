<template>
  <div
    class="text-theme-400 hover:text-theme-500 text-input-size max-w-[5em] grow cursor-pointer select-none"
  >
    <div
      class="hover:bg-theme-200 hover:border-theme-400 flex aspect-square items-center justify-center rounded-md border p-1"
      :class="[
        animateSelected ? 'notify-selected' : '',
        selected
          ? 'border-theme-400 bg-theme-200 text-theme-600'
          : 'border-theme-300 bg-theme-100 text-theme-500',
        notSelected ? 'opacity-60' : '',
      ]"
    >
      <div class="relative text-center">
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div v-if="icon" class="text-[1.8em]" :class="icon"></div>
          <div v-else class="text-[1.3em] font-bold">{{ label }}</div>
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
<script lang="ts" setup>
import { vue } from "@factor/api"

const props = defineProps({
  label: { type: [String, Number], default: "" },
  icon: { type: String, default: "" },
  prefix: { type: [String, Number], default: "" },
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
        animateSelected.value = ""
      }, 1000)
    }
  },
)
</script>
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
