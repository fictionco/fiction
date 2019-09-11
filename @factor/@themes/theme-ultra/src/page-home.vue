<template>
  <div class="page-home">
    <sectionIntro />
    <sectionAbout />
    <sectionServices />
    <sectionPortfolio />
    <sectionNews />
    <sectionContact />
  </div>
</template>

<script>
export default {
  components: {
    sectionIntro: () => import("./section-intro"),
    sectionAbout: () => import("./section-about"),
    sectionServices: () => import("./section-services"),
    sectionPortfolio: () => import("./section-portfolio"),
    sectionNews: () => import("./section-news"),
    sectionContact: () => import("./section-contact")
  },
  data() {
    return {
      loading: true
    }
  }
}
</script>

<style lang="less">
.page-container {
  min-height: 100vh;
  height: auto;
  display: grid;
  grid-template-columns: 1fr;
  padding: 4em;
  @media (max-width: 900px) {
    padding: 2em;
  }
}
</style>
