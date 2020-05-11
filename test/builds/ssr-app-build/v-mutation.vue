<template>
  <h1>{{ text }}</h1>
</template>

<script lang="ts">
export default {
  data() {
    return {
      text: "nope",
    }
  },
  created() {
    this.text = "mutated"
  },
}
</script>
