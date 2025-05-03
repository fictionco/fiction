<script lang="ts" setup>
import type { ActionArea } from '@fiction/core'
import { vue } from '@fiction/core'
import XButtonList from '../buttons/XButtonList.vue'
import EffectConfetti from '../effect/EffectConfetti.vue'
import ElModal from '../ElModal.vue'

const props = defineProps<{
  vis: boolean
  title?: string
  content?: string
  action?: ActionArea
}>()

const emit = defineEmits<{
  (event: 'update:vis', payload: boolean): void
  (event: 'done'): void
}>()

const showConfetti = vue.ref(false)

vue.watch(() => props.vis, (v) => {
  if (v) {
    showConfetti.value = true

    // Reset confetti after animation
    setTimeout(() => {
      showConfetti.value = false
    }, 3000)
  }
})

function handleDone() {
  emit('update:vis', false)
  emit('done')
}
</script>

<template>
  <div>
    <EffectConfetti :active="showConfetti" />

    <!-- Confirmation Modal -->
    <ElModal
      :vis="vis"
      modal-class="max-w-lg"
      :has-close="true"
      @update:vis="emit('update:vis', $event)"
    >
      <div class="text-center p-8 space-y-4">
        <div class="text-green-500 mb-4">
          <span class="i-tabler-circle-check text-5xl inline-block" />
        </div>
        <h2 class="text-2xl font-medium mb-4 x-font-title">
          {{ title || 'Success!' }}
        </h2>
        <div class="text-xl text-theme-500 dark:text-theme-400 mb-6">
          {{ content || 'Your action was completed successfully.' }}
        </div>
        <XButtonList :buttons="action?.buttons || []" />
      </div>
    </ElModal>
  </div>
</template>
