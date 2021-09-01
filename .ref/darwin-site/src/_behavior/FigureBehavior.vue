<template>
  <div class="my-12">
    <div class="figure-stage max-w-screen-lg m-auto relative">
      <img
        class="
          variant-editor
          shadow-xl
          ring-1 ring-black ring-opacity-10
          rounded-md
        "
        :src="screenBehaviorCharts"
        alt="Behavior Analytics - Charts"
      />

      <img
        class="
          w-48
          shadow-2xl
          ring-1 ring-black ring-opacity-10
          rounded-md
          absolute
          -bottom-7
          -right-7
          sm:w-80
        "
        :src="thumbBehavior"
        alt="Behavior Analytics - Charts Small"
      />
    </div>
  </div>
</template>

<script lang="ts">
import screenBehaviorCharts from "./img/screenBehaviorCharts.webp"
import thumbBehavior from "./img/thumbBehavior.webp"
export default {
  setup() {
    return { screenBehaviorCharts, thumbBehavior }
  },
}
</script>
<style lang="less" scoped></style>
