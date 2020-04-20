<template>
  <div class="app-wrap">
    <div class="app-layout" :class="toggle ? 'nav-overlay' : ''">
      <div class="app-nav">
        <dashboard-manager />
      </div>
      <div class="app-main">
        <div class="app-main-content">
          <template v-if="loading">
            <div class="user-loading">
              <factor-spinner width="4em" />
            </div>
          </template>
          <slot v-else-if="$slots.default" />
          <router-view v-else />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { factorSpinner } from "@factor/ui"
import * as user from "@factor/user"
import { toLabel, getPostTypeConfig } from "@factor/api"
import { Route } from "vue-router"
import Vue from "vue"

export default Vue.extend({
  components: {
    factorSpinner,
    dashboardManager: () => import("./manager/manager.vue"),
  },

  metaInfo() {
    const pageName = this.$route.path.split("/").pop()
    const niceName = toLabel(pageName)

    return {
      title: niceName,
      description: `Factor Dashboard`,
      titleTemplate: "%s - Fiction Dashboard",
    }
  },
  data() {
    return {
      vis: false,
      loading: true,
      activeRoute: this.$route.path,
      toggle: false,
    }
  },

  computed: {
    postType(this: any): string {
      return this.$route.params.postType || ""
    },
    postTypeConfig(this: any) {
      return getPostTypeConfig(this.postType)
    },
  },

  watch: {
    $route: function (this: any, to: Route) {
      this.activeRoute = to.path
      this.toggleNav(false)
    },
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
    },
  },
})
</script>
<style src="./style.less" lang="less"></style>

<style lang="less">
.user-loading {
  padding-top: 30vh;
}

.app-layout {
  background: var(--color-bg-contrast);
  --menu-shadow: 0 0 0 1px rgba(50, 50, 93, 0.1), 0 2px 5px -1px rgba(50, 50, 93, 0.25),
    0 15px 15px -6px rgba(50, 50, 93, 0.2), 0 1px 3px -1px rgba(0, 0, 0, 0.3);
  --panel-border-color: rgba(200, 204, 228, 0.7);
  min-height: 100vh;

  margin: 0 auto;
  display: grid;
  grid-template-columns: 17rem 1fr;
  grid-template-areas: "nav main";

  .app-main,
  .app-nav {
    height: 100vh;
    overflow: auto;
  }
  .app-main {
    grid-area: main;
    min-width: 0;
    background: var(--color-bg-contrast);
    box-shadow: inset 0 0 5rem rgba(200, 204, 228, 0.1);
    .app-main-content {
      height: 100%;
    }
  }
  .app-nav {
    grid-area: nav;

    position: relative;
  }

  @media (max-width: 900px) {
    &.nav-overlay {
      opacity: 0.6;
    }
    display: block;

    .app-main {
      height: auto;
    }
    .app-nav {
      height: 4rem;
      overflow: initial;
      .app-manager {
        position: absolute;
        background: #fff;
        z-index: 100;
        border-right: none;

        width: 100%;

        .app-manager {
          height: 100%;
        }
      }
    }
  }
}
</style>
