<template>
  <div id="siteWrap" class="content-container">
    <div>
      <sidebar />
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
    sidebar: () => import("./sidebar")
  },
  data() {
    return {
      // mobile: null,
      // orientationH: false,
      //showSidebar: false
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
