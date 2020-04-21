<template>
  <div class="example docs-component-example">
    <factor-lightbox :visible.sync="vis" :imgs="images" :index="selected" />
    <factor-btn btn="primary" size="large" @click="vis = !vis">View Images Lightbox &rarr;</factor-btn>
  </div>
</template>
<script lang="ts">
import { factorLightbox, factorBtn } from "@factor/ui"
export default {
  components: { factorLightbox, factorBtn },
  data() {
    return {
      vis: false,
      selected: 0,
      images: [
        require("./img/icon-1.svg"),
        require("./img/icon-2.svg"),
        require("./img/icon-3.svg"),
        require("./img/icon-4.svg"),
      ],
    }
  },
  computed: {},
}
</script>
<style lang="less" scoped>
.example {
}
</style>
