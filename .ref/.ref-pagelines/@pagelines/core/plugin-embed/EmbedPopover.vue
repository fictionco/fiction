<script lang="ts" setup>
defineProps({
  vis: { type: Boolean, default: false },
  position: { type: String, default: 'br' },
})
defineEmits<{
  (event: 'update:vis', payload: boolean): void
  (event: 'close', payload: boolean): void
}>()
</script>

<template>
  <transition
    enter-active-class="transform transition ease-in-out duration-500"
    enter-from-class="opacity-0 scale-40"
    enter-to-class="translate-x-0 opacity-100 scale-100"
    leave-active-class="transform transition ease-in-out duration-500"
    leave-from-class="translate-x-0 opacity-100 scale-100"
    leave-to-class="opacity-0 scale-40"
  >
    <div
      v-show="vis"
      class="z-30 h-[60vh] w-96 max-w-[85vw] grow md:max-w-sm"
      :class="vis ? 'pointer-events-auto' : 'pointer-events-none'"
      :style="{ width: '450px', height: '67vh' }"
    >
      <div
        class="h-full w-full overflow-hidden rounded-xl border border-black/10 shadow-xl"
        @click.stop
      >
        <div class="bg-theme-0 h-full shadow-xl">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>
