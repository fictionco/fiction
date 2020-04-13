<template>
  <div id="siteWrap" class="content-container">
    <div>
      <site-nav />
    </div>
    <div class="content-main">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  components: {
    "site-nav": () => import("./site-nav.vue"),
  },
}
</script>

<style lang="less">
.content-container {
  display: grid;
  grid-template-columns: [nav] 280px [content] 4fr;
  width: 100%;
  height: 100vh;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}
.page-container {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100vh;
  height: auto;
  padding: 4em;
  @media (max-width: 900px) {
    padding: 6em 2em 3em;
  }
}
</style>
