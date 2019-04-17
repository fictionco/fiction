<template>
  <div class="home-page">
    <section class="home-container">
      <div class="mast">
        <div class="home-intro">
          <h1 class="title">Theme Alpha</h1>
          <div
            class="subtitle"
          >I work with global brands and startups to create exciting and meaningful digital experiences.</div>
          <div class="actions">
            <factor-link path="/how-it-works" btn="tertiary" size="large">
              View Work
              <i class="fa fa-arrow-right" />
            </factor-link>
          </div>
        </div>
      </div>

      <el-cta />
    </section>
  </div>
</template>

<script>
export default {
  components: {
    "el-cta": () => import("./el/cta")
  },
  data() {
    return {
      loading: true
    }
  },
  // mounted() {
  //   this.$user.init(() => {
  //     this.loading = false
  //   })
  // },
  metatags() {
    return {
      title: "Factor Alpha Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions."
      //image: require("./img/fiction.jpg")
    }
  },
  methods: {}
}
</script>
<style lang="less">
.home-container {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }
  //Home Intro
  .home-intro {
    display: flex;
    align-items: center;
    text-align: center;
    flex-direction: column;
    max-width: 650px;
    margin: 0 auto;
    padding: 7em 0;
    @media (max-width: 767px) {
      padding: 4em 0;
    }
    .title {
      font-weight: 600;
      font-size: 3em;
      letter-spacing: -0.03em;
      line-height: 0.9;
      margin-bottom: 0.2em;
      @media (max-width: 767px) {
        font-size: 2em;
      }
    }
    .subtitle {
      opacity: 0.5;
      font-size: 1.5em;
      font-weight: 500;
      @media (max-width: 767px) {
        font-size: 1.2em;
      }
    }
    .join-up {
      .fi-btn {
        font-size: 1em;
      }
    }
    .actions {
      margin-top: 1.5em;
    }
  }
  //Home brands
  .brands {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 80px;
    align-items: center;
    padding: 2em 0;
    width: 80%;
    margin: 0 auto;
    @media (max-width: 767px) {
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 20px;
      justify-content: center;
    }
    .brand {
      text-align: center;
      opacity: 0.3;
      &:hover {
        opacity: 1;
      }
      img {
        max-width: 100px;
        max-height: 40px;
        width: auto;
      }
    }
  }
} // .home-container ends
</style>
