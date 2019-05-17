<template>
  <div class="home">
    <section class="splash-wrap">
      <div class="splash mast">
        <div class="stripes">
          <div class="wedge" />
        </div>
        <div class="mast-text">
          <h1 class="title">Factor CMS</h1>
          <p
            class="subtitle"
          >Factor is a modern CMS &amp; framework build on Vue.js that helps developers succeed where others have failed.</p>
          <div class="actions">
            <app-link path="/docs" btn="primary" size="large">Get Started</app-link>
            <app-link path="/docs" btn="tertiary" size="large">Read the Docs</app-link>
          </div>
        </div>
      </div>
    </section>
    <section class="boxes-wrap">
      <div class="boxes">
        <div class="box">
          <h2>Versatile</h2>
          <p>Factor can help you accomplish anything. Use only what you need, build whatever you can imagine.</p>
        </div>
        <div class="box">
          <h2>Simple</h2>
          <p>Factor won't waste your time. With Factor it's simple to start and even simpler once you're pro.</p>
        </div>
        <div class="box">
          <h2>Modular</h2>
          <p>How about we stop reinventing the wheel? With Factor, just drop-in a plugin, theme or stack instead.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      loading: true
    }
  },
  mounted() {},
  metatags() {
    return {
      title: "Factor.js - VueJS Framework + SSR CMS",
      description:
        "Factor is a modern serverless CMS based on Vue.js that helps developers build blazing fast websites and apps.",
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
    margin: 0 auto;
    position: relative;

    .mast-text {
      z-index: 1;
      max-width: 700px;
      padding: 6em 2em;
      margin: 2em auto 0;
    }
  }

  .stripes {
    pointer-events: none;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -72px;
    top: 50%;
    transform: skewY(-6deg);
    transition: opacity 0.2s ease-out;
    will-change: transform;
    .wedge {
      position: absolute;
      height: 5000px;
      bottom: 0;
      background: linear-gradient(270deg, #fff, #fff);
      left: 0;
      right: 0;
    }
  }

  .splash-wrap {
    .splash {
      display: grid;
      grid-template-columns: 1fr;
      grid-column-gap: 60px;
      align-items: center;
      text-align: center;

      .title {
        font-weight: 800;
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
        font-size: 1.6em;
        line-height: 1.4em;
        font-weight: 500;
        @media (max-width: 767px) {
          font-size: 1.2em;
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

  .boxes-wrap {
    padding: 4em 1em;
    position: relative;
    z-index: 1;
    .boxes {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 1em;
      @media (max-width: 767px) {
        display: block;
      }
      .box {
        padding: 2em;
        border-radius: 5px;
        background: #fff;
        box-shadow: 0 0 0 0.4px rgba(50, 50, 93, 0.05),
          0 50px 100px -20px rgba(50, 50, 93, 0.25),
          0 30px 60px -30px rgba(0, 0, 0, 0.3);

        margin: 2em 0;

        @media (max-width: 767px) {
          margin: 1em 0 2em;
        }
        h2 {
          font-size: 1.4em;
          line-height: 1em;
          font-weight: 800;
          margin: 0;
        }
        p {
          font-weight: 500;
          line-height: 1.4em;
          margin-top: 0.5em;
          opacity: 0.6;
        }
      }
    }
  }
}
</style>
