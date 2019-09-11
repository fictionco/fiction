<template>
  <div id="mainContentContainer" class="content-container">
    <div>
      <sidebar />
    </div>
    <div class="content-main">
      <router-view />
      <home />
      <about />
      <services />
      <portfolio />
      <news />
      <contact />
    </div>
  </div>
</template>
<style src="#/css/style.less" lang="less"></style>
<script>
export default {
  components: {
    sidebar: () => import("./sidebar"),
    home: () => import("./page-home"),
    about: () => import("./page-about"),
    services: () => import("./page-services"),
    portfolio: () => import("./page-portfolio"),
    news: () => import("./page-news"),
    contact: () => import("./page-contact")
  },
  data() {
    return {
      // mobile: null,
      // orientationH: false,
      showSidebar: false
    }
  }
  // computed: {},
  // mounted() {
  //   this.mobile = navigator.userAgent.match(/Android|iPhone|iPad/g)
  //   if (window.orientation === 90 || window.orientation === -90) {
  //     this.orientationH = true
  //   }
  //   window.addEventListener("orientationchange", () => {
  //     if (window.orientation === 90 || window.orientation === -90) {
  //       this.orientationH = true
  //     } else {
  //       this.orientationH = false
  //     }
  //   })
  // },
  // methods: {
  //   toggleSidebar() {
  //     this.showSidebar = !this.showSidebar
  //   }
  // }
}
</script>

<style lang="less">
.content-container {
  display: grid;
  grid-template-columns: 280px 4fr;
  width: 100%;
  height: 100vh;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}
.home-sidebar-container {
  background: linear-gradient(304.61deg, #732b29 -122.45%, #111010 97.32%);
}
.mobile-content-container {
  display: grid;
  width: 100%;
  height: 100vh;
}
.home-sidebar-arrows {
  position: fixed;
  font-family: var(--font-family-primary);
  display: grid;
  align-items: center;
  color: #f7f7f7;
  background: linear-gradient(304.61deg, #732b29 -122.45%, #111010 97.32%);
  height: 100%;
  width: 30px;
  -webkit-transition: 0.8s; /* For Safari 3.1 to 6.0 */
  transition: 0.8s;
}
.home-sidebar-mobile {
  z-index: 2;
  position: fixed;
  font-family: var(--font-family-primary);
  display: grid;
  grid-template-columns: 10% 90%;
  align-items: center;
  color: #f7f7f7;
  background: linear-gradient(304.61deg, #732b29 -122.45%, #111010 97.32%);
  height: 100%;
  width: 70vw;
  opacity: 0.97;
  -webkit-transition: 0.8s; /* For Safari 3.1 to 6.0 */
  transition: 0.8s;
}
.home-sidebar-horizontal {
  width: 39vw;
}
.arrows-icon {
  width: 30px;
  height: 30px;
  z-index: 5;
  -webkit-transition: 0.8s; /* For Safari 3.1 to 6.0 */
  transition: 0.8s;
}
.arrows-to-right {
  margin-left: 62vw;
  position: absolute;
  width: 30px;
  height: 30px;
  z-index: 5;
  -webkit-transition: 0.8s; /* For Safari 3.1 to 6.0 */
  transition: 0.8s;
}
.arrows-horizontal {
  margin-left: 35vw;
}
.content-main {
  height: 100%;
}
body {
  margin: 0;
}
html {
  scroll-behavior: smooth;
}
</style>
