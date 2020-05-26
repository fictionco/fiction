<template>
  <div class="extend-container">
    <div class="extend-index-head">
      <div class="content-pad">
        <h1 class="title">{{ describe.title }}</h1>
        <h3 class="sub-title">{{ describe.description }}</h3>
      </div>
    </div>
    <factor-spinner v-if="loading" />
    <div v-else-if="extensionType == 'plugin'" class="extensions-wrap plugins-wrap content-pad">
      <plugin-slider
        :title="`Featured`"
        :extensions="extensionsFeatured"
        class="grid-featured featured-plugins"
      />
      <div class="grid-sidebar">
        <extension-sidebar :extensions="extensions" />
      </div>
      <div class="grid-boxes">
        <plugin-grid :title="`All Plugins`" :extensions="extensions" />
      </div>
    </div>

    <div v-else class="extensions-wrap themes-wrap content-pad">
      <theme-grid :extensions="extensions" />
    </div>

    <call-to-action />
  </div>
</template>

<script lang="ts">
import { isLoggedIn } from "@factor/user"
import { stored } from "@factor/api"
import { factorSpinner } from "@factor/ui"
import {
  postType,
  titleFromPackage,
  formatDownloads,
  extensionPermalink,
  extensionImage,
  getAuthors,
} from "./util"

import { requestIndex } from "./request"
export default {
  components: {
    callToAction: () => import("./el/cta.vue"),
    pluginSlider: () => import("./slider-plugin.vue"),
    pluginGrid: () => import("./grid-plugin.vue"),
    themeGrid: () => import("./grid-theme.vue"),
    extensionSidebar: () => import("./sidebar.vue"),
    factorSpinner,
  },
  data() {
    return {
      loading: false,
      getData: "",
    }
  },
  serverPrefetch() {
    return this.getPosts()
  },
  computed: {
    isLoggedIn,
    extensions(this: any) {
      const storeKey = [postType, this.extensionType].join("")
      const index = stored(storeKey) || {}

      return index.posts ?? []
    },
    extensionsFeatured(this: any) {
      const getFeatured = this.extensions.filter((item: any) => item.featured == true)
      return getFeatured
    },
    extensionType(this: any) {
      return this.$route.path.includes("theme") ? "theme" : "plugin"
    },
    describe(this: any) {
      if (this.extensionType == "plugin") {
        return {
          title: "Factor Plugins",
          description: "Add new features to your app in seconds",
        }
      } else {
        return { title: "Factor Themes", description: "Create beautiful apps in minutes" }
      }
    },
  },
  watch: {
    $route: {
      handler: function (this: any) {
        this.getPosts()
      },
    },
  },

  mounted() {
    if (this.extensions.length == 0) {
      this.getPosts()
    }
  },

  methods: {
    async getPosts(this: any) {
      this.loading = true

      await requestIndex({ extensionType: this.extensionType })

      this.loading = false
    },
    titleFromPackage,
    formatDownloads,
    extensionPermalink,
    extensionImage,
    getAuthors,
  },
  metaInfo() {
    return this.describe
  },
}
</script>
<style lang="less">
.extend-container {
  font-weight: 400;
  overflow: hidden;
  .coming-soon {
    box-shadow: var(--panel-shadow);
    border-radius: 10px;
    line-height: 1.4;
    text-align: center;
    padding: 6rem 2em 6rem;
    .title {
      font-size: 2rem;
      font-weight: 700;
    }
    .sub-title {
      font-size: 1.5em;
    }
    .actions {
      margin-top: 2rem;
      .cta-tag {
        display: block;
        margin-top: 0.5rem;
        font-weight: 600;
      }
    }
  }

  .extend-index-head {
    padding: 6em 0;
    text-align: center;
    .title {
      font-size: 2.5em;
      line-height: 1.1;
      font-weight: var(--font-weight-bold, 700);
      letter-spacing: -0.03em;
      text-transform: capitalize;
      margin-bottom: 0.5rem;
    }
    .sub-title {
      font-size: 1.5em;
      color: var(--color-text-secondary);
    }
    @media (max-width: 900px) {
      text-align: left;
      .title {
        font-size: 2em;
      }
      .sub-title {
        font-size: 1.3em;
      }
    }
  }

  .spinner-wrap {
    min-height: 400px;
  }

  .content-pad {
    max-width: 1300px;
    margin: 0 auto;
    padding: 0 1.5em;
    width: 100%;
    z-index: 10;
    position: relative;
  }

  @media (max-width: 900px) {
    padding-top: 0;
    .extend-index-head {
      padding: 4em 0;
    }
  }

  .extensions-wrap {
    &.plugins-wrap {
      display: grid;
      grid-gap: 4rem;
      grid-template-columns: 250px 2fr;
      grid-template-areas: "grid-featured grid-featured" "grid-sidebar grid-boxes";
      .grid-featured {
        grid-area: grid-featured;
      }
      .grid-boxes {
        grid-area: grid-boxes;
      }
      .grid-sidebar {
        grid-area: grid-sidebar;
      }
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        grid-gap: 2rem;
      }
    }
  }
}
</style>
