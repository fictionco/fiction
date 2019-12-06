<template>
  <div>
    <span class="message">{{ msg }}</span>
    <img :src="img" />
  </div>
</template>
<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  data() {
    return {
      msg: "::hello::",
      img: require("./test-image.jpg")
    }
  }
})
</script>
<style lang="less">
.some-nested-less {
  .is-nested {
    color: #0496ff;
  }
}
</style>
