<template>
  <div>
    <ElButton btn="default" @click="emitEvent('mediaLibrary')" size="sm">
      <div class="i-carbon-image mr-2"></div>
      Add Media
    </ElButton>
  </div>
</template>
<script lang="ts" setup>
import ElButton from "./ElButton.vue"
import { emitEvent } from "@factor/api"
defineProps({
  modelValue: { type: [String], default: "" },
})
const emit = defineEmits<{
  (event: "update:modelValue", payload: string): void
}>()

const handleEmit = (target: EventTarget | null): void => {
  const el = target as HTMLInputElement

  emit("update:modelValue", el.value)
}
</script>
