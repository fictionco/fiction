<script lang="ts" setup>
import type { Card } from '@fiction/site'
import ElModal from '@fiction/ui/ElModal.vue'
import ElAddContacts from './ElAddContacts.vue'

defineProps<{
  vis: boolean
  card: Card
}>()
const emit = defineEmits(['update:vis'])
</script>

<template>
  <ElModal
    modal-class="max-w-screen-lg w-[calc(100%-1rem)]"
    transition-mode="slideUp"
    :vis
    :has-close="true"
    @update:vis="emit('update:vis', $event)"
  >
    <div class="pb-16">
      <div class="flex justify-between mb-6 py-4 px-6">
        <div class="text-base font-semibold x-font-title">
          Add Contacts
        </div>
      </div>
      <div class="px-4 md:px-12">
        <ElAddContacts :card @update:contacts="emit('update:vis', false)" />
      </div>
    </div>
  </ElModal>
</template>
