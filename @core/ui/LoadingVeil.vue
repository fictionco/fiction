<template>
  <div
    v-if="authLoading"
    class="loading-veil fixed top-0 left-0 flex h-full w-full items-center justify-center bg-white text-slate-300"
  >
    <ElSpinner class="h-12 w-12" />
  </div>
</template>

<script lang="ts" setup>
import { routeRequiresAuth } from "@factor/api/router"
import { userInitialized } from "@factor/engine"
import { onMounted, ref } from "vue"
import ElSpinner from "./ElSpinner.vue"

const authLoading = ref(false)

if (routeRequiresAuth()) {
  authLoading.value = true
}
onMounted(async () => {
  await userInitialized()
  authLoading.value = false
})
</script>
<style lang="less" scoped>
.loading-veil {
  z-index: 10000;
}
</style>
