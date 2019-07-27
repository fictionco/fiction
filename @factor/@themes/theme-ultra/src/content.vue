<template>
  <div id="mainContentContainer" class="content-container">
    <div class="homeSideBar">
      <Sidebar />
    </div>
    <div class="content-main">
      <PageHome />
      <PageAbout />
      <PageServices />
      <PagePortfolio />
      <PageNews />
      <PageContact />
    </div>
  </div>
</template>
<script>
import Sidebar from "./sidebar.vue"
import PageHome from "./page-home.vue"
import PageAbout from "./page-about.vue"
import PageServices from "./page-services.vue"
import PagePortfolio from "./page-portfolio.vue"
import PageNews from "./page-news.vue"
import PageContact from "./page-contact.vue"
export default {
  components: {
    Sidebar,
    PageHome,
    PageAbout,
    PageServices,
    PagePortfolio,
    PageNews,
    PageContact
  },
  computed: {}
}
</script>

<style>
.content-container {
  display: grid;
  grid-template-columns: 20% 80%;
  width: 100%;
  height: 100vh;
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
