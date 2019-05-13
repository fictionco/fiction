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
            <app-link path="/docs" btn="primary" size="large">Get Started</app-link>
            <app-link path="/docs" btn="tertiary" size="large">Read the Docs</app-link>
          </div>
        </div>
      </div>
    </section>
    <section class="boxes-wrap stripes-wrap">
      <div class="stripes" />
      <div class="mast">
        <div class="boxes">
          <div class="box">
            <h2>Static Hosting</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
          <div class="box">
            <h2>100% JavaScript</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
          <div class="box">
            <h2>NPM Plugins</h2>
            <p>Factor plugins are NPM packages that you can install to any project. This is a growing library.</p>
          </div>
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
      title: "The Serverless CMS",
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
      background: var(--color-bg-alt);
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
      padding: 6em 2em;
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
          a {
            display: inline-block;
            margin-bottom: 10px;
          }
        }
      }
    }
  }

  .boxes-wrap {
    padding: 4em 0;
    .boxes {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 40px;
      @media (max-width: 767px) {
        display: block;
      }
      .box {
        margin: 2em 0;
        text-align: center;
        @media (max-width: 767px) {
          margin: 1em 0 2em;
        }
        h2 {
          font-size: 1.4em;
          line-height: 1.4em;
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
