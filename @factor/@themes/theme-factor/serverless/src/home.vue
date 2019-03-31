<template>
  <div class="home">
    <section class="splash-wrap">
      <div class="splash mast">
        <div>
          <h1 class="title">The Serverless CMS</h1>
          <p
            class="subtitle"
          >Factor is a modern serverless CMS based on Vue.js that helps developers build blazing fast websites and apps.</p>
          <div class="actions">
            <factor-link path="/how-it-works" btn="primary" size="large">
              Start Building Free
              <i class="fa fa-arrow-right" />
            </factor-link>
            <factor-link path="/" btn="outline" size="large">Contact Us</factor-link>
          </div>
          <factor-link
            path="https://github.com/fiction-com/factor"
            class="github-link"
            target="_blank"
          >
            <i class="fa fa-github" /> View Factor on GitHub.
          </factor-link>
        </div>
        <!-- <div class="splash-image">
          <img :src="require(`./img/dashboard.svg`)" alt="Factor - Dashboard">
        </div>-->
      </div>
    </section>
    <section class="boxes-wrap stripes-wrap">
      <div class="stripes" />
      <div class="boxes-header mast">
        <div>
          <h2 class="title">Why Factor?</h2>
          <p
            class="subtitle"
          >Factor enables developers and content creators to do their best work, together and faster.</p>
        </div>
      </div>
      <div class="mast">
        <div class="boxes">
          <div class="box">
            <el-svg icon="server" color="#506677" />
            <h2>Static Hosting</h2>
            <p>Build apps that handle production-ready traffic without having to provide servers, or pay for resources that go unused.</p>
          </div>
          <div class="box">
            <el-svg icon="js" color="#506677" />
            <h2>100% JavaScript</h2>
            <p>One language to rule them all. Lorem ipsum dolor sit amet.</p>
          </div>
          <div class="box">
            <el-svg icon="npm" color="#506677" />
            <h2>NPM Plugins</h2>
            <p>Add functionality to the Factor CMS, include only what you need, and avoid any bloat.</p>
          </div>
          <div class="box">
            <el-svg icon="vue" color="#506677" />
            <h2>Vue/Reactive Components</h2>
            <p>Customize your front-end layout with vue.js single-file components.</p>
          </div>
          <div class="box">
            <el-svg icon="infinite" color="#506677" />
            <h2>Infinite Scalability</h2>
            <p>Factor is infinitely scalable with serverless builds out of the box. Save money by getting rid of large server requests.</p>
          </div>
          <div class="box">
            <el-svg icon="fast-clock" color="#506677" />
            <h2>Faster Development</h2>
            <p>Factor can enable you to launch serverless applications at record speed and low cost.</p>
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
            Start Building Free
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
      // .splash-image {
      //   z-index: 10;
      //   padding: 3em;
      //   @media (max-width: 767px) {
      //     margin-top: 2em;
      //     padding: 0;
      //     display: block;
      //     justify-content: center;
      //   }
      //   img {
      //     max-width: 100%;
      //     transform: scale(1.3) translateY(20px) perspective(1040px)
      //       rotateY(-3deg) rotateX(1deg) rotate(1deg);
      //     @media (max-width: 767px) {
      //       transform: scale(1) translateY(0) perspective(0) rotateY(0deg)
      //         rotateX(0deg) rotate(0deg);
      //     }
      //   }
      // }
    }
  }

  .boxes-wrap {
    padding: 4em 0;
    .boxes-header {
      display: grid;
      grid-template-columns: 1fr;
      grid-column-gap: 60px;
      align-items: center;
      text-align: center;
      max-width: 700px;
    }
    .title {
      font-weight: 600;
      font-size: 2.6em;
      letter-spacing: -0.03em;
      line-height: 1;
      margin: 0.5em 0 0.2em;
      text-align: center;
    }
    .subtitle {
      opacity: 0.5;
      font-size: 1.4em;
      font-weight: 500;
      text-align: center;
      margin-bottom: 1em;
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
  .svg-wrap {
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    svg {
      min-height: 40px;
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
      h2,
      p {
        font-size: 1.2em;
        line-height: 1.4em;
      }
      h2 {
        margin: 0;
        font-weight: 600;
      }
      p {
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
    padding: 7em 0 5em;
    @media (max-width: 767px) {
      text-align: center;
      grid-template-columns: 1fr;
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
      align-items: center;
      @media (max-width: 767px) {
        display: block;
        margin-top: 1.5em;
        a {
          display: inline-block;
          margin-bottom: 10px;
        }
        .is-btn + .is-btn {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
