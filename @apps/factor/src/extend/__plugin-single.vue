<template>
  <div class="plugin-single">
    <div v-if="loading" class="posts-loading">
      <factor-loading-ring />
    </div>
    <div v-else>
      <section>
        <div class="plugin-single-header">
          <div class="content-pad">
            <factor-link class="back" :path="`/plugins`">
              <span>&larr; All Plugins</span>
            </factor-link>
            <div class="content-wrap">
              <div class="title-wrap">
                <img :src="extensionIcon(item)" alt="Extension Icon" class="icon" />
                <div>
                  <h1 class="title">Plugin Name</h1>
                  <!-- {{ titleFromPackage(item) }} -->
                  <h3
                    class="description"
                  >A forum solution with essential elements to run an efficient and professional community.</h3>
                </div>
              </div>
              <div class="actions">
                <factor-link btn="default" path="#">Demo</factor-link>
                <factor-link
                  btn="primary"
                  :path="`https://github.com/fiction-com/factor/tree/development/@plugins/plugin-forum#getting-started`"
                  :target="`_blank`"
                >Install</factor-link>
              </div>
            </div>
          </div>
        </div>

        <div class="content-pad">
          <div class="plugin-images">
            <img src="./img/screenshot.jpg" alt="image1" />
            <img src="./img/screenshot2.jpg" alt="image2" />
            <img src="./img/screenshot.jpg" alt="image3" />
          </div>
          <div class="plugin-thumbs">
            <img src="./img/screenshot.jpg" alt="screenshot" @click="`#`" />
            <img class="active" src="./img/screenshot2.jpg" alt="screenshot" @click="`#`" />
            <img src="./img/screenshot.jpg" alt="screenshot" @click="`#`" />
          </div>
        </div>

        <div class="plugin-content-wrap content-pad">
          <div class="content">
            <plugin-entry :text="getContent(item.readme)" class="plugin-content" />
          </div>

          <div class="plugin-meta">
            <div class="meta-card">
              <h3 class="title">Publisher</h3>
              <div class="meta-content">Factor Inc.</div>
            </div>

            <div class="meta-card">
              <h3 class="title">Repo Link</h3>
              <div class="meta-content">
                <factor-icon icon="fab fa-github" />
                <factor-link
                  :path="`https://github.com/fiction-com/factor/tree/development/@plugins/plugin-forum`"
                  :target="`_blank`"
                >
                  <span>https://github.com/fiction-com/factor/tree/development/@plugins/plugin-forum</span>
                </factor-link>
              </div>
            </div>

            <div class="meta-card">
              <h3 class="title">Tags</h3>
              <div class="meta-content tags">
                <factor-link btn="default" size="small" :path="`#`">Support</factor-link>
                <factor-link btn="default" size="small" :path="`#`">Discussion</factor-link>
                <factor-link btn="default" size="small" :path="`#`">Forum</factor-link>
                <factor-link btn="default" size="small" :path="`#`">Community</factor-link>
              </div>
            </div>

            <div class="meta-card">
              <h3 class="title">Share</h3>
              <div class="meta-content share">
                <factor-link :path="`#`">
                  <factor-icon icon="fas fa-link" />Copy Link
                </factor-link>
                <factor-link
                  :path="`https://twitter.com/intent/tweet?text=post-title-goes-here+post-link-goes-here`"
                >
                  <factor-icon icon="fab fa-twitter" />Twitter
                </factor-link>
                <factor-link
                  :path="`https://www.facebook.com/sharer/sharer.php?u=post-link-goes-here`"
                >
                  <factor-icon icon="fab fa-facebook" />Facebook
                </factor-link>
              </div>
            </div>

            <div class="meta-card">
              <h3 class="title">Version History</h3>
              <div class="meta-content versions">
                <div class="version">
                  <p class="version-title">Version 1.4.0 on February 24, 2020</p>
                  <ul class="dashes">
                    <li>Added customization</li>
                    <li>Post type cached</li>
                  </ul>
                </div>

                <div class="version">
                  <p class="version-title">Version 1.3.12 on February 22, 2020</p>
                  <ul class="dashes">
                    <li>Notify was added</li>
                    <li>Route auth</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <widget-cta />
  </div>
