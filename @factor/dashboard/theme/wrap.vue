<template>
  <div class="app-wrap">
    <template v-if="loading">
      <div class="user-loading">
        <factor-loading-ring width="4em" />
      </div>
    </template>
    <template v-else>
      <div v-if="toggle" class="mobile-nav" :class="toggle ? 'toggle-nav' : 'toggle-main'">
        <dashboard-nav />
      </div>

      <div class="app-layout" :class="toggle ? 'nav-overlay' : ''">
        <dashboard-head class="app-head" />

        <div class="app-nav" @click.stop>
          <dashboard-nav />
        </div>
        <div class="app-main">
          <div class="app-main-content">
            <div class="mobile-nav-toggle-wrap" @click.stop>
              <factor-btn-dashboard @click="toggleNav()">&larr; Menu</factor-btn-dashboard>
            </div>
            <slot v-if="$slots.default" />
            <router-view v-else />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { factorBtnDashboard, factorLoadingRing } from "@factor/ui"
import * as user from "@factor/user"
import { toLabel } from "@factor/api"
import { Route } from "vue-router"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorBtnDashboard,
    factorLoadingRing,
    "dashboard-nav": () => import("./nav.vue"),
    "dashboard-head": () => import("./head.vue")
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

  watch: {
    $route: function(this: any, to: Route) {
      this.activeRoute = to.path
      this.toggleNav(false)
    }
  },
  async mounted() {
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
.app-wrap {
  @media (max-width: 767px) {
    padding: 0 0.75em;
  }
  .mobile-nav {
    display: none;

    @media (max-width: 960px) {
      &.toggle-nav {
        display: block;
      }
      display: block;
      position: fixed;
      width: 270px;

      padding: 1.5em;
      top: 0;
      bottom: 0;
      left: 0;
      min-height: 100vh;
      z-index: 100;

      overflow-y: scroll;
      background: #fff;
      box-shadow: var(--pane-shadow);
      &.active {
        transform: translate3d(0, 0, 0);
      }
    }
  }
}
.app-layout {
  min-height: 100vh;

  margin: 0 auto;
  display: grid;
  grid-template-columns: 225px 1fr;
  grid-template-rows: 50px 1fr;
  grid-template-areas:
    "header header"
    "nav main";

  .app-head {
    grid-area: header;
    background: #fff;
    box-shadow: 0 1px 0 rgba(200, 204, 228, 0.7);
  }
  .app-main {
    grid-area: main;
    min-width: 0;
    background: #f6fafd;
    box-shadow: inset 0 0 5rem rgba(200, 204, 228, 0.1);
    .app-main-content {
      padding: 1rem;
    }
  }
  .app-nav {
    grid-area: nav;
    box-shadow: 1px 1px 0 rgba(200, 204, 228, 0.7);
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
  }

  .app-main-content .toggle {
    margin: 0.5em 0;
    display: inline-block;
  }

  .mobile-nav-toggle-wrap {
    cursor: pointer;
    display: none;
    margin-bottom: 1em;

    @media (max-width: 960px) {
      display: block;
    }
    @media (max-width: 767px) {
    }
  }
}
</style>
