<template>
  <div class="view-compare">
    <section class="intro">
      <div class="mast">
        <div class="intro-inner">
          <div>
            <h1 class="title">A Modern Alternative to WordPress</h1>
            <div class="subtitle">Created for perfectionists with deadlines.</div>
            <div class="actions">
              <app-link path="/guide/quickstart" btn="primary" size="large">
                Start Your Web App
                <i class="fa fa-arrow-right" />
              </app-link>
            </div>
          </div>
          <div>
            <figure>
              <img
                :src="require(`./img/compare.svg`)"
                alt="Compare Factor to WordPress and modern JS frameworks"
              >
            </figure>
          </div>
        </div>
      </div>
      <div class="hhh" />
    </section>

    <section class="graphic-splash">
      <div class="mast">
        <div class="splash-wrap">
          <img class="theme-ultra" :src="require(`./img/theme-ultra.jpg`)" alt="Theme Ultra" >
          <img class="dashboard" :src="require(`./img/dashboard.svg`)" alt="Factor Dashboard" >
          <img class="theme-alpha" :src="require(`./img/theme-alpha.jpg`)" alt="Theme Alpha" >
        </div>
      </div>
    </section>

    <section class="compare-table-wrap">
      <div class="mast compare-table-inner">
        <h3 class="title">Compare Factor</h3>

        <div class="compare-table">
          <div id="column1" class="column">
            <span>Compare:</span>
            <span>5-Minute Setup</span>
            <span>Drop-in Plugins</span>
            <span>Database Tech</span>
            <span>Themes</span>
            <span>SSR</span>
            <span>SEO</span>
            <span>eCommerce</span>
          </div>
          <div id="column2" class="column">
            <span class="img-wrap">
              <img :src="require(`./img/wordpress.svg`)" alt="WordPress" >
            </span>
            <span>
              <factor-icon icon="check" />
            </span>
            <span>
              <factor-icon icon="close" />
            </span>
            <span>mySQL</span>
            <span>
              <factor-icon icon="check" />
            </span>
            <span>
              <factor-icon icon="close" />
            </span>
            <span>
              <factor-icon icon="check" />
            </span>
            <span>
              <factor-icon icon="check" />
            </span>
          </div>
          <div id="column3" class="column">
            <span>
              <el-factor />
            </span>
            <span>
              <factor-icon icon="check" />
            </span>
            <span>
              <factor-icon icon="check" />
            </span>
            <span>MongoDB</span>
            <span>
              <factor-icon icon="check" />
            </span>
            <span>
              <factor-icon icon="check" />
            </span>
            <span>
              <factor-icon icon="check" />
            </span>
            <span>In-Development</span>
          </div>
          <div id="column4" class="column">
            <span class="img-wrap">
              <img :src="require(`./img/js-frameworks.svg`)" alt="JavaScript frameworks" >
            </span>
            <span>
              <factor-icon icon="close" />
            </span>
            <span>
              <factor-icon icon="close" />
            </span>
            <span>?</span>
            <span>
              <factor-icon icon="check" />
            </span>
            <span>
              <factor-icon icon="check" />
            </span>
            <span>
              <factor-icon icon="close" />
            </span>
            <span>
              <factor-icon icon="close" />
            </span>
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
    "el-cta": () => import("#/el/cta"),
    "el-factor": () => import("#/el/logo-factor")
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
  computed: {
    normalizedNav() {
      return this.navItems().map(_ => {
        if (typeof _ == "string") {
          return {
            slug: _,
            name: this.$utils.toLabel(_)
          }
        } else {
          return _
        }
      })
    },
    activePath() {
      return this.$route.params.doc || ""
    }
  },

  methods: {
    navItems() {
      const nav = [
        {
          name: "All",
          slug: ""
        },
        "monitoring",
        "payment",
        "emailing",
        "search",
        "admin",
        "security",
        "maps"
      ]

      return nav
    }
  },
  metatags() {
    return {
      title: "Compare Factor",
      description: "Compare Factor to WordPress and modern JS frameworks.",
      image: ""
    }
  }
}
</script>
<style lang="less">
.view-compare {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }

  .intro {
    position: relative;
    background: #f5f8fc;

    .hhh {
      pointer-events: none;
      position: absolute;
      left: 0;
      right: 0;
      bottom: -100px;
      top: 50%;
      transform: skewY(-6deg);
      background: #f5f8fc;
      transition: opacity 0.2s ease-out;
      will-change: transform;
    }

    .intro-inner {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 1fr 2fr;
      grid-gap: 30px;
      align-items: center;
      padding: 7em 0 0;
      @media (max-width: 767px) {
        padding: 4em 0;
        grid-template-columns: 1fr;
      }
      .title {
        font-weight: 800;
        font-size: 3em;
        letter-spacing: -0.03em;
        line-height: 0.9;
        margin-bottom: 0.2em;
      }
      .subtitle {
        opacity: 0.5;
        font-size: 1.2em;
        line-height: 1.6em;
      }
      .actions {
        margin-top: 1.5em;
      }
      img {
        max-width: 100%;
      }
    }
  }

  .graphic-splash {
    padding: 10em 0 8em;
    .splash-wrap {
      position: relative;
      min-height: 340px;
    }
    img {
      position: absolute;

      &.theme-alpha,
      &.theme-ultra {
        max-width: 350px;
        box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25),
          0 8px 16px -8px rgba(0, 0, 0, 0.3),
          0 -6px 16px -6px rgba(0, 0, 0, 0.025);
      }
      &.theme-ultra {
        z-index: 3;
        top: 10em;
        bottom: 0;
        left: 0;
        right: auto;
      }
      &.dashboard {
        z-index: 2;
        top: 1em;
        bottom: 0;
        left: 50%;
        right: 0;
        margin-left: -275px;
      }
      &.theme-alpha {
        z-index: 1;
        top: 0;
        bottom: auto;
        left: auto;
        right: 0;
      }
      @media (max-width: 767px) {
        &.dashboard {
          display: none;
        }
      }
    }
  }

  .compare-table-wrap {
    position: relative;
    padding: 4em 0;
    @media (max-width: 767px) {
      padding: 4em 0 0;
    }

    .compare-table-inner {
      position: relative;
      z-index: 1;
      .title {
        font-weight: 800;
        font-size: 2em;
        letter-spacing: -0.03em;
        line-height: 1.2em;
        margin-bottom: 2em;
        text-align: center;
      }
      .compare-table {
        display: grid;
        grid-template-columns: repeat(4, minmax(180px, 1fr));
        border: 1px solid rgba(80, 102, 119, 0.1);
        box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25),
          0 8px 16px -8px rgba(0, 0, 0, 0.3),
          0 -6px 16px -6px rgba(0, 0, 0, 0.025);

        @media (max-width: 767px) {
          overflow-x: visible;
          overflow-y: scroll;
        }

        span {
          display: block;
          line-height: 60px;
        }
        .column {
          text-align: center;
          &:nth-child(1) {
            text-align: right;
          }
          span {
            padding: 0 1em;
            &.img-wrap {
              display: grid;
              justify-content: center;
              align-items: center;
              height: 60px;
            }
            &:nth-child(odd) {
              background: #eff3f8;
            }
            &:nth-child(even) {
              background: #fff;
            }
            i.fa-check {
              color: var(--color-primary);
            }
            @media (max-width: 767px) {
              &:nth-child(1) {
                position: sticky;
                top: 0;
              }
            }
          }
        }
        #column1 {
          font-weight: 800;
          color: rgba(80, 102, 119, 0.5);
          span {
            background: #fff;
          }
        }

        #column3 {
          z-index: 1;
          margin-top: -2em;
          margin-bottom: -2em;
          background: #ffffff;
          border: 1px solid rgba(80, 102, 119, 0.1);
          border-radius: 4px;
          box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25),
            0 8px 16px -8px rgba(0, 0, 0, 0.3),
            0 -6px 16px -6px rgba(0, 0, 0, 0.025);
          span:nth-child(1) {
            padding-top: 1.6em;
            padding-bottom: 1.6em;
            .logo-factor {
              svg {
                width: 80%;
                margin: 0 auto;
              }
            }
          }

          @media (max-width: 767px) {
            margin-top: 0em;
            margin-bottom: 0em;
            span:nth-child(1) {
              display: grid;
              align-items: center;
              height: 60px;
              padding-top: 0;
              padding-bottom: 0;
            }
          }
        }
      }
    }
    &:before {
      content: "";
      height: 150px;
      background: linear-gradient(180deg, #f6f9fc 0%, #ffffff 100%);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
  }
}
</style>
