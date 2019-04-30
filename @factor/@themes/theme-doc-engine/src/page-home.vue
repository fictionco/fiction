<template>
  <div class="page-home">
    <div class="container">
      <section class="intro">
        <div class="mast intro-inner">
          <h1 class="title">Factor Framework</h1>
          <div
            class="subtitle"
          >Serverless Framework designed to help you start a fully functional website, blog or PWA (progressive-web-app) within 5 minutes.</div>

          <div class="actions">
            <factor-link path="/docs/" btn="primary" size="large">
              Get Started
              <i class="fa fa-angle-right" />
            </factor-link>
            <factor-link path="/docs/" btn="default" size="large">Docs</factor-link>
          </div>
        </div>
      </section>

      <section class="boxes">
        <div class="mast boxes-inner">
          <div class="box">
            <h2 class="title">Approachable</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
          </div>
          <div class="box">
            <h2 class="title">Versatile</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
          </div>
          <div class="box">
            <h2 class="title">Performant</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
          </div>
        </div>
      </section>

      <!-- <el-cta /> -->
    </div>
  </div>
</template>

<script>
export default {
  // components: {
  //   "el-cta": () => import("./el/cta")
  // },
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
      title: "Factor Framework",
      description:
        "Serverless CMS designed to help you start a fully functional website, blog or PWA (progressive-web-app) within 5 minutes."
      //image: require("./img/fiction.jpg")
    }
  },
  methods: {}
}
</script>
<style lang="less">
.page-home {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }

  .intro {
    padding: 6em 0;
    @media (max-width: 767px) {
      padding: 4em 0;
    }
    .intro-inner {
      .title {
        font-weight: 600;
        font-size: 3em;
        letter-spacing: -0.03em;
        @media (max-width: 767px) {
          font-size: 2em;
        }
      }
      .subtitle {
        opacity: 0.5;
        font-size: 1.2em;
        line-height: 1.4;
      }
      .actions {
        margin-top: 1.5em;
      }
    }
  }

  .boxes {
    padding: 2em 0;
    .boxes-inner {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 80px;
      align-items: center;
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
      }
      .box {
        text-align: center;
        .title {
          color: var(--color-primary);
          font-size: 1.5em;
          font-weight: 400;
          padding: 0.5em 0;
        }
        p {
          line-height: 1.4em;
          color: var(--color-text);
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
