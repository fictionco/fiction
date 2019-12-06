<template>
  <div class="jobs-content">
    <h1 class="title">Find a Job</h1>
    <router-view />
  </div>
</template>

<script lang="ts">
export default {}
</script>


<style lang="less">
.jobs-content {
  max-width: 50rem;
  margin: 2em auto;
  .title {
    font-size: 4em;
    letter-spacing: -0.03em;
    line-height: 1;
    font-weight: var(--font-weight-bold, 800);
    margin-bottom: 0.5em;
  }
}
</style> 