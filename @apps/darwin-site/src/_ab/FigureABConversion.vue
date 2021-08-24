<template>
  <div class="my-12">
    <div class="max-w-screen-lg m-auto relative">
      <img
        class="shadow-xl ring-1 ring-black ring-opacity-10 rounded-md"
        :src="screenshotCR"
        alt="A/B Analytics - Goal Conversion Rate"
      />
      <img
        class="
          shadow-xl
          ring-1 ring-black ring-opacity-10
          rounded-md
          absolute
          -bottom-14
          -left-7
          w-108
        "
        :src="screenshotCRSmall"
        alt="A/B Analytics - Goal Conversion Rate Percentages"
      />

      <div
        class="
          shadow-lg
          ring-1 ring-black ring-opacity-10
          z-10
          absolute
          bg-white
          py-6
          px-10
          top-10
          -right-9
          rounded-xl
          text-green-500
        "
      >
        <div class="text-6xl font-extrabold">9%</div>
        <span class="text-sm uppercase">improvement</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import screenshotCR from "./img/screen-ab-cr.webp"
import screenshotCRSmall from "./img/screen-ab-cr-small.webp"
export default {
  setup() {
    return { screenshotCR, screenshotCRSmall }
  },
}
</script>
<style lang="less"></style>
