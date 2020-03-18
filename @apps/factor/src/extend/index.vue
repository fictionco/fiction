<template>
  <div class="extend-container">
    <div class="extend-index-head">
      <div class="content-pad">
        <template v-if="extensionType == 'plugin'">
          <h1 class="title">Factor Plugins</h1>
          <h3 class="sub-title">Add new features to your app in seconds</h3>
        </template>
        <template v-else>
          <h1 class="title">Factor Themes</h1>
          <h3 class="sub-title">Create beautiful apps in minutes.</h3>
        </template>
      </div>
    </div>

    <div v-if="loading" class="posts-loading">
      <factor-loading-ring />
    </div>
    <div v-else-if="!loading && !isLoggedIn" class="coming-soon">
      <div class="title">Coming Soon 👋</div>
      <div class="sub-title">Themes will launch April 21, 2020</div>

      <div class="actions">
        <factor-link btn="primary" path="/signin?newAccount">Create Account &rarr;</factor-link>
        <span class="cta-tag">for early access.</span>
      </div>
    </div>

    <div v-else-if="extensionType == 'plugin'" class="extensions-wrap plugins-wrap content-pad">
      {{ getData }}
      <div class="plugins-grid">
        <grid-item-plugin />
        <grid-item-plugin />
        <grid-item-plugin />
      </div>
      <div>
        <widget-sidebar :index-data="extensionIndex" />
      </div>
    </div>

    <div v-else class="extensions-wrap themes-wrap content-pad">
      <div class="themes-grid">
        <grid-item-theme />
        <grid-item-theme />
        <grid-item-theme />
      </div>
    </div>

    <widget-cta />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { factorLoadingRing, factorLink } from "@factor/ui"
import { userInitialized, isLoggedIn } from "@factor/user"
import {
  titleFromPackage,
  formatDownloads,
  extensionPermalink,
  extensionIcon,
  getAuthors
} from "./util"
import { requestExtensionIndex, getIndexCache } from "./request"
export default Vue.extend({
  components: {
    "widget-sidebar": () => import("./sidebar.vue"),
    "widget-cta": () => import("./el/cta.vue"),
    "grid-item-plugin": () => import("./grid-item-plugin.vue"),
    "grid-item-theme": () => import("./grid-item-theme.vue"),
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
    isLoggedIn,
    extensionType(this: any) {
      return this.$route.path.includes("theme") ? "theme" : "plugin"
    },
    extensionFeatured(this: any) {
      return this.extensionIndex.filter(_ => _.featured).slice(0, 2)
    },
    extensionIndex() {
      return getIndexCache() || []
    }
  },
  async mounted() {
    const promises: Promise<any>[] = [userInitialized()]

    if (this.extensionIndex.length == 0) {
      promises.push(requestExtensionIndex({ type: "plugins" }))
    }

    await Promise.all(promises)

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
      title: "Factor " + this.extensionType,
      description: "Add advanced features to your app in seconds."
    }
  }
})
</script>
<style lang="less">
.extend-container {
  @import "~./style.less";
  padding-top: 45px;
  font-weight: 400;
  overflow: hidden;
  .extend-index-head {
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
  .extensions-wrap {
    &.plugins-wrap {
      display: grid;
      grid-gap: 4rem;
      grid-template-columns: 7fr 3fr;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        grid-gap: 2rem;
      }
    }

    .section-header {
      .title {
        font-size: 1.4em;
        font-weight: var(--font-weight-bold, 700);
        letter-spacing: -0.02em;

        @media (max-width: 900px) {
          font-size: 1.7em;
          line-height: 1.2;
        }
      }
    }

    .plugins-grid,
    .themes-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 3rem;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
