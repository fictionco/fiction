<template>
  <teleport to="body">
    <div
      class="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      :class="!vis ? 'pointer-events-none' : ''"
    >
      <transition
        enter-active-class="ease-out duration-300"
        enter-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="vis"
          class="fixed inset-0 bg-slate-800/75 transition-opacity"
          @click="close()"
        ></div>
      </transition>
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <transition
            enter-active-class="ease-out duration-300"
            enter-class="opacity-0 translate-y-24 sm:translate-y-0 sm:scale-75"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-75"
          >
            <div v-if="vis" :class="classes" @click.stop>
              <slot />
            </div>
          </transition>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script lang="ts" setup>
import { onResetUi } from "@factor/api"
const props = defineProps({
  vis: { type: Boolean, default: false },
  title: { type: String, default: "" },
  sub: { type: String, default: "" },
  modalClass: { type: String, default: undefined },
})

const emit = defineEmits(["update:vis", "close"])
const close = (): void => {
  emit("update:vis", false)
  emit("close", true)
}
onResetUi(() => close())

const modalClass = [props.modalClass] || ["p-12", "sm:max-w-sm"]

const classes = [
  "relative",
  "rounded-xl",
  "shadow-xl",
  "text-left",
  "overflow-hidden",
  "bg-white",
  "transform",
  "transition-all",
  "sm:w-full",
  ...modalClass,
]
</script>
<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>
