<template>
  <div class="themes-container">
    <widget-header :title="`Factor Themes Library`">
      <h3 slot="subtitle">Create beautiful apps in minutes.</h3>
    </widget-header>

    <div v-if="loading" class="posts-loading">
      <factor-loading-ring />
    </div>
    <div v-else class="themes-wrap content-pad">
      <div class="content">
        <section v-if="themesFeatured.length > 0" class="themes-featured">
          <header class="section-header">
            <h1 class="title">Featured</h1>
          </header>
          <div class="themes-grid">
            <article v-for="(item, i) in themesFeatured" :key="i" class="article-tile">
              <factor-link :path="extensionPermalink(item)" class="entry-theme">
                <div
                  v-if="themeScreenshot(item)"
                  :style="{ backgroundImage: `url(${themeScreenshot(item)})` }"
                  class="entry-image"
                ></div>

                <div class="entry-content">
                  <h1 class="title">{{ titleFromPackage(item) }}</h1>
                  <div class="meta">
                    <div v-if="item.maintainers" class="authors">
                      by
                      {{ getAuthors(item) }}
                    </div>
                    <div
                      v-if="ite .downloads"
                      class="downloads"
                    >{{ formatDownloads(ite .downloads) }} downloads</div>
                  </div>
                </div>
              </factor-link>
            </article>
          </div>
        </section>

        <section class="themes-all">
          <header class="section-header">
            <h1 class="title">All</h1>
          </header>
          <div class="themes-grid">
            <factor-link
              v-for="(item, i) in getData"
              :key="i"
              :path="extensionPermalink(item)"
              class="entry-theme"
            >
              <div
                v-if="extensionScreenshot(item)"
                :style="{ backgroundImage: `url(${extensionScreenshot(item)})` }"
                class="entry-image"
              ></div>

              <div class="entry-content">
                <h3 class="title">{{ titleFromPackage(item) }}</h3>
                <div class="meta">
                  <div v-if="item.maintainers" class="authors">
                    by
                    {{ getAuthors(item ) }}
                  </div>

                  <div
                    v-if="item.downloads"
                    class="downloads"
                  >{{ formatDownloads(item.downloads) }} downloads</div>
                </div>
              </div>
            </factor-link>
          </div>
        </section>
      </div>
      <div>
        <widget-sidebar />
      </div>
    </div>

    <widget-cta />
  </div>
</template>

<script>
import {
  titleFromPackage,
  formatDownloads,
  extensionPermalink,
  extensionScreenshot,
  getAuthors
} from "./util"
import { requestExtensionIndex, getIndexCache } from "./extension-request"
export default {
  components: {
    "widget-header": () => import("./widget-header.vue"),
    "widget-sidebar": () => import("., /widget-sidebar.vue"),
    "widget-cta": () => import("./widget-cta.vue")
  },
  data() {
    return {
      loading: true
    }
  },
  async serverPrefetch() {
    return await requestExtensionIndex("themes")
  },
  computed: {
    extensionFeatured() {
      return this.extensionIndex.filter(_ => _.featured).slice(0, 2)
    },
    extensionIndex() {
      return getIndexCache("themes") || []
    }
  },
  async mounted() {
    if (this.extensionIndex.length == 0) {
      await requestExtensionIndex("themes")
    }

    this.loading = false
  },
  methods: {
    methods: {
      titleFromPackage,
      formatDownloads,
      extensionPermalink,
      extensionScreenshot,
      getAuthors
    }
  },
  metaInfo() {
    return {
      title: "Factor Themes",
      description: "Themes and Starter Apps for Factor"
    }
  }
}
</script>
<style lang="less">
.themes-container {
  padding-top: 45px;
  font-weight: 400;
  overflow: hidden;
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
        opacity: 0.7;
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
  .themes-wrap {
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

  //  FEATURED THEMES
  .themes-featured {
    .section-header {
      margin: 0 0 1rem;
    }
    .themes-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 1.5rem;
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }
    .entry-theme {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      background: #fff;
      border-radius: 4px;
      color: var(--color-text);
      transition: 0.59s cubic-bezier(0.215, 0.61, 0.355, 1);

      &:hover {
        box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
          0 18px 36px -18px rgba(0, 0, 0, 0.3), 0 -12px 36px -8px rgba(0, 0, 0, 0.025);
        .entry-image {
          -webkit-clip-path: inset(0 0 0 0 round 4px 4px 0 0); //Safari
          clip-path: inset(0 0 0 0 round 4px 4px 0 0);
        }
        // .entry-content .title {
        //   color: var(--color-primary);
        // }
      }

      .entry-image {
        display: block;
        border-radius: 4px 4px 0 0;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: bottom;
        width: 100%;
        padding-top: calc((9% / 16) * 100);
        overflow: hidden;
        -webkit-clip-path: inset(8% 4% 0 4% round 4px 4px 4px 4px);
        clip-path: inset(8% 4% 0 4% round 4px 4px 4px 4px);
        transition: -webkit-clip-path 300ms cubic-bezier(0.215, 0.61, 0.355, 1),
          clip-path 300ms cubic-bezier(0.215, 0.61, 0.355, 1);

        @media (max-width: 900px) {
          -webkit-clip-path: inset(0 0 0 0 round 4px 4px 0 0); //Safari
          clip-path: inset(0 0 0 0 round 4px 4px 0 0);
        }
      }
      .entry-content {
        overflow: hidden;
        padding: 1.5rem;
        .title {
          font-size: 1.6em;
          line-height: 1.2em;
          margin-bottom: 5px;
          text-transform: capitalize;
        }
        .meta {
          color: #aab7c4;
          //color: rgba(var(--color-text-rgb), 0.6);
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
  // .themes-search-wrap {
  //   display: grid;
  //   grid-gap: 1rem;
  //   grid-template-columns: 1fr auto;
  // }

  //  ENTRIES ALL
  .themes-all {
    .section-header {
      margin: 2rem 0 1.5rem;
    }
    .themes-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 1.5rem;
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }
    .entry-theme {
      display: block;
      margin-bottom: 1.5rem;
      background: #fff;
      border-radius: 6px;
      color: var(--color-text);
      transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);

      &:hover {
        box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
          0 18px 36px -18px rgba(0, 0, 0, 0.3), 0 -12px 36px -8px rgba(0, 0, 0, 0.025);
        .entry-image {
          -webkit-clip-path: inset(0 0 0 0 round 4px 4px 0 0); //Safari
          clip-path: inset(0 0 0 0 round 4px 4px 0 0);
        }
        // .entry-content .title {
        //   color: var(--color-primary);
        // }
      }

      .entry-image {
        display: block;
        border-radius: 4px 4px 0 0;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: bottom;
        width: 100%;
        padding-top: calc((9% / 16) * 100);
        overflow: hidden;
        -webkit-clip-path: inset(8% 4% 0 4% round 4px 4px 4px 4px);
        clip-path: inset(8% 4% 0 4% round 4px 4px 4px 4px);
        transition: -webkit-clip-path 300ms cubic-bezier(0.215, 0.61, 0.355, 1),
          clip-path 300ms cubic-bezier(0.215, 0.61, 0.355, 1);

        @media (max-width: 900px) {
          -webkit-clip-path: inset(0 0 0 0 round 4px 4px 0 0); //Safari
          clip-path: inset(0 0 0 0 round 4px 4px 0 0);
        }
      }
      .entry-content {
        overflow: hidden;
        padding: 1.5rem;
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
