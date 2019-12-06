<template>
  <h1>{{ text }}</h1>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  data() {
    return {
      text: "nope"
    }
  },
  created() {
    this.text = "mutated"
  }
})
</script>
