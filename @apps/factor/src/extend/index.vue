<template>
  <div class="extend-container">
    <div class="extend-index-head">
      <div class="content-pad">
        <h1 class="title">{{ describe.title }}</h1>
        <h3 class="sub-title">{{ describe.description }}</h3>
      </div>
    </div>

    <div v-if="extensionType == 'plugin'" class="extensions-wrap plugins-wrap content-pad">
      <plugin-grid :extensions="extensions" />
      <!-- <div>
        <extension-sidebar :index-data="extensionIndex" />
      </div>-->
    </div>

    <div v-else class="extensions-wrap themes-wrap content-pad">
      <theme-grid :extensions="extensions" />
    </div>

    <call-to-action />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { factorLoadingRing } from "@factor/ui"
import { isLoggedIn } from "@factor/user"
import { stored } from "@factor/api"
import {
  postType,
  titleFromPackage,
  formatDownloads,
  extensionPermalink,
  extensionImage,
  getAuthors
} from "./util"

import { requestIndex } from "./request"
export default Vue.extend({
  components: {
    extensionSidebar: () => import("./sidebar.vue"),
    callToAction: () => import("./el/cta.vue"),
    pluginGrid: () => import("./grid-plugin.vue"),
    themeGrid: () => import("./grid-theme.vue"),
    factorLoadingRing
  },
  data() {
    return {
      loading: false,
      getData: ""
    }
  },
  serverPrefetch() {
    return this.getPosts()
  },
  computed: {
    isLoggedIn,
    extensions(this: any) {
      const index = stored(postType) || {}
      return index.posts ?? []
    },
    extensionType(this: any) {
      return this.$route.path.includes("theme") ? "theme" : "plugin"
    },
    describe(this: any) {
      if (this.extensionType == "plugin") {
        return {
          title: "Factor Plugins",
          description: "Add new features to your app in seconds"
        }
      } else {
        return { title: "Factor Themes", description: "Create beautiful apps in minutes" }
      }
    }
  },
  watch: {
    $route: {
      handler: function(this: any) {
        this.getPosts()
      }
    }
  },
  created() {
    console.log("this.posts", this.posts)
  },
  mounted() {
    if (this.extensions.length == 0) {
      this.getPosts()
    }
  },

  methods: {
    async getPosts(this: any) {
      await requestIndex({ extensionType: this.extensionType })

      this.loading = false
    },
    titleFromPackage,
    formatDownloads,
    extensionPermalink,
    extensionImage,
    getAuthors
  },
  metaInfo() {
    return this.describe
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

    .title {
      font-size: 3em;
      line-height: 1.1;
      font-weight: var(--font-weight-bold, 700);
      letter-spacing: -0.03em;
      text-transform: capitalize;
    }
    .sub-title {
      font-size: 1.8em;
      opacity: 0.7;
    }
  }

  .posts-loading .loading-ring-wrap {
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
      grid-template-columns: 1fr 150px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        grid-gap: 2rem;
      }
    }
  }
}
</style>
