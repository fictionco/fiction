<template>
  <teleport to="body">
    <div
      class="fixed z-30 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      :class="!vis ? 'pointer-events-none' : ''"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 translate-y-0"
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
            class="fixed inset-0 bg-slate-900 bg-opacity-80 transition-opacity z-0"
            aria-hidden="true"
            @click="close()"
          />
        </transition>
        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
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
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-8"
            :style="{ transform: 'translateZ(0)' }"
            :class="[modalClass]"
            @click.stop
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 absolute z-10 right-4 text-slate-500 hover:text-primary-500 cursor-pointer transition-all"
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
