<template>
  <div class="app-wrap">
    <div v-if="toggle" class="mobile-nav" :class="toggle ? 'toggle-nav' : 'toggle-main'">
      <dashboard-nav />
    </div>

    <div class="app-layout" :class="toggle ? 'nav-overlay': ''">
      <dashboard-head class="app-head" />

      <div class="app-nav" @click.stop>
        <dashboard-nav />
      </div>
      <div class="app-main">
        <div class="app-main-content">
          <div class="mobile-nav-toggle-wrap" @click.stop>
            <dashboard-btn @click="toggleNav()">
              <factor-icon icon="arrow-left" />&nbsp;Menu
            </dashboard-btn>
          </div>
          <slot v-if="$slots.default" />
          <router-view v-else />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  components: {
    "dashboard-nav": () => import("./nav"),
    "dashboard-head": () => import("./head")
  },
  metatags() {
    const pageName = this.$route.path.split("/").pop()
    const niceName = this.$utils.toLabel(pageName)
    return {
      title: niceName,
      description: `Dashboard`,
      titleSuffix: " - Fiction Dashboard",
      priority: 50
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
    $route: function(v) {
      this.activeRoute = v.path
      this.toggleNav(false)
    }
  },
  mounted() {
    this.$user.init(user => {
      // this.loading = false
    })
  },

  methods: {
    toggleNav(v) {
      if (typeof v == "undefined") {
        this.toggle = !this.toggle
      } else {
        this.toggle = v
      }

      this.clickHandler = e => {
        this.toggle = false
        document.removeEventListener("click", this.clickHandler, false)
      };

      if (this.toggle) {
        document.addEventListener("click", this.clickHandler, false)
      } else {
        document.removeEventListener("click", this.clickHandler, false)
      }
    }
  }
}
</script>
<style src="./css/style.less" lang="less"></style>

<style lang="less">
.user-loading {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.app-wrap {
  padding: 0 2em;
  .mobile-nav {
    display: none;
    &.toggle-nav {
      display: block;
    }
    @media (max-width: 960px) {
      display: block;
      position: fixed;
      width: 350px;
      padding: 1.5em;
      top: 0;
      bottom: 0;
      left: 0;
      min-height: 100vh;
      z-index: 100;

      overflow-y: scroll;
      background: #fff;
      box-shadow: var(--pane-shadow);
      // transform: translate3d(-100%, 0, 0);
      // transition: transform 0.1s ease-out;
      &.active {
        transform: translate3d(0, 0, 0);
      }
    }
  }
}
.app-layout {
  min-height: 100vh;
  max-width: 1300px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 70px 1fr;
  grid-template-areas:
    "header header"
    "nav main";

  &.nav-overlay {
    opacity: 0.6;
  }
  .app-head {
    grid-area: header;
    align-self: center;
  }
  .app-main {
    grid-area: main;
  }
  .app-nav {
    grid-area: nav;
  }

  @media (max-width: 960px) {
    grid-template-areas:
      "header header"
      "main main";
    .app-nav {
      display: none;
    }
  }

  .app-nav {
    .app-nav-pad {
      padding: 0.5em 0;
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
  // .app-main {
  //   @media (max-width: 767px) {
  //     grid-template-columns: 1fr;
  //   }
  // }
}
</style>