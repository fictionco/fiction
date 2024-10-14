<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'
import XButton from './buttons/XButton.vue'
import ElModal from './ElModal.vue'

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
      <div class="text-lg font-semibold text-balance x-font-title">
        {{ title }}
      </div>
      <div v-if="sub" class="text-base text-theme-500 dark:text-theme-300 mt-2 text-balance">
        {{ sub }}
      </div>
    </div>
    <div class="flex justify-center gap-4">
      <XButton class="" theme="default" icon="i-tabler-x" @click="emit('update:vis', false)">
        Cancel
      </XButton>
      <XButton theme="primary" :loading="loading" icon="i-tabler-check" @click.stop="confirmed()">
        Confirm
      </XButton>
    </div>
  </ElModal>
</template>