</template>
<script lang="ts">
import { factorLink, factorLoadingRing, factorIcon } from "@factor/ui"
import { renderMarkdown } from "@factor/api/markdown"
import { setting } from "@factor/api"
import Vue from "vue"
import { Route } from "vue-router"
import { getSingleCache, requestExtensionSingle, requestExtensionIndex } from "./request"
import {
  titleFromPackage,
  formatDownloads,
  extensionPermalink,
  extensionIcon,
  screenshotsList,
  getAuthors
} from "./util"
export default Vue.extend({
  components: {
    factorLoadingRing,
    factorLink,
    factorIcon,
    "plugin-entry": () => import("../el/entry.vue"),
    "widget-cta": () => import("./el/cta.vue")
  },
  data() {
    return {
      getData: "",
      loading: true
    }
  },
  async serverPrefetch() {
    await Promise.all([
      requestExtensionIndex({ type: "plugin" }),
      requestExtensionSingle(this.packageName)
    ])
  },

  computed: {
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
    titleFromPackage,
    formatDownloads,
    extensionPermalink,
    extensionIcon,
    getAuthors,
    screenshotsList,
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
      title: "Factor Plugin Library",
      description: "Extend your project features and do more with Factor."
      //image: this.$post.shareImage(this.entry._id)
    }
  }
})
</script>

<style lang="less">
.plugin-single {
  padding-top: 45px;
  font-weight: 400;
  overflow: hidden;

  @media (max-width: 900px) {
    padding-top: 0;
  }

  .posts-loading {
    height: 70vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .content-pad {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5em;
    width: 100%;
    z-index: 10;
    position: relative;
  }

  .plugin-single-header {
    padding: 2rem 0;
    .back {
      margin: 1rem 0;
      font-weight: var(--font-weight-bold, 700);
      text-transform: uppercase;
    }
    .content-wrap {
      display: grid;
      grid-gap: 4rem;
      grid-template-columns: 7fr 3fr;
      padding: 4rem 0 2rem;

      @media (max-width: 900px) {
        grid-gap: 1rem;
        grid-template-columns: 1fr;
      }

      .icon {
        width: 50px;
        height: 50px;
        border-radius: 8px;
        box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.07), 0px 2px 3px rgba(50, 50, 93, 0.13),
          0px 2px 5px rgba(50, 50, 93, 0.11);
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      .title-wrap {
        display: grid;
        grid-template-columns: 70px 1fr;
        padding-right: 3rem;
        letter-spacing: -0.03em;

        @media (max-width: 900px) {
          grid-gap: 1rem;
          grid-template-columns: 1fr;
        }

        .title {
          font-size: 2.8em;
          line-height: 50px;
          font-weight: var(--font-weight-bold, 700);
        }
        .description {
          opacity: 0.6;
          font-size: 1.5em;
        }
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        .btn-link + .btn-link {
          margin-left: 1em;
        }
        @media (max-width: 900px) {
          justify-content: flex-start;
        }
      }
    }
  }

  .plugin-images {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    flex-wrap: nowrap;
    padding-bottom: 2rem;
    overflow: auto;

    img {
      max-width: 500px;
      border-radius: 8px;
      margin-right: 2rem;

      @media (max-width: 900px) {
        max-width: 70%;
        margin-right: 1rem;
      }
    }
  }

  .plugin-thumbs {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 100px 100px 100px;

    img {
      max-width: 100px;
      border-radius: 8px;
      box-sizing: border-box;
      box-shadow: 0 0 0 2px #fff;
      cursor: pointer;
      transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);

      &.active {
        box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--color-primary);
      }
      &:hover {
        transform: translateY(-0.5rem);
        box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--color-primary),
          0 5px 15px rgba(0, 0, 0, 0.07), 0 2px 3px rgba(50, 50, 93, 0.13),
          0 2px 5px rgba(50, 50, 93, 0.11);
      }
    }
  }

  .plugin-content-wrap {
    display: grid;
    grid-template-columns: 7fr 3fr;
    grid-gap: 6rem;
    align-items: start;
    padding-top: 2rem;
    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  .plugin-meta {
    .meta-card {
      margin-bottom: 2rem;
    }
    .title {
      font-size: 1.4em;
      font-weight: var(--font-weight-bold, 700);
      letter-spacing: -0.02em;
      margin-bottom: 0.5rem;
    }
    ul.dashes {
      list-style: none;
      padding-left: 1em;
      li {
        &:before {
          content: "-";
          text-indent: -1em;
          display: inline-block;
        }
      }
    }
    .meta-content {
      &.tags .factor-link {
        background: #e7edf3;
      }
      &.share .factor-link {
        display: block;
        color: inherit;
        &:hover {
          color: var(--color-primary);
        }
        i {
          width: 0.5rem;
          margin-right: 1rem;
        }
      }
      .version {
        margin-bottom: 1rem;
        .version-title {
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
