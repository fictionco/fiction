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
            <div class="header-content">
              <div class="icon">
                <img :src="extensionIcon(item)" alt="Extension Icon" />
              </div>
              <div class="head">
                <div class="title">{{ titleFromPackage(item) }}</div>
                <div class="sub-title">
                  <div class="authors">By {{ getAuthors(item) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="plugins-wrap content-pad">
          <div class="content">
            <widget-lightbox
              :visible.sync="lightboxShow"
              :imgs="screenshotsList(item)"
              :index="lightboxIndex"
            />

            <div class="plugin-images">
              <div v-for="(url, _i) in screenshotsList(item)" :key="_i" class="image-item">
                <div
                  :style="{ backgroundImage: `url(${url})` }"
                  class="image-item-content"
                  @click="showModal(i)"
                ></div>
              </div>
            </div>

            <plugin-entry :text="getContent(item.readme)" class="plugin-content" />
          </div>

          <widget-sidebar />
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
import { factorLoadingRing, factorLink } from "@factor/ui"
import { setting, renderMarkdown } from "@factor/tools"
import Vue from "vue"

export default Vue.extend({
  components: {
    factorLoadingRing,
    factorLink,
    "widget-sidebar": () => import("./widget-sidebar.vue"),
    "widget-lightbox": () => import("../el/el-lightbox.vue"),
    "plugin-entry": () => import("../el/entry.vue"),
    "widget-cta": () => import("./widget-cta.vue")
  },
  data() {
    return {
      getData: "",
      loading: true,
      lightboxShow: false,
      lightboxIndex: 0
    }
  },
  async serverPrefetch() {
    await Promise.all([
      requestExtensionIndex({ type: "plugin" }),
      requestExtensionSingle(this.packageName)
    ])
  },

  computed: {
    packageName() {
      return decodeURI(this.$route.query.package)
    },
    item() {
      return getSingleCache(this.packageName) || {}
    }
  },
  watch: {
    $route: function(to, from) {
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
    async getSingle() {
      this.loading = true
      await requestExtensionSingle(this.packageName)
      this.loading = false
    },
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
      title: "Factor Plugin Library",
      description: "Extend your project features and do more with Factor."
      //image: this.$post.shareImage(this.entry._id)
    }
  }
})
</script>

<style lang="less">
@import "../prism/prism.less";

.plugin-single {
  padding-top: 45px;
  font-weight: 400;
  overflow: hidden;

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
      font-weight: 600;
    }
    .header-content {
      display: flex;
      align-items: center;
      padding: 4rem 0;
      .icon {
        width: 125px;
        height: 125px;
        border-radius: 50%;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
        overflow: hidden;
        img {
          width: 100%;
          max-width: 100%;
        }
      }
      .head {
        padding-left: 3rem;
        letter-spacing: -0.03em;
        line-height: 1.1;
        .title {
          font-size: 2.5em;
          margin-bottom: 0.4em;
        }
        .sub-title {
          opacity: 0.6;
          font-size: 1.5em;
        }
      }
    }
  }

  .plugins-wrap {
    display: grid;
    grid-template-columns: 7fr 3fr;
    grid-gap: 6rem;
    align-items: start;
    padding-top: 2rem;
    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  .plugins-widget-header {
    .content-pad {
      grid-template-columns: 1fr;
    }
    .header-content {
      display: grid;
      grid-template-columns: 75px 3fr;
      grid-gap: 2rem;
      align-items: center;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        grid-gap: 1rem;
      }

      .header-image {
        display: flex;
        justify-content: center;
        width: 75px;
        height: 75px;
        border-radius: 50%;
        overflow: hidden;
        background: var(--color-bg-contrast);
        border: 1px solid var(--color-bg-contrast-more);
        box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.3);
        img {
          width: 100%;
          max-width: 100%;
        }
      }

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

    .plugin-images {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 160px));
      grid-gap: 1rem;
      margin-bottom: 1.5rem;
      .image-item {
        cursor: pointer;
        .image-item-content {
          width: 100%;
          padding: 50% 0;
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
