<template>
  <div class="extension-single">
    <div v-if="loading" class="extensions-loading">
      <factor-loading-ring />
    </div>
    <div v-else>
      <section class="splash">
        <div class="header">
          <div class="overlay" />
          <div class="content-area header-pad">
            <div class="content">
              <factor-link class="back" :path="`/themes`">
                <span>&larr; Back to {{ extensionType == 'theme' ? "Themes" : "Plugins" }}</span>
              </factor-link>
              <div class="text">
                <div class="title-wrap">
                  <div class="icon-area">
                    <img src="./img/logo-alpha.svg" alt="Theme logo" class="extension-icon" />
                  </div>
                  <h1 class="title">Alpha</h1>
                  <h3
                    class="description"
                  >A forum solution with essential elements to run an efficient and professional community.</h3>
                  <div class="actions">
                    <factor-link
                      btn="primary"
                      :path="`https://themes.factor.dev/alpha`"
                      :target="`_blank`"
                    >Add to Project &darr;</factor-link>
                    <factor-link
                      btn="default"
                      :path="`https://themes.factor.dev/alpha`"
                      :target="`_blank`"
                    >View Demo &rarr;</factor-link>
                  </div>
                </div>
              </div>
            </div>
            <div class="media">
              <div class="drawer">
                <div v-for="(img, i) in 3" :key="i" class="screenshot" :class="`sc-${i + 1}`">
                  <div class="screenshot-image" :style="{ backgroundImage: `url('${image}')` }" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="information">
        <div class="content-area medium">
          <div class="install-extension">
            <div class="title-header">
              <div class="title">To Install</div>
              <div class="sub-title">Add this package to your Factor enabled project:</div>
            </div>
            <div class="move-to-project">
              <div class="install-code">
                <span class="cmd">npm add</span>
                <span class="pkg">@factor/theme-alpha</span>
                <div class="copy">click to copy</div>
              </div>
              <div class="arrow">&rarr;</div>
              <div class="project">Your Project</div>
            </div>
          </div>
          <div class="long-form">.</div>
          <div class="info-grid">
            <div v-for="(block, i) in info" :key="i" class="info-block">
              <div class="block-title">
                <div class="title">{{ block.name }}</div>
                <div class="description">{{ block.description }}</div>
              </div>
              <div v-if="block.name == 'Readme'" class="block-readme">
                <text-entry class="entry" :text="getContent(item.readme)" />
                <div class="sidebar">...</div>
              </div>
              <div v-else class="block-features">
                <div v-for="(info, ind) in 4" :key="ind" class="info-area">
                  <div class="info-title">Some title</div>
                  <div
                    class="info-content"
                  >A forum solution with essential elements to run an efficient and professional community.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <call-to-action />
  </div>
</template>
<script lang="ts">
import { factorLink, factorLoadingRing } from "@factor/ui"
import { renderMarkdown } from "@factor/api/markdown"
import { setting } from "@factor/api"
import Vue from "vue"
import { Route } from "vue-router"
import { getSingleCache, requestExtensionSingle, requestExtensionIndex } from "./request"

export default Vue.extend({
  components: {
    factorLoadingRing,
    factorLink,
    callToAction: () => import("./el/cta.vue"),
    textEntry: () => import("../el/entry.vue")
  },
  data() {
    return {
      getData: "",
      loading: true,
      info: [
        // {
        //   name: "Features",
        //   description: "Why you'll love this",
        //   grid: [{ name: "Portfolio", description: "Some text goes here" }]
        // },
        { name: "Readme", description: "How to customize it" }
      ]
    }
  },
  async serverPrefetch() {},

  computed: {
    image(this: any) {
      return require("./img/screenshot-alpha.jpg")
    },
    extensionType(this: any) {
      return this.$route.path.includes("theme") ? "theme" : "plugin"
    },
    packageName(this: any) {
      return decodeURI(this.$route.query.package)
    },
    item(this: any) {
      return getSingleCache(this.packageName) || {}
    }
  },
  watch: {
    $route: function(this: any, to: Route, from: Route) {
      if (to.query.package != from.query.package) {
        this.getSingle()
      }
    }
  },
  async mounted() {
    const data = getSingleCache(this.packageName)

    if (!data) {
      await requestExtensionSingle(this.packageName)
    }

    this.loading = false
  },
  methods: {
    setting,
    async getSingle(this: any) {
      this.loading = true
      await requestExtensionSingle(this.packageName)
      this.loading = false
    },
    getContent(value: any) {
      return value ? renderMarkdown(value, { variables: true }) : ""
    }
  },
  metaInfo() {
    return {
      title: "Factor Themes",
      description: "Create beautiful apps in minutes."
    }
  }
})
</script>

