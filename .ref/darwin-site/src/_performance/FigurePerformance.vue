<template>
  <div class="my-12">
    <div class="figure-stage max-w-screen-lg m-auto relative">
      <img
        class="shadow-xl ring-1 ring-black ring-opacity-10 rounded-md"
        :src="screenPerformance"
        alt="Performance Dashboard"
      />

      <img
        class="
          shadow-2xl
          ring-1 ring-black ring-opacity-10
          rounded-md
          absolute
          -bottom-7
          -right-7
          w-108
        "
        :src="screenVital"
        alt="Performance - Largest Contentful Paint"
      />
    </div>
  </div>
</template>

<script lang="ts">
import screenPerformance from "./img/screenPerformance.webp"
import screenVital from "./img/screenVital.webp"
export default {
  setup() {
    return { screenPerformance, screenVital }
  },
}
</script>
<style lang="less" scoped></style>
