<template>
  <div class="home">
    <section class="splash-wrap">
      <div class="splash mast">
        <div>
          <h1 class="title">Theme Alpha</h1>
          <p
            class="subtitle"
          >I work with global brands and startups to create exciting and meaningful digital experiences.</p>
          <div class="actions">
            <factor-link path="/how-it-works" btn="primary" size="large">
              View Work
              <i class="fa fa-arrow-right" />
            </factor-link>
          </div>
        </div>
      </div>
    </section>
    <section class="mast">
      <div class="cta">
        <div>
          <h3 class="title">For work inquiries, collaboration or feedback</h3>
        </div>
        <div class="actions">
          <factor-link path="/" btn="primary" size="large">
            Get in Touch
            <i class="fa fa-arrow-right" />
          </factor-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  // components: {
  //   "el-svg": () => import("./el/el-svg")
  // },
  data() {
    return {
      loading: true
    }
  },
  mounted() {},
  metatags() {
    return {
      title: "The New Theme",
      description: "Factor helps developers build sites faster with vue.js.",
      image: ""
    }
  }
}
</script>
<style lang="less">
.home {
  background: #f6f9fc;
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1024px;
    margin: 0 auto;
  }

  .stripes-wrap {
    position: relative;
    .stripes {
      position: absolute;
      z-index: 0;
      width: 100%;
      height: 100%;
      top: 0;
      transform: skewY(-5deg);
      background: #fff;
    }
    .mast {
      position: relative;
    }
  }

  .splash-wrap {
    .splash {
      display: grid;
      grid-template-columns: 1fr;
      grid-column-gap: 60px;
      align-items: center;
      text-align: center;
      max-width: 700px;
      padding: 10em 2em;
      .title {
        font-weight: 600;
        font-size: 4em;
        letter-spacing: -0.03em;
        line-height: 0.9;
        margin-bottom: 0.2em;
        @media (max-width: 767px) {
          font-size: 2.7em;
        }
      }
      .subtitle {
        opacity: 0.5;
        font-size: 1.4em;
        font-weight: 500;
        @media (max-width: 767px) {
          font-size: 1.2em;
        }
      }
      .github-link {
        display: block;
        font-weight: 600;
        font-size: 1.2em;
        color: inherit;
        margin-top: 20px;
        &:hover {
          color: #ff0076;
        }
      }
      .actions {
        margin-top: 1.5em;
        @media (max-width: 767px) {
          margin-bottom: 1.5em;
          a {
            display: inline-block;
            margin-bottom: 10px;
          }
        }
      }
    }
  }
  .svg-wrap {
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    svg {
      min-height: 40px;
    }
  }
  .cta {
    text-align: center;
    padding: 7em 0 5em;

    .title {
      font-weight: 600;
      font-size: 2.6em;
      letter-spacing: -0.03em;
      line-height: 1.2em;
      margin-bottom: 1em;
    }
  }
}
</style>
