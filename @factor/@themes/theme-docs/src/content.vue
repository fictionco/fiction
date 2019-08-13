<template>
  <div class="content-layout" :style="bg">
    <header-primary class="show-desktop" />
    <header-mobile class="show-mobile" />
    <div class="content-main">
      <div class="content-main-content">
        <router-view />
      </div>
      <footer-primary />
    </div>
  </div>
</template>

<style src="#/css/style.less" lang="less"></style>
<script>
export default {
  components: {
    "header-primary": () => import("#/header"),
    "footer-primary": () => import("#/footer"),
    "header-mobile": () => import("#/header-mobile")
  },
  computed: {
    bg() {
      return {
        background: this.$route.meta.background || ""
      }
    }
  }
}
</script>

<style lang="less">
.content-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .show-mobile {
    display: none;
    @media (max-width: 767px) {
      display: block;
    }
  }

  .show-desktop {
    display: block;
    @media (max-width: 767px) {
      display: none;
    }
  }

  .content-content {
    display: flex;
    flex-grow: 1;
    .content-nav,
    .content-main {
      overflow-y: scroll;
    }
    .content-nav {
      flex: 0 0 250px;
      padding: 1em 1.5em;
      background: rgba(38, 67, 89, 0.08);
    }
    .content-main {
      min-height: 100vh;
      flex: 1 1 100%;
      display: flex;
      flex-direction: column;
      .content-main-content {
        padding: 1.5em;
        flex-grow: 1;
      }
      .content-footer {
        padding: 1em 1.5em;
        font-size: 0.85em;
        color: rgba(38, 67, 89, 0.2);
        text-align: center;
      }
    }
  }
}
</style>