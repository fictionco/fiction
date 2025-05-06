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
  <div
    class=":isolate: fixed inset-0 z-40 overflow-hidden"
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
    <div class="absolute inset-0 overflow-hidden">
      <section
        class="absolute inset-y-0 right-0 flex max-w-full lg:pl-16"
        aria-labelledby="slide-over-heading"
      >
        <transition
          enter-active-class="transform transition ease-in-out duration-200"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transform transition ease-in-out duration-200"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div
            v-if="vis"
            class="relative z-30 w-screen max-w-xl"
            @click.stop
          >
            <button
              class="absolute -left-10 top-4 rounded-full text-white transition-all hover:rotate-90 focus:outline-none"
              @click.prevent="close()"
            >
              <span class="sr-only">Close panel</span>
              <!-- Heroicon name: x -->
              <svg
                class="h-7 w-7"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div class="h-full bg-white shadow-xl">
              <slot />
            </div>
          </div>
        </transition>
      </section>
    </div>
  </div>
</template>
