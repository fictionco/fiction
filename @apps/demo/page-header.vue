<template>
  <div class="page-header">
    <h1 v-if="title">{{ title }}</h1>
    <h3 v-if="subTitle">{{ subTitle }}</h3>
  </div>
</template>
<script lang="ts">
export default {
  props: {
    title: { type: String, default: "" },
    subTitle: { type: String, default: "" },
  },
}
</script>
<style lang="postcss" scoped>
.page-header {
  text-align: center;
  line-height: 1.1;
  padding: 1em;
  margin-bottom: 2em;
  h1 {
    font-size: 1.5em;
    margin-bottom: 0.5rem;
  }
  h3 {
    font-size: 1.1em;
    color: var(--color-text-secondary);
  }
}
</style>