<style lang="less">
.extension-single {
  .content-area {
    max-width: 1100px;
    margin: 0 auto;
    &.medium {
      max-width: 1000px;
    }
  }
  .information {
    .install-extension {
      text-align: center;

      margin: 0 auto;
      background: #fff;
      border-radius: 10px;

      z-index: 900;
      position: relative;
      padding: 4rem;
      .title-header {
        margin-bottom: 2rem;
        line-height: 1.2;
        .title {
          font-size: 2em;
          font-weight: 700;
        }
        .sub-title {
          opacity: 0.5;
          font-size: 1.2em;
        }
      }
      .move-to-project {
        display: flex;
        justify-content: center;
        .install-code,
        .project,
        .arrow {
          font-size: 1.5em;
          padding: 1rem 2rem;
        }
        .install-code,
        .project {
          letter-spacing: -0.03em;
          border-radius: 10px;

          font-weight: 700;
          box-shadow: var(--panel-shadow);
        }
        .install-code {
          background: var(--color-primary);
          color: #fff;
          position: relative;
          .copy {
            position: absolute;
            color: var(--color-text);
            opacity: 0.2;
            font-size: 1rem;
            text-transform: uppercase;
            text-align: center;
            transform: translateY(130%);
            width: 100%;
            left: 0;
            bottom: 0;
            letter-spacing: 1px;
          }
          .cmd {
            opacity: 0.4;
            margin-right: 0.5rem;
          }
        }
      }
    }
    .info-block {
      font-size: 1.2em;
      display: grid;
      grid-template-columns: 150px 1fr;
      grid-gap: 4rem;
      margin: 4rem 0;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 4rem;
      .block-title {
        text-align: right;
        .title {
          font-size: 1.5em;
          line-height: 1;
          font-weight: 700;
          letter-spacing: -0.03em;
        }
        .description {
          margin-top: 1rem;
          font-size: 0.9em;
          line-height: 1.5;
          opacity: 0.3;
        }
      }
      .block-features {
        display: grid;
        grid-gap: 2rem;
        grid-template-columns: 1fr 1fr;
        .info-title {
          font-weight: 700;
        }
        .info-content {
          opacity: 0.7;
        }
      }
      .block-readme {
        display: grid;
        grid-gap: 2rem;
        grid-template-columns: 1fr 200px;
      }
    }
  }
  .back {
    color: inherit;
    text-transform: uppercase;
    font-weight: 700;
    opacity: 0.2;
    letter-spacing: 1px;
    font-size: 0.9em;
    &:hover {
      opacity: 1;
    }
  }
  .header {
    position: relative;
    overflow: hidden;
    .overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      box-shadow: var(--panel-shadow-inset);
      z-index: 100;
      user-select: none;
      pointer-events: none;
    }

    .header-pad {
      display: grid;
      grid-gap: 8rem;
      grid-template-columns: 4fr 4fr;

      padding: 5rem 0 0;
    }
    .content {
      padding: 4rem 0;
      .icon-area {
        margin-bottom: 1rem;
        .extension-icon {
          max-width: 100px;
          border-radius: 10px;
        }
      }

      .title {
        font-size: 3.5em;
        letter-spacing: -0.03em;
        font-weight: 700;
      }
      .description {
        font-size: 1.6em;
        opacity: 0.6;
      }
      .actions {
        margin-top: 2rem;
        font-size: 1.2em;
        .factor-btn {
          padding: 1rem 2rem;
          margin-right: 1rem;
        }
      }
      .text {
        padding: 5rem 0;
      }
    }
    .media {
      position: relative;
      height: 100%;
      display: grid;

      .thumbs {
        width: 100%;

        padding: 1rem;
        z-index: 1000;
        justify-content: center;
        flex-direction: column;
        display: flex;
        .thumb {
          box-shadow: var(--panel-shadow);
          width: 75px;
          height: 50px;
          border-radius: 10px;
          background-size: cover;
          margin: 0.5rem;

          &.selected {
            box-shadow: 0 0 0 4px var(--color-primary);
          }
          &:hover {
            box-shadow: 0 0 0 4px var(--color-text);
          }
        }
      }
      .drawer {
        // position: absolute;
        // right: 0;
        // bottom: 0;
        // height: 500px;
        // width: 100%;
        position: relative;

        .screenshot {
          box-shadow: var(--panel-shadow);
          position: absolute;
          width: 100%;
          height: 100%;
          bottom: -30px;
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
          z-index: 50;
          &.sc-2 {
            transform-origin: bottom right;
            transform: translate(5%, 1%) scale(0.95);
            z-index: 30;
            .screenshot-image {
              opacity: 0.8;
            }
          }
          &.sc-3 {
            transform-origin: bottom right;
            transform: translate(10%, 2%) scale(0.9);
            z-index: 10;
            .screenshot-image {
              opacity: 0.6;
            }
          }
          .screenshot-image {
            background-size: cover;
            position: absolute;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
