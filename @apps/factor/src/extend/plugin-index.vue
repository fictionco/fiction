<template>
  <div class="plugins-container">
    <div class="plugin-index-head">
      <div class="content-pad">
        <h1 class="title">Factor Plugins</h1>
        <h3 class="sub-title">Add new features to your app in seconds</h3>
      </div>
    </div>

    <div v-if="true" class="coming-soon">
      <div class="title">Coming Soon 👋</div>
      <div class="sub-title">Themes will launch April 21, 2020</div>

      <div class="actions">
        <factor-link btn="primary" path="/signin?newAccount">Create Account &rarr;</factor-link>
        <span class="cta-tag">for early access.</span>
      </div>
    </div>

    <div v-else-if="loading" class="posts-loading">
      <factor-loading-ring />
    </div>
    <div v-else class="plugins-wrap content-pad">
      <div class="content">
        <section v-if="extensionFeatured.length > 0" class="plugins-featured">
          <header class="section-header">
            <h1 class="title">Featured</h1>
          </header>
          <div class="plugins-grid">
            <factor-link
              v-for="(item, index) in extensionFeatured"
              :key="index"
              :path="extensionPermalink({ name: item._id })"
              class="entry-plugin"
            >
              <div class="entry-content">
                <div class="entry-image">
                  <img :src="extensionIcon(item)" :alt="`${item.name} Icon`" />
                </div>
                <h3 class="title">{{ titleFromPackage(item) }}</h3>
                <div class="meta">
                  <div class="authors">by {{ getAuthors(item) }}</div>
                </div>

                <p v-if="item.description" class="text">{{ item.description }}</p>
              </div>
              <div class="entry-footer">
                <div
                  v-if="item.downloads"
                  class="downloads"
                >&darr; {{ formatDownloads(item.downloads) }} downloads</div>
              </div>
            </factor-link>
          </div>
        </section>

        <section class="plugins-all">
          <header class="section-header">
            <h1 class="title">All</h1>
          </header>
          <factor-link
            v-for="(item, i) in extensionIndex"
            :key="i"
            :path="extensionPermalink({ name: item._id })"
            class="entry-plugin"
          >
            <div class="entry-image">
              <img :src="extensionIcon(item)" :alt="item.name" />
            </div>

            <div class="entry-content">
              <h3 class="title">{{ titleFromPackage(item) }}</h3>
              <div class="meta">
                <div class="authors">by {{ getAuthors(item) }}</div>
              </div>

              <p v-if="item.description" class="text">{{ item.description }}</p>
            </div>
          </factor-link>
        </section>
      </div>
      <div>
        <widget-sidebar :index-data="extensionIndex" />
      </div>
    </div>

    <widget-cta />
  </div>
</template>

<script lang="ts">
import { factorLoadingRing, factorLink } from "@factor/ui"
import Vue from "vue"
import {
  titleFromPackage,
  formatDownloads,
  extensionPermalink,
  extensionIcon,
  getAuthors
} from "./util"
import { requestExtensionIndex, getIndexCache } from "./extension-request"

