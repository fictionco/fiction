<template>
  <div class="themes-container-single">
    <div v-if="loading" class="posts-loading">
      <factor-loading-ring />
    </div>
    <div v-else>
      <section>
        <widget-header :image="themeIcon(item)" :title="formatName(item)">
          <div slot="subtitle">
            <div v-if="item.maintainers" class="authors">
              by
              {{ getAuthors(item) }}
            </div>

            <div
              v-if="item.downloads"
              class="downloads"
            >{{ formatDownloads(item.downloads) }} downloads</div>
          </div>
        </widget-header>

        <div class="themes-wrap content-pad">
          <div class="content">
            <factor-lightbox
              :visible.sync="lightboxShow"
              :imgs="screenshotsList(item)"
              :index="lightboxIndex"
            />

            <div v-if="item" class="theme-images">
              <div v-for="(url, _i) in screenshotsList(item)" :key="_i" class="image-item">
                <img :src="url" class="image-item-content" alt="theme image" @click="showModal(i)" />
              </div>
            </div>

            <factor-link btn="primary" path="/">Live Demo &rarr;</factor-link>

            <theme-entry :text="getContent(item.readme)" class="theme-content" />
          </div>

          <div>
            Latest Version:
            <br />
            updated {{ standardDate(item.time.modified) }}
            <br />
            released {{ standardDate(item.time.created) }}
            <br />
            <br />More theme details will go here
          </div>
        </div>
      </section>
    </div>

    <widget-cta />
  </div>
</template>
<script lang="ts">
import {
  titleFromPackage,
  formatDownloads,
  extensionPermalink,
  extensionIcon,
  screenshotsList,
  getAuthors
} from "./util"

import {
  getSingleCache,
  requestExtensionSingle,
  requestExtensionIndex
} from "./extension-request"
import { factorLoadingRing, factorLink, factorLightbox } from "@factor/ui"
import { setting, renderMarkdown, standardDate } from "@factor/tools"
import Vue from "vue"

export default Vue.extend({
  components: {
    factorLoadingRing,
    factorLink,
    factorLightbox,
    "widget-header": () => import("./widget-header.vue"),
    "widget-cta": () => import("./widget-cta.vue")
  },
  data() {
    return {
      loading: true,
      lightboxShow: false,
      lightboxIndex: 0
    }
  },
  async serverPrefetch() {
    await Promise.all([
      requestExtensionIndex({ type: "themes" }),
      requestExtensionSingle(this.packageName)
    ])

    return
  },
  computed: {
    packageName() {
      return decodeURI(this.$route.query.package)
    },
    item() {
      return getSingleCache(this.packageName) || {}
    }
  },
  async mounted() {
    const data = getSingleCache(this.packageName)

    if (!data) {
      await requestExtensionSingle(this.packageName)
    }

    require("../prism/prism.js")
    this.prism = window.Prism

    this.loading = false
  },
  methods: {
    standardDate,
    titleFromPackage,
    formatDownloads,
    extensionPermalink,
    extensionIcon,
    getAuthors,
    screenshotsList,
    setting,

    showModal(_ind) {
      this.lightboxIndex = _ind
      this.lightboxShow = true
    },
    getContent(value) {
      return value ? renderMarkdown(value, { variables: true }) : ""
    }
  },
  metaInfo() {
    return {
      title: "Factor Theme Directory",
      description: "Extend your project features and do more with Factor."
    }
  }
})
</script>

<style lang="less">
@import "../prism/prism.less";

.themes-container-single {
  padding-top: 45px;
  font-weight: 400;
  overflow: hidden;

  .content-pad {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5em;
    width: 100%;
    z-index: 10;
    position: relative;
  }

  .themes-wrap {
    display: grid;
    grid-template-columns: 7fr 3fr;
    grid-gap: 6rem;
    align-items: start;
    padding-top: 2rem;
    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  .themes-widget-header {
    .content-pad {
      grid-template-columns: 1fr;
    }
    .header-content {
      .page-title-sub .authors,
      .page-title-sub .categories {
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
      .page-title-sub .downloads {
        display: inline-block;
        margin-left: 2rem;
        @media (max-width: 900px) {
          display: block;
          margin-left: 0;
        }
      }
    }
  }

  .content {
    .back {
      display: block;
      font-size: 1.2em;
      font-weight: 500;
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin-bottom: 1.5rem;
    }

    .theme-images {
      margin-bottom: 1.5rem;
      .image-item {
        cursor: pointer;
        .image-item-content {
          width: 100%;
          //padding: 50% 0;
          position: relative;
          background-size: cover;
          background-position: 50%;
          border-radius: 6px;
          background-color: #fff;
          border: 1px solid var(--color-bg-contrast-more);
          background-size: cover;
          transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
          &:hover {
            box-shadow: 0 6px 12px -2px rgba(50, 50, 93, 0.25),
              0 3px 7px -3px rgba(0, 0, 0, 0.3);
            transform: scale(1.05);
          }
        }
      }
    }
  }
}
</style>
