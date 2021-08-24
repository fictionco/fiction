<template>
  <div class="my-12">
    <div class="figure-stage max-w-screen-lg m-auto relative">
      <img
        class="shadow-xl ring-1 ring-black ring-opacity-10 rounded-md"
        :src="screenSecurity"
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
        :src="thumbBotCountry"
      />
    </div>
  </div>
</template>

<script lang="ts">
import screenSecurity from "./img/screenSecurity.webp"
import thumbBotCountry from "./img/thumbBotCountry.webp"
export default {
  setup() {
    return { screenSecurity, thumbBotCountry }
  },
}
</script>
<style lang="less" scoped></style>