export default Vue.extend({
  components: {
    "widget-sidebar": () => import("./widget-sidebar.vue"),
    "widget-cta": () => import("./widget-cta.vue"),
    factorLoadingRing,
    factorLink
  },
  data() {
    return {
      loading: true,
      getData: ""
    }
  },
  async serverPrefetch() {
    return await requestExtensionIndex({ type: "plugins" })
  },
  computed: {
    extensionFeatured(this: any) {
      return this.extensionIndex.filter(_ => _.featured).slice(0, 2)
    },
    extensionIndex() {
      return getIndexCache() || []
    }
  },
  async mounted() {
    if (this.extensionIndex.length == 0) {
      await requestExtensionIndex({ type: "plugins" })
    }

    this.loading = false
  },
  methods: {
    titleFromPackage,
    formatDownloads,
    extensionPermalink,
    extensionIcon,
    getAuthors
  },
  metaInfo() {
    return {
      title: "Factor Plugins",
      description: "Add advanced features to your app in seconds."
    }
  }
})
</script>
<style lang="less">
.plugins-container {
  @import "~./style.less";
  padding-top: 45px;
  font-weight: 400;
  overflow: hidden;
  .plugin-index-head {
    padding: 6em 0;
    text-align: center;
    .title {
      font-size: 2.5em;
      line-height: 1.1;
      font-weight: var(--font-weight-bold, 700);
      letter-spacing: -0.03em;
      text-transform: capitalize;
    }
    .sub-title {
      font-size: 1.6em;
      opacity: 0.7;
    }
  }

  .posts-loading .loading-ring-wrap {
    min-height: 400px;
  }
  .content-pad {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5em;
    width: 100%;
    z-index: 10;
    position: relative;
  }

  /* HEADER */
  .header {
    background-image: url("./img/dot.svg");
    overflow: hidden;

    .content-pad {
      display: grid;
      grid-template-columns: 4fr 3fr;
    }

    .header-content {
      padding: 4em 0;

      .page-title-sub {
        font-size: 1.6em;
      }
      @media (max-width: 900px) {
        padding: 3rem 0;
        .page-title {
          font-size: 1.7em;
          line-height: 1.3;
        }
        .page-title-sub {
          font-size: 1.4em;
          line-height: 1.1;
        }
      }
    }

    .header-figure {
      position: relative;
    }

    @media (max-width: 900px) {
      .content-pad {
        grid-template-columns: 1fr;
      }
    }
  }

  /* PAGE CONTENT */
  .plugins-wrap {
    display: grid;
    grid-template-columns: 7fr 3fr;
    grid-gap: 6rem;
    padding-top: 2rem;

    .section-header {
      .title {
        font-size: 1.6em;
        font-weight: 500;
        line-height: 1.1;
        letter-spacing: -0.02em;

        @media (max-width: 900px) {
          font-size: 1.7em;
          line-height: 1.2;
        }
      }
    }

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      grid-gap: 1rem;
    }
  }
  .entry-plugin {
    box-shadow: 0 1px 3px #afb6ca;
    color: var(--color-text);
    border-radius: 6px;
    background: #fff;
    transition: 0.3s all;
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 1px 3px 0px #afb6ca;
      background: #fafafa;
    }
  }

  //  FEATURED PLUGINS
  .plugins-featured {
    .section-header {
      margin: 0 0 1rem;
    }
    .plugins-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 1.5rem;
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }
    .entry-plugin {
      padding: 1.5rem;

      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .entry-image {
        height: 70px;
        width: 70px;
        margin-bottom: 1rem;
        border-radius: 50%;
        overflow: hidden;
        background: var(--color-bg-contrast);
        border: 1px solid var(--color-bg-contrast-more);
        box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.3);
        img {
          width: 100%;
        }
      }
      .entry-content {
        overflow: hidden;
        margin: 1em 0;
        .title {
          font-size: 1.6em;
          line-height: 1.2em;
          margin-bottom: 5px;
          text-transform: capitalize;
        }
        .meta {
          color: rgba(var(--color-text-rgb), 0.6);
          > div {
            display: inline-block;
            margin-right: 1rem;
            &:last-child {
              margin-right: 0;
            }
            &.categories,
            &.authors {
              display: inline-block;
              .category,
              .author {
                display: inherit;
                &:after {
                  content: ", ";
                  padding-right: 5px;
                }
                &:last-of-type {
                  &:after {
                    content: initial;
                  }
                }
              }
            }
          }
        }
        .text {
          line-height: 1.7em;
          margin: 0.5em 0;
        }
      }
    }
  }

  // // SEARCH AND CATEGORIES
  // .plugins-search-wrap {
  //   display: grid;
  //   grid-gap: 1rem;
  //   grid-template-columns: 1fr auto;
  // }

  //  ENTRIES ALL
  .plugins-all {
    .section-header {
      margin: 2rem 0 1.5rem;
    }
    .entry-plugin {
      display: grid;
      grid-template-columns: 70px 3fr;
      grid-gap: 2rem;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      padding: 2rem;
      background: #fff;

      @media (max-width: 900px) {
        display: block;
      }

      .entry-image {
        height: 70px;
        width: 70px;
        margin-bottom: 1rem;
        border-radius: 50%;
        overflow: hidden;
        background: var(--color-bg-contrast);
        border: 1px solid var(--color-bg-contrast-more);
        box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.3);
        img {
          width: 100%;
        }
      }
      .entry-content {
        overflow: hidden;
        .title {
          font-size: 1.6em;
          line-height: 1.2em;
          margin-bottom: 5px;
          text-transform: capitalize;
        }
        .meta {
          color: rgba(var(--color-text-rgb), 0.6);
          > div {
            display: inline-block;
            margin-right: 1rem;
            &:last-child {
              margin-right: 0;
            }
            &.categories,
            &.authors {
              display: inline-block;
              .category,
              .author {
                display: inherit;
                &:after {
                  content: ", ";
                  padding-right: 5px;
                }
                &:last-of-type {
                  &:after {
                    content: initial;
                  }
                }
              }
            }
          }
        }
        .text {
          line-height: 1.7em;
          margin: 0.5em 0;
        }
      }
    }
  }
}
</style>
