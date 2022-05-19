<template>
  <ElModal>
    <h3>Media</h3>
  </ElModal>
</template>
<script lang="ts" setup>
import ElModal from "@factor/ui/ElModal.vue"
import { onEvent, vue } from "@factor/api"

const vis = vue.ref()

onEvent("mediaLibrary", async () => {
  vis.value = true
})
</script>
