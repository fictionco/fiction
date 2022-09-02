<template>
  <div
    class="text-input-size hover:bg-theme-200 hover:border-theme-400 text-theme-700 max-w-input flex cursor-move items-center justify-between rounded-md border px-2 py-1"
    :class="[
      animateSelected ? 'notify-selected' : '',
      selected
        ? 'border-theme-400 bg-theme-200'
        : 'border-theme-300 bg-theme-100 ',
    ]"
  >
    <div class="flex items-center space-x-3">
      <div
        v-if="prefix"
        class="border-theme-300 text-theme-400 inline-flex w-6 items-center justify-end border-r pr-3 text-right text-xs font-bold"
      >
        {{ prefix }}
      </div>
      <div class="text-theme-700">{{ label || "No Label" }}</div>
    </div>
    <div v-if="icon" class="text-theme-400" :class="icon"></div>
  </div>
</template>
<script lang="ts" setup>
import { vue } from "@factor/api"

const props = defineProps({
  label: { type: [String, Number], default: "" },
  icon: { type: String, default: "" },
  prefix: { type: [String, Number], default: "" },
  selected: { type: Boolean, default: false },
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
