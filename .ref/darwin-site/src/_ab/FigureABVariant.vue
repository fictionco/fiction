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
        :src="screenshotEditor"
        alt="A/B Analytics - Screen Variant Editor"
      />
      <img
        class="
          shadow-2xl
          ring-1 ring-black ring-opacity-10
          rounded-md
          absolute
          -bottom-20
          right-40
          w-56
          z-20
        "
        :src="screenshotEdit"
        alt="A/B Analytics - Edit Variant"
      />
      <img
        class="
          shadow-2xl
          ring-1 ring-black ring-opacity-10
          rounded-md
          absolute
          -bottom-7
          -right-7
          w-80
          variant-weights
        "
        :src="screenshotWeights"
        alt="A/B Analytics - Screen Variant Weights"
      />
    </div>
  </div>
</template>

<script lang="ts">
import screenshotEdit from "./img/screen-variant-edit.webp"
import screenshotEditor from "./img/screen-variant-editor.webp"
import screenshotWeights from "./img/screen-variant-weights.webp"

export default {
  setup() {
    return { screenshotEdit, screenshotEditor, screenshotWeights }
  },
}
</script>
<style lang="less" scoped></style>
