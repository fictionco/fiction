<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'
import ElModal from './ElModal.vue'
import ElButton from './ElButton.vue'

defineProps({
  title: { type: String, default: '' },
  sub: { type: String, default: '' },
  vis: { type: Boolean, default: false },
})

const emit = defineEmits(['confirmed', 'update:vis'])

const loading = vue.ref(false)
async function confirmed() {
  loading.value = true
  emit('confirmed', true)
  await waitFor(100)
  loading.value = false
  emit('update:vis', false)
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <ElModal v-bind="$attrs" :vis="vis" modal-class="max-w-screen-sm p-8 lg:p-16" @update:vis="emit('update:vis', $event)">
    <div class="mb-6 text-center">
      <div class="text-lg font-bold text-balance">
        {{ title }}
      </div>
      <div v-if="sub" class="text-base text-theme-500 dark:text-theme-200 mt-2 text-balance">
        {{ sub }}
      </div>
    </div>
    <div class="flex justify-center gap-4">
      <ElButton class="" btn="default" icon="i-tabler-x" @click="emit('update:vis', false)">
        Cancel
      </ElButton>
      <ElButton btn="primary" :loading="loading" icon="i-tabler-check" @click.stop="confirmed()">
        Confirm
      </ElButton>
    </div>
  </ElModal>
</template>
