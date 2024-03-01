<script lang="ts" setup>
const props = defineProps({
  vis: { type: Boolean, default: false },
})
const emit = defineEmits<{
  (event: 'update:vis', payload: boolean): void
  (event: 'close', payload: boolean): void
}>()

function close() {
  emit('update:vis', false)
  emit('close', true)
}
</script>

<template>
  <teleport to="body">
    <div
      class=":isolate: fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      :class="!vis ? 'pointer-events-none' : ''"
    >
      <transition
        enter-active-class="ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="vis"
          class="fixed inset-0 z-20 transition-opacity"
          aria-hidden="true"
          @click="close()"
        >
          <div class="absolute inset-0 bg-theme-800/70" />
        </div>
      </transition>
      <div class="absolute inset-0 overflow-y-auto">
        <div
          class="flex min-h-full justify-center p-4 text-center sm:items-center"
        >
          <transition
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0 translate-y-24 sm:translate-y-0 sm:scale-75"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-75"
          >
            <div
              v-if="vis"
              class="relative z-30 my-12 aspect-[4/3] w-full max-w-screen-lg overflow-hidden rounded-md bg-white shadow-xl"
            >
              <slot />
            </div>
          </transition>
        </div>
      </div>
    </div>
  </teleport>
</template>
