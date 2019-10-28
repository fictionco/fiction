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
</style>
