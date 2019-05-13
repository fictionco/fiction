<template>
  <div class="themes-container">
    <section class="mast">
      <div class="splash">
        <div>
          <h1 class="title">Factor Themes</h1>
          <p
            class="subtitle"
          >Build anything with Factor. Themes built by or reviewed by the Factor team.</p>
          <div class="actions">
            <app-link path="/docs" btn="primary" size="large">
              How to Install
              <factor-icon icon="arrow-right" />
            </app-link>
          </div>
        </div>
      </div>
    </section>
    <section class="themes-wrap stripes-wrap">
      <div class="stripes" />
      <div class="mast themes">
        <div class="items-wrap">
          <div class="item">
            <div class="item-top">
              <app-link path="/themes/alpha">
                <img :src="require(`./img/theme-alpha.jpg`)" alt="Alpha Theme">
              </app-link>
            </div>
            <div class="item-bottom">
              <div>
                <h3 class="title">
                  <app-link path="/themes/alpha">Alpha</app-link>
                </h3>
                <span class="category">
                  <app-link path="/themes/category/portfolio-and-blog">Portfolio &amp; Blog</app-link>
                </span>
              </div>
              <div>
                <p class="downloads">
                  <i class="fa fa-download" /> 854 Downloads
                </p>
                <p class="author">
                  <i class="fa fa-user" /> by Fiction
                </p>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="item-top">
              <app-link path="/themes/alpha">
                <img :src="require(`./img/theme-alpha.jpg`)" alt="Alpha Theme">
              </app-link>
            </div>
            <div class="item-bottom">
              <div>
                <h3 class="title">
                  <app-link path="/themes/alpha">Alpha</app-link>
                </h3>
                <span class="category">
                  <app-link path="/themes/category/portfolio-and-blog">Portfolio &amp; Blog</app-link>
                </span>
              </div>
              <div>
                <p class="downloads">
                  <i class="fa fa-download" /> 663 Downloads
                </p>
                <p class="author">
                  <i class="fa fa-user" /> by Fiction
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <el-cta />
  </div>
</template>

<script>
export default {
  components: {
    "el-cta": () => import("./el/cta")
  },
  data() {
    return {
      loading: true,
      nav: [],
      headers: [],
      allHeaders: [],
      clicked: false
    }
  },
  computed: {},
  mounted() {},
  methods: {},
  metatags() {
    return {
      title: "Factor Themes Built and Curated by the Factor Team.",
      description:
        "Factor Themes is a collection of the best templates and themes curated by Factor's creators. Our collection of templates include themes to build a landing page, a static site, an application, and more.",
      image: ""
    }
  }
}
</script>
<style lang="less">
.themes-container {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
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
      background: #fafbff;
    }
    .mast {
      position: relative;
    }
  }
  .splash {
    padding: 7em 0;
    text-align: center;
    @media (max-width: 767px) {
      padding: 4em 0;
    }
    .title {
      font-weight: 800;
      font-size: 3em;
      letter-spacing: -0.03em;
      line-height: 0.9;
      margin-bottom: 0.2em;
    }
    .subtitle {
      max-width: 600px;
      margin: 0 auto;
      opacity: 0.5;
      font-size: 1.5em;
      font-weight: 500;
      @media (max-width: 767px) {
        font-size: 1.2em;
      }
    }
    .actions {
      margin-top: 1.5em;
      @media (max-width: 767px) {
        margin-bottom: 1.5em;
      }
    }
  }
  .themes-wrap {
    padding: 6em 0;
    margin: 0 0 4em;
  }

  .items-wrap {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 1em;
    @media (max-width: 767px) {
      display: block;
    }
    .item {
      padding: 1em;
      margin-bottom: 1.5em;

      .item-top {
        display: flex;
        flex: 0 1 auto;
        align-items: center;
        margin-bottom: 15px;

        a {
          width: 100%;
        }
        img {
          width: 100%;
          border-radius: 4px;
          box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11),
            0 1px 3px rgba(0, 0, 0, 0.08);
          transition: all 0.2s ease-in-out;
          &:hover {
            transform: translateY(-0.1em);
            box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11),
              0 1px 3px rgba(0, 0, 0, 0.08), 0 11px 16px rgba(50, 50, 93, 0.2);
          }
        }
      }
      .item-bottom {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        line-height: 1.5;
        a {
          color: inherit;
          &:hover {
            color: var(--color-primary);
          }
        }
        .title a {
          font-size: 1.4em;
          font-weight: 800;
        }
        .category,
        .downloads,
        .author {
          opacity: 0.7;
        }
        .downloads,
        .author {
          text-align: right;
          margin-bottom: 0.3em;
          i {
            margin-right: 5px;
          }
        }
        .downloads {
          margin-top: 0.4em;
        }
      }
    }
  }
}
</style>
