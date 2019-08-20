<template>
  <div
    id="mainContentContainer"
    :class="!mobile ? 'content-container' : 'mobile-content-container'"
  >
    <div v-if="!mobile">
      <Sidebar />
    </div>
    <div v-else class="home-sidebar-container">
      <div :class="showSidebar ? 'home-sidebar-mobile' : 'home-sidebar-arrows'">
        <Sidebar :mobile="mobile" :show-sidebar="showSidebar" class="sidebar-component" />
        <img
          :class="showSidebar ? 'arrows-to-right' : 'arrows-icon'"
          src="./img/arrows.svg"
          alt="arrows"
          @click="toggleSidebar()"
        >
      </div>
    </div>
    <div class="content-main">
      <PageHome :mobile="mobile" />
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
  data() {
    return {
      mobile: null,
      showSidebar: false
    }
  },
  computed: {},
  mounted() {
    this.mobile = navigator.userAgent.match(/Android|iPhone|iPad/g)
  },
  methods: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar
    }
  }
}
</script>

<style>
.content-container {
  display: grid;
  grid-template-columns: 20% 80%;
  width: 100%;
  height: 100vh;
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
  font-family: Work Sans;
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
  position: fixed;
  font-family: Work Sans;
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
