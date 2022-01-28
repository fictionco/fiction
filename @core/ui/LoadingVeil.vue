<template>
  <div
    v-if="authLoading"
    class="loading-veil bg-white fixed top-0 left-0 w-full h-full flex items-center justify-center text-slate-300"
  >
    <ElemSpinner class="w-12 h-12" />
  </div>
</template>

<script lang="ts" setup>
import { routeRequiresAuth, userInitialized } from "@factor/api"
import ElemSpinner from "./ElemSpinner.vue"
import { onMounted, ref } from "vue"

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
