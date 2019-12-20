<template>
  <div class="plugin-blog">
    <router-view />
  </div>
</template>



<style lang="less">
.plugin-blog {
  .entries {
    max-width: 50rem;
    margin: 0 auto 0;
    padding: 1rem 0;
    @media (max-width: 767px) {
      margin: 0 auto;
    }
  }
}
</style>