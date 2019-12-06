<template>
  <div class="work">
    <div class="content-area">
      <router-view />
    </div>
  </div>
</template>
<script lang="ts">
export default {}
</script>

<style lang="less">
.work {
  .content-area {
    max-width: 960px;
    margin: 0 auto;
    padding: 40px 0;
    font-weight: 500;
  }
}
</style>