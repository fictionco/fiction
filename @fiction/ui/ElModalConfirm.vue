<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'
import ElModal from './ElModal.vue'
import ElButton from './ElButton.vue'

const props = defineProps({
  title: { type: String, default: '' },
  sub: { type: String, default: '' },
  vis: { type: Boolean, default: false },
})

const emit = defineEmits(['confirmed', 'update:vis'])

const loading = vue.ref(false)
async function confirmed() {
  emit('confirmed', true)
  loading.value = true
  await waitFor(250)
  emit('update:vis', false)
  loading.value = false
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <ElModal v-bind="$attrs" :vis="vis" @update:vis="emit('update:vis', $event)">
    <div class="mb-6">
      <div class="text-base font-bold">
        {{ title }}
      </div>
      <div v-if="sub" class="text-xs text-theme-500 dark:text-theme-200 mt-2">
        {{ sub }}
      </div>
    </div>
    <div class="flex justify-between">
      <ElButton class="" btn="default" icon="i-tabler-x" @click="emit('update:vis', false)">
        Cancel
      </ElButton>
      <ElButton btn="primary" :loading="loading" icon="i-tabler-check" @click="confirmed()">
        Confirm
      </ElButton>
    </div>
  </ElModal>
</template>
