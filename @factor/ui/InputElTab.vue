<template>
  <div
    class="text-input-size group hover:bg-theme-200 hover:border-theme-400 text-theme-700 flex max-w-[15em] items-center justify-between rounded-md border p-[.25em]"
    :class="[
      animateSelected ? 'notify-selected' : '',
      selected
        ? 'border-theme-500 bg-theme-300'
        : 'border-theme-300 bg-theme-100 ',
      notSelected ? 'opacity-80' : '',
    ]"
  >
    <div class="flex items-center">
      <div
        v-if="prefix"
        class="border-theme-200 text-theme-400 bg-theme-200 group-hover:bg-theme-100 inline-flex aspect-square w-[1.5em] shrink-0 items-center justify-center rounded-md border text-right font-sans text-[max(13px,.8em)] font-bold leading-[1em]"
        :class="[selected ? 'bg-theme-100' : 'bg-theme-200']"
      >
        <span v-if="selected" class="i-carbon-checkmark"></span>
        <span v-else>{{ prefix }}</span>
      </div>
      <div class="text-theme-600 ml-[.6em]">
        {{ label || "No Label" }}
      </div>
    </div>
    <div v-if="icon" class="text-theme-400 shrink-0" :class="icon"></div>
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
