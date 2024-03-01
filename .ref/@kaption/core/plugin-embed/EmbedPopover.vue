<script lang="ts" setup>
import ElCloseButton from './ElCloseButton.vue'

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
  <transition
    enter-active-class="transform transition ease-in-out duration-500"
    enter-from-class="translate-x-full opacity-0 scale-40"
    enter-to-class="translate-x-0 opacity-100 scale-100"
    leave-active-class="transform transition ease-in-out duration-500"
    leave-from-class="translate-x-0 opacity-100 scale-100"
    leave-to-class="translate-x-full opacity-0 scale-40"
  >
    <div
      v-show="vis"
      class="absolute right-4 top-1/2 z-30 aspect-[3/4] w-full max-w-sm -translate-y-1/2"
      :class="vis ? 'pointer-events-auto' : 'pointer-events-none'"
    >
      <ElCloseButton
        class="absolute left-3 top-4"
        @click.prevent="close()"
      />
      <div class="h-full w-full overflow-hidden rounded-xl" @click.stop>
        <div class="h-full bg-white shadow-xl">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>
