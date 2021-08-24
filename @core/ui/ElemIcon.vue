<template>
  <i class="factor-icon" :class="icon" />
</template>

<script lang="ts">
export default {
  props: {
    icon: { type: String, default: "" },
  },
}
</script>

<style>
@import "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.13.0/css/all.min.css";
</style>
