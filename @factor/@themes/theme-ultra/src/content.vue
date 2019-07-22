<template>
  <div id="mainContentContainer" class="contentContainer">
    <div class="homeSideBar">
      <Sidebar />
    </div>
    <div class="contentMain">
      <PageHome />
      <PageAbout />
      <PageServices />
      <PagePortfolio />
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import Sidebar from "./sidebar.vue";
import PageHome from "./page-home.vue";
import PageAbout from "./page-about.vue";
import PageServices from "./page-services.vue";
import PagePortfolio from "./page-portfolio.vue";
export default {
  components: {
    Sidebar,
    PageHome,
    PageAbout,
    PageServices,
    PagePortfolio
  },
  computed: {}
};
</script>

<style>
.contentContainer {
  display: grid;
  grid-template-columns: 20% 80%;
  width: 100%;
  height: 100vh;
}
.contentMain {
  height: 100%;
}
body {
  margin: 0;
}
html {
  scroll-behavior: smooth;
}
</style>
