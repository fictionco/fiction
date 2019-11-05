<template>
  <div id="siteWrap" class="content-container">
    <div>
      <header-mobile class="show-mobile" />
      <sidebar class="show-desktop" />
    </div>
    <div class="content-main">
      <router-view />
    </div>
  </div>
</template>
<style src="#/css/style.less" lang="less"></style>
<script>
export default {
  components: {
    sidebar: () => import("./sidebar.vue"),
    "header-mobile": () => import("./header-mobile.vue")
  }
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
  min-height: 100vh;
  height: auto;
  display: grid;
  grid-template-columns: 1fr;
  padding: 4em;
  @media (max-width: 900px) {
    padding: 3em 2em;
  }
}
</style>
