<script lang="ts" setup>
import type { vue } from '@fiction/core'
import { onResetUi, resetUi } from '@fiction/core'

const props = defineProps({
  name: { type: String, default: '' },
  vis: { type: Boolean, default: false },
  mode: {
    type: String as vue.PropType<'standard' | 'route'>,
    default: 'standard',
  },
})
const emit = defineEmits(['update:vis', 'close'])

/**
 * Prevent the activation event from also closing the slideover
 */
function close() {
  emit('update:vis', false)
  emit('close')
}
/**
 * If using route don't bind to reset UI since it triggers with any route change
 * visibility in route mode is tied to  the route
 */
if (props.mode !== 'route') {
  onResetUi((args) => {
    if (args.scope !== 'inputs')
      close()
  })
}
</script>

<template>
  <teleport to="body">
    <div
      class="fixed inset-0 z-40 overflow-hidden"
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
          <div class="bg-theme-800/70 absolute inset-0" />
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
              class="relative z-30 w-screen max-w-2xl"
              @click.stop
            >
              <button
                class="text-theme-400 hover:text-theme-600 absolute right-6 top-6 rounded-md transition-all hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-white"
                @click.prevent="close()"
              >
                <span class="sr-only">Close panel</span>
                <!-- Heroicon name: x -->
                <svg
                  class="h-8 w-8"
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
              <div
                class="flex h-full flex-col bg-white shadow-xl"
                @click="resetUi({ scope: 'inputs', cause: 'slideOver' })"
              >
                <div class="h-0 flex-1 overflow-y-auto">
                  <div class="flex flex-1 flex-col justify-between">
                    <div class="divide-y divide-slate-200 px-4 sm:px-8">
                      <div class="pt-6 pb-5">
                        <slot />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </section>
      </div>
    </div>
  </teleport>
</template>
