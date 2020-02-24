<template>
  <div class="app-wrap">
    <template v-if="loading">
      <div class="user-loading">
        <factor-loading-ring width="4em" />
      </div>
    </template>
    <template v-else>
      <div class="app-layout" :class="toggle ? 'nav-overlay' : ''">
        <dashboard-head class="app-head" />

        <div class="app-nav" @click.stop>
          <dashboard-nav />
        </div>
        <div class="app-main">
          <div class="app-main-content">
            <slot v-if="$slots.default" />
            <router-view v-else />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { factorLoadingRing } from "@factor/ui"
import * as user from "@factor/user"
import { toLabel, getPostTypeConfig } from "@factor/api"
import { Route } from "vue-router"
import Vue from "vue"

export default Vue.extend({
  components: {
    factorLoadingRing,
    dashboardNav: () => import("./nav.vue"),
    dashboardHead: () => import("./head.vue")
  },
  metaInfo() {
    const pageName = this.$route.path.split("/").pop()
    const niceName = toLabel(pageName)

    return {
      title: niceName,
      description: `Factor Dashboard`,
      titleTemplate: "%s - Fiction Dashboard"
    }
  },
  data() {
    return {
      loading: true,
      activeRoute: this.$route.path,
      toggle: false
    }
  },

  computed: {
    postType(this: any): string {
      return this.$route.params.postType || ""
    },
    postTypeConfig(this: any) {
      return getPostTypeConfig(this.postType)
    }
  },

  watch: {
    $route: function(this: any, to: Route) {
      this.activeRoute = to.path
      this.toggleNav(false)
    }
  },
  async mounted() {
    /**
     * Wait for user information ready before loading interface
     */
    await user.userInitialized()

    this.loading = false
  },

  methods: {
    toggleNav(this: any, toggle?: boolean) {
      if (!document) return

      if (typeof toggle == "undefined") {
        this.toggle = !this.toggle
      } else {
        this.toggle = toggle
      }

      this.clickHandler = () => {
        this.toggle = false
        document.removeEventListener("click", this.clickHandler, false)
      }

      if (this.toggle) {
        document.addEventListener("click", this.clickHandler, false)
      } else {
        document.removeEventListener("click", this.clickHandler, false)
      }
    }
  }
})
</script>
<style src="./style.less" lang="less"></style>

<style lang="less">
.user-loading {
  padding-top: 30vh;
}

.app-layout {
  --panel-border-color: rgba(200, 204, 228, 0.7);
  min-height: 100vh;

  margin: 0 auto;
  display: grid;
  grid-template-columns: 18rem 1fr;
  grid-template-rows: 50px 1fr;
  grid-template-areas:
    "header header"
    "nav main";

  .app-head {
    grid-area: header;
    background: #fff;
    box-shadow: 0 1px 0 var(--panel-border-color);
  }
  .app-main {
    grid-area: main;
    min-width: 0;
    background: #f6fafd;
    box-shadow: inset 0 0 5rem rgba(200, 204, 228, 0.1);
    .app-main-content {
      padding: 2rem;
    }
  }
  .app-nav {
    grid-area: nav;
    box-shadow: 1px 1px 0 var(--panel-border-color);
    position: relative;
    .app-nav-pad {
      padding: 1rem;
    }
  }

  @media (max-width: 960px) {
    &.nav-overlay {
      opacity: 0.6;
    }
    grid-template-areas:
      "header header"
      "main main";
    .app-nav {
      display: none;
    }
    .app-main {
      .app-main-content {
        padding: 0.5rem;
      }
    }
  }
}
</style>
