<template>
  <figure class="bg-center bg-no-repeat" :style="cssProps">
    <img src="../img/devops.svg" alt="devops" class="relative z-30 h-full w-full object-contain" />
  </figure>
</template>

<script>
import Vue from "vue"
export default Vue.extend({
  data() {
    return {
      cssProps: {
        backgroundImage: `url(${require("../img/stars.svg")})`
      }
    }
  }
})
</script>