<template>
  <div class="theme-single">
    <!-- <div v-if="loading" class="posts-loading">
      <factor-loading-ring />
    </div>
    <div v-else>-->
    <section>
      <div class="theme-single-header">
        <div class="content-pad">
          <factor-link class="back" :path="`/themes`">
            <span>&larr; All Themes</span>
          </factor-link>
          <div class="content-wrap">
            <div class="title-wrap">
              <img src="./img/logo-alpha.svg" alt="Theme logo" class="logo" />
              <h1 class="title">Theme Alpha</h1>
              <h3
                class="description"
              >A forum solution with essential elements to run an efficient and professional community.</h3>
              <factor-link
                btn="primary"
                :path="`https://themes.factor.dev/alpha`"
                :target="`_blank`"
              >
                View Theme
                <i class="fa fa-arrow-right" />
              </factor-link>
            </div>
          </div>
        </div>
      </div>

      <div class="content-pad">
        <div class="theme-images">
          <img src="./img/screenshot-alpha.jpg" alt="image1" />
          <img src="./img/screenshot-alpha.jpg" alt="image2" />
          <img src="./img/screenshot-alpha.jpg" alt="image3" />
        </div>
      </div>

      <div class="theme-content-wrap content-pad">
        <div class="content">
          <theme-entry :text="getContent(item.readme)" class="theme-content" />
        </div>

        <div class="theme-meta">
          <div class="meta-card">
            <h3 class="title">Publisher</h3>
            <div class="meta-content">Factor Inc.</div>
          </div>

          <div class="meta-card">
            <h3 class="title">Repo Link</h3>
            <div class="meta-content">
              <factor-icon icon="fab fa-github" />
              <factor-link
                :path="`https://github.com/fiction-com/factor/tree/development/@themes/theme-alpha`"
                :target="`_blank`"
              >
                <span>https://github.com/fiction-com/factor/tree/development/@themes/theme-alpha</span>
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
    <!-- </div> -->

    <widget-cta />
  </div>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui" //factorLoadingRing,
import { renderMarkdown } from "@factor/api/markdown"
import { setting } from "@factor/api"
import Vue from "vue"
import { Route } from "vue-router"
import { getSingleCache, requestExtensionSingle, requestExtensionIndex } from "./request"

export default Vue.extend({
  components: {
    //factorLoadingRing,
    factorLink,
    factorIcon,
    "theme-entry": () => import("../el/entry.vue"),
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
      requestExtensionIndex({ type: "theme" }),
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
      //image: this.$post.shareImage(this.entry._id)
    }
  }
})
</script>

<style lang="less">
.theme-single {
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

  .theme-single-header {
    padding: 2rem 0;
    .back {
      margin: 1rem 0;
      font-weight: var(--font-weight-bold, 700);
      text-transform: uppercase;
    }
    .title-wrap {
      justify-content: center;
      text-align: center;
      padding: 4rem 0 2rem;
      letter-spacing: -0.03em;

      .logo {
        width: 160px;
        box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.07), 0px 2px 3px rgba(50, 50, 93, 0.13),
          0px 2px 5px rgba(50, 50, 93, 0.11);
        margin-bottom: 1rem;
      }

      .title {
        font-size: 2.8em;
        line-height: 50px;
        font-weight: var(--font-weight-bold, 700);
      }
      .description {
        opacity: 0.6;
        font-size: 1.5em;
        max-width: 600px;
        margin: 0 auto 1rem auto;
      }
    }
  }

  .theme-images {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    padding-bottom: 2rem;

    img {
      max-width: 500px;
      border-radius: 8px;
      margin-right: 2rem;
      box-shadow: 0px 0px 3px rgba(50, 50, 93, 0.2);
      transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);

      &:hover {
        transform: translateY(-0.5rem);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.07), 0 2px 3px rgba(50, 50, 93, 0.13),
          0 2px 5px rgba(50, 50, 93, 0.11);
      }

      @media (max-width: 900px) {
        max-width: 70%;
        margin-right: 1rem;
      }
    }
  }

  .theme-content-wrap {
    display: grid;
    grid-template-columns: 7fr 3fr;
    grid-gap: 6rem;
    align-items: start;
    padding-top: 2rem;
    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  .theme-meta {
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
