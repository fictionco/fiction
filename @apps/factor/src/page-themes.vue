<template>
  <div class="themes-container">
    <section class="mast">
      <div class="splash">
        <div>
          <h1 class="title">Factor Themes</h1>
          <p class="subtitle">Built for perfectionists with deadlines.</p>
          <div class="actions">
            <factor-link path="/docs" btn="primary" size="large">
              How to Install
              <factor-icon icon="fas fa-arrow-right" />
            </factor-link>
          </div>
        </div>
      </div>
    </section>
    <factor-modal class="install-modal" :vis.sync="vis">
      <h2>{{ selectedTheme }} Theme</h2>
      <div
        class="description"
      >Use this theme by adding it to your app dependencies using the command:</div>
      <div class="command">
        yarn add
        <span class="package-name">{{ selectedPkg }}</span>
      </div>
    </factor-modal>
    <section class="themes-wrap stripes-wrap">
      <div class="stripes" />
      <div class="mast themes">
        <div class="items-wrap">
          <div v-for="(item, i) in extensions.themes" :key="i" class="item">
            <div class="item-top">
              <factor-link :path="item.demo">
                <img :src="item.screenshot" :alt="item.name" />
              </factor-link>
            </div>
            <div class="item-bottom">
              <div>
                <h3 class="title">
                  <factor-link :path="item.url">{{ item.name }}</factor-link>
                </h3>
                <span class="category">
                  <factor-link :path="`/extensions/category/${item.category}`">
                    {{
                      toLabel(item.category)
                    }}
                  </factor-link>
                </span>
              </div>
              <div>
                <div class="downloads">
                  <factor-link btn="default" size="small" :path="item.demo">
                    <i class="fa fa-arrow-right" /> Demo
                  </factor-link>
                  <factor-link btn="primary" size="small" @click="showModal(item)">
                    <i class="fa fa-arrow-down" /> Install
                  </factor-link>
                  <factor-link btn="default" size="small" :path="item.github">
                    <factor-icon icon="fab fa-github" />
                  </factor-link>
                </div>
                <div class="author">
                  <factor-link btn="subtle" size="small" :path="item.author.url">
                    <factor-icon :icon="item.author.icon" />
                    {{ item.author.name }}
                  </factor-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { factorLink, factorModal, factorIcon } from "@factor/ui"
import { toLabel } from "@factor/api"
import Vue from "vue"
import { extensions } from "./extension-record"
export default Vue.extend({
  components: { factorLink, factorModal, factorIcon },
  data() {
    return {
      loading: true,
      nav: [],
      clicked: false,
      extensions: extensions(),
      vis: false,
      selectedTheme: null,
      selectedPkg: null
    }
  },

  methods: {
    toLabel,
    showModal(item) {
      this.selectedTheme = item.name
      this.selectedPkg = item.pkg
      this.vis = true
    }
  },
  metaInfo() {
    return {
      title: "Factor Themes Built and Curated by the Factor Team.",
      description:
        "Factor Themes is a collection of the best templates and themes curated by Factor's creators. Our collection of templates include themes to build a landing page, a static site, an application, and more."
    }
  }
})
</script>
<style lang="less">
.install-modal {
  h2 {
    font-size: 1.5em;
    font-weight: 800;
    margin-bottom: 1em;
  }
  .description {
    opacity: 0.7;
    margin: 1.5em;
  }
  .command {
    font-weight: 600;
    opacity: 0.7;
    margin-top: 1em;
    background: rgba(50, 50, 50, 0.04);
    box-shadow: 0 0 0 1px rgba(50, 50, 50, 0.1);
    padding: 5px;
    .package-name {
      font-weight: 700;
    }
  }
}
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
    grid-column-gap: 2em;
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
          box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
          transition: all 0.2s ease-in-out;
          &:hover {
            transform: translateY(-0.1em);
            box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08),
              0 11px 16px rgba(50, 50, 93, 0.2);
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

        .downloads,
        .author {
          text-align: right;
          margin-bottom: 0.3em;
        }
        .downloads {
          margin-top: 0.4em;
        }
      }
    }
  }
}
</style>
