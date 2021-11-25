<template>
  <div
    v-if="authLoading"
    class="
      loading-veil
      bg-white
      fixed
      top-0
      left-0
      w-full
      h-full
      flex
      items-center
      justify-center
      text-bluegray-300
    "
  >
    <ElemSpinner class="w-12 h-12" />
  </div>
</template>

<script lang="ts">
import { dLog, routeRequiresAuth, userInitialized } from "@factor/api"
import ElemSpinner from "./ElemSpinner.vue"
import { onMounted, ref } from "vue"
export default {
  name: "LoadingVeil",
  components: { ElemSpinner },
  setup() {
    const authLoading = ref(false)

    if (routeRequiresAuth()) {
      authLoading.value = true
    }
    onMounted(async () => {
      try {
        await userInitialized()
        authLoading.value = false
      } catch (error) {
        dLog("error", "user loading error", error)
      }
    })
    return { authLoading }
  },
}
</script>
<style lang="less" scoped>
.loading-veil {
  z-index: 10000;
}
</style>
