<template>
  <div class="my-12">
    <div class="figure-stage max-w-screen-lg m-auto relative">
      <img
        class="shadow-xl ring-1 ring-black ring-opacity-10 rounded-md"
        :src="screenErrors"
        alt="Performance Debugging - Errors"
      />
    </div>
  </div>
</template>

<script lang="ts">
import screenErrors from "./img/screenErrors.webp"
export default {
  setup() {
    return { screenErrors }
  },
}
</script>
<style lang="less" scoped></style>
