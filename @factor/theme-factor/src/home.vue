<template>
  <div class="home">
    <section class="splash-wrap">
      <div class="splash mast">
        <div>
          <h1 class="title">The New Standard in CMS</h1>
          <p
            class="subtitle"
          >Factor is a modern framework based on Vue.js that helps developers build blazing fast websites and apps.</p>
          <div class="actions">
            <factor-link path="/how-it-works" btn="secondary" size="large">
              Get Started
              <i class="fa fa-arrow-right" />
            </factor-link>
          </div>
        </div>
        <div class="splash-image">
          <img :src="require(`./img/dashboard.svg`)" alt="Factor - Dashboard">
        </div>
      </div>
    </section>
    <section class="boxes-wrap stripes-wrap">
      <div class="stripes" />
      <div class="mast">
        <h2 class="title">Why Factor?</h2>
        <p class="subtitle">With Factor you can build sites faster using Vue.js.</p>
        <div class="boxes">
          <div class="box">
            <el-svg icon="server" />
            <h2>Static Hosting</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
          </div>
          <div class="box">
            <el-svg icon="js" />
            <h2>100% JavaScript</h2>
            <p>One language to rule them all. Lorem ipsum dolor sit amet.</p>
          </div>
          <div class="box">
            <el-svg icon="npm" />
            <h2>NPM Plugins</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
          </div>
          <div class="box">
            <el-svg icon="vue" />
            <h2>Vue/Reactive Components</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
          </div>
          <div class="box">
            <el-svg icon="infinite" />
            <h2>Infinite Scalability</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
          </div>
          <div class="box">
            <el-svg icon="fast-clock" />
            <h2>Faster Development</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
          </div>
        </div>
        <div class="actions">
          <factor-link path="/how-it-works">
            See how it works
            <i class="fa fa-arrow-right" />
          </factor-link>
        </div>
      </div>
    </section>
    <section class="mast">
      <div class="cta">
        <div>
          <h3 class="title">Ready to Start Building?</h3>
          <p class="subtitle">Get in touch or create an account</p>
        </div>
        <div class="actions">
          <factor-link path="/how-it-works" btn="primary" size="large">
            Get Started
            <i class="fa fa-arrow-right" />
          </factor-link>
          <factor-link path="/contact" btn="tertiary" size="large">Contact Us</factor-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {
    "el-svg": () => import("./el/el-svg")
  },
  data() {
    return {
      loading: true
    }
  },
  mounted() {},
  metatags() {
    return {
      title: "The New Standard in CMS",
      description: "Factor helps developers build sites faster with vue.js.",
      image: ""
    }
  }
}
</script>
<style lang="less">
.home {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1200px;
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
      background: #f6f9fc;
      @media (max-width: 767px) {
        background: #fafbff;
      }
    }
    .mast {
      position: relative;
    }
  }

  .splash-wrap {
    background: #fff;
  }
  .splash {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 60px;
    align-items: center;
    padding: 3em 2em;
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }
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
    .actions {
      margin-top: 1.5em;
      @media (max-width: 767px) {
        margin-bottom: 1.5em;
      }
    }
    .splash-image {
      z-index: 10;
      padding: 3em;
      @media (max-width: 767px) {
        margin-top: 2em;
        padding: 0;
        display: block;
        justify-content: center;
      }
      img {
        max-width: 100%;
        // box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
        //   0 18px 36px -18px rgba(0, 0, 0, 0.3),
        //   23.4px 37.5px 75px -37.5px rgba(0, 0, 0, 0.4);
        transform: scale(1.3) translateY(20px) perspective(1040px)
          rotateY(-3deg) rotateX(1deg) rotate(1deg);
        @media (max-width: 767px) {
          transform: scale(1) translateY(0) perspective(0) rotateY(0deg)
            rotateX(0deg) rotate(-5deg);
        }
      }
    }
  }
  .boxes-wrap {
    padding: 4em 0;
    margin: 0 0 3em;
    .title {
      font-weight: 600;
      font-size: 2.6em;
      letter-spacing: -0.03em;
      line-height: 1;
      margin-bottom: 0.2em;
      text-align: center;
    }
    .subtitle {
      opacity: 0.5;
      font-size: 1.4em;
      font-weight: 500;
      text-align: center;
      @media (max-width: 767px) {
        font-size: 1.2em;
      }
    }
    .actions {
      display: flex;
      justify-content: center;
      margin-top: 1em;
      a {
        font-size: 1.2em;
      }
    }
  }
  .boxes {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 60px;
    @media (max-width: 767px) {
      display: block;
    }
    .box {
      margin: 2em 0;
      @media (max-width: 767px) {
        margin: 1em 0 2em;
      }
      .svg-wrap {
        display: inline-block;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-radius: 14px;
        background: #fff;
        box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11),
          0 1px 3px rgba(0, 0, 0, 0.08);
        svg {
          padding: 2px;
          min-height: 50px;
        }
      }
      h2 {
        margin: 0.5em 0;
        font-weight: 600;
      }
      p {
        font-size: 1.2em;
        line-height: 1.4em;
        font-weight: 500;
        margin-top: 0.5em;
        opacity: 0.6;
      }
    }
  }
  .cta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 60px;
    padding: 4em 0;
    @media (max-width: 767px) {
      display: block;
    }
    .title {
      font-weight: 600;
      font-size: 2.6em;
      letter-spacing: -0.03em;
      line-height: 1.2em;
      margin-bottom: 0.2em;
    }
    .subtitle {
      opacity: 0.5;
      font-size: 1.4em;
      font-weight: 500;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      @media (max-width: 767px) {
        display: block;
        margin-top: 1.5em;
      }
    }
  }
}
</style>
