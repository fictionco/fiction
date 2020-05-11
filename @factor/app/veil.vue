<template>
  <div v-if="authLoading" class="loading-veil">
    <factor-spinner />
  </div>
</template>

<script lang="ts">
import { factorSpinner } from "@factor/ui"
import { userInitialized, routeRequiresAuth } from "@factor/api"
export default {
  name: "Veil",
  components: { factorSpinner },

  data() {
    return {
      authLoading: false,
    }
  },
  created() {
    if (routeRequiresAuth()) {
      this.authLoading = true
    }
  },
  async mounted() {
    await userInitialized()

    setTimeout(() => {
      this.authLoading = false
    }, 500)
  },
}
</script>
<style lang="less" scoped>
.loading-veil {
  background: var(--color-bg, #fff);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}
</style>
