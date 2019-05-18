<template>
  <div class="starter-container">
    <site-head>
      <factor-link path="https://factor.fiction.com/docs" target="_blank">Docs</factor-link>
      <factor-link path="https://factor.fiction.com/themes" target="_blank">Themes</factor-link>
      <factor-link path="https://factor.fiction.com/stacks" target="_blank">Stacks</factor-link>
      <factor-link path="https://factor.fiction.com/plugins" target="_blank">Plugins</factor-link>
    </site-head>
    <section class="mast">
      <div class="splash">
        <div>
          <h1 class="title">
            Welcome to {{ siteName }}
            <span class="alt">Get Started</span>
          </h1>
          <h4>{{ description }}</h4>
        </div>
      </div>
    </section>
    <section class="mast">
      <div class="items-wrap">
        <div class="item">
          <img :src="require(`./img/docs.svg`)" alt="Docs">
          <h2 class="title">Docs</h2>
          <p
            class="content"
          >Learn how to use Factor CMS and build things with Factor's build system and JS framework.</p>
          <factor-link path="https://factor.fiction.com/docs" target="_blank">
            View
            <factor-icon icon="arrow-right" />
          </factor-link>
        </div>
        <div class="item">
          <img :src="require(`./img/themes.svg`)" alt="Themes">
          <h2 class="title">Themes</h2>
          <p
            class="content"
          >Themes built for developers. Component-based themes designed and built by or reviewed by the Factor team.</p>
          <factor-link path="https://factor.fiction.com/themes" target="_blank">
            View
            <factor-icon icon="arrow-right" />
          </factor-link>
        </div>
        <div class="item">
          <img :src="require(`./img/stacks.svg`)" alt="Stacks">
          <h2 class="title">Stacks</h2>
          <p
            class="content"
          >Stacks are like themes but for service APIs. No more days and months learning new APIs to get things working.</p>
          <factor-link path="https://factor.fiction.com/stacks" target="_blank">
            Learn More
            <factor-icon icon="arrow-right" />
          </factor-link>
        </div>
        <div class="item">
          <img :src="require(`./img/plugins.svg`)" alt="Plugins">
          <h2 class="title">Plugins</h2>
          <p
            class="content"
          >Factor plugins are NPM packages that you can install to any project. This is currently a small, but growing library.</p>
          <factor-link path="https://factor.fiction.com/plugins" target="_blank">
            View
            <factor-icon icon="arrow-right" />
          </factor-link>
        </div>
      </div>
    </section>
    <site-footer v-if="$route.meta.footer !== false" />
  </div>
</template>
<style src="./css/style.less" lang="less"></style>
<script>
import { name, description } from "../package"
export default {
  components: {
    "site-head": () => import("#/site-head"),
    "site-footer": () => import("#/site-footer")
  },
  data() {
    return {
      loading: true
    }
  },
  computed: {
    siteName() {
      return this.$utils.toLabel(name)
    },
    description() {
      return description
    }
  },
  metatags() {
    return {
      title: `Welcome to ${siteName}`,
      description: "Built with Factor. A modern framework CMS based on Vue.js.",
      image: ""
    }
  }
}
</script>
<style lang="less">
.starter-container {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }
  .splash {
    padding: 7em 0;
    text-align: center;
    @media (max-width: 767px) {
      padding: 4em 0;
    }
    .title {
      font-weight: 400;
      font-size: 3em;
      letter-spacing: -0.03em;
      line-height: 1.3em;
      margin-bottom: 0.2em;
      @media (max-width: 767px) {
        font-size: 2em;
      }
      .alt {
        display: block;
        font-weight: 800;
      }
    }
  }

  .items-wrap {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 1.5em;
    @media (max-width: 767px) {
      display: block;
    }
    .item {
      display: block;
      color: inherit;
      padding: 2em;
      margin-bottom: 1.5em;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 0 0 1px rgba(0, 43, 93, 0.1);
      transition: all 0.2s ease-in-out;
      a {
        font-weight: 600;
      }

      img {
        max-width: 50px;
        margin-bottom: 1em;
      }
      .title {
        font-size: 1.6em;
        font-weight: 800;
        margin-bottom: 0.5em;
      }
      .content {
        opacity: 0.5;
        line-height: 1.5;
        margin-bottom: 0.8em;
      }
    }
  }
}
</style>