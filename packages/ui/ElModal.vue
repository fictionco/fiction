<template>
  <teleport to="body">
    <div
      class="fixed inset-0 z-30 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      :class="!vis ? 'pointer-events-none' : ''"
    >
      <div
        class="flex min-h-screen translate-y-0 items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
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
            class="fixed inset-0 z-0 bg-slate-900/80 transition-opacity"
            aria-hidden="true"
            @click="close()"
          />
        </transition>
        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
          class="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
          >&#8203;</span
        >
        <transition
          enter-active-class="ease-out duration-300"
          enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="ease-in duration-200"
          leave-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-if="vis"
            class="inline-block overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-8 sm:align-middle"
            :style="{ transform: 'translateZ(0)' }"
            :class="[modalClass]"
            @click.stop
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="absolute right-4 z-10 h-8 w-8 cursor-pointer text-slate-500 transition-all hover:text-primary-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              @click="close()"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <slot />
          </div>
        </transition>
      </div>
    </div>
  </teleport>
</template>
<script lang="ts" setup>
import { onResetUi } from "@factor/api"
defineProps({
  vis: { type: Boolean, default: false },
  title: { type: String, default: "" },
  sub: { type: String, default: "" },
  modalClass: { type: String, default: "" },
})

const emit = defineEmits(["update:vis", "close"])
const close = (): void => {
  emit("update:vis", false)
  emit("close", true)
}
onResetUi(() => close())
</script>
<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>
