<template>
  <div class="wrap">
    <factor-input-image-upload v-model="images" max="3" min="1" />

    <div class="drawer">
      <h3>Images Value</h3>
      <div class="value">{{ images }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { factorInputImageUpload } from "@factor/ui"

export default {
  components: { factorInputImageUpload },
  data() {
    return { images: [] }
  },
}
</script>

<style lang="less" scoped>
.wrap {
  .drawer {
    margin-top: 1rem;
    .value {
      opacity: 0.6;
      font-weight: 600;
      font-family: "Courier New", Courier, monospace;
      font-size: 0.8em;
    }
  }
}
</style>
