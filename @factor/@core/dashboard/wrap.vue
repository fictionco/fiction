<template>
  <div class="dashboard-interface">
    <div v-if="loading" class="user-loading">
      <factor-loading-ring width="4em" />
    </div>
    <div class="app-layout">
      <dashboard-head />

      <div class="app-content">
        <div class="app-nav" @click.stop>
          <dashboard-btn class="app-nav-toggle" @click="toggleNav()">
            <factor-icon icon="bars" />Menu
          </dashboard-btn>
          <dashboard-nav :class="{active: toggle }" />
        </div>
        <div class="app-main">
          <div class="app-main-content">
            <slot v-if="$slots.default" />
            <router-view v-else />
          </div>
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
      description: `Dashboard for Fiction's ${niceName} tools.`,
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
    this.$user.init(uid => {
      if (uid) {
        this.loading = false
      }
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
.app-layout {
  background-color: var(--canvas-bg);
  min-height: 100vh;
  // background: #fafbff;

  .app-content {
    display: grid;
    grid-template-columns: [nav] 2fr [content] 12fr;

    @media (max-width: 960px) {
      grid-template-columns: 1fr;
    }

    // .app-main {
    //   overflow-y: scroll;
    // }
    .app-nav {
      .app-nav-pad {
        padding: 1.5em 0 2em 1.5em;
      }
      .app-nav-toggle {
        cursor: pointer;
        display: none;
        @media (max-width: 960px) {
          display: block;
          margin: 1.5em 1.5em 0;
        }
        @media (max-width: 767px) {
          margin: 1em 1em 0;
        }
      }
    }
    .app-main {
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
      }

      .app-main-content {
        max-width: 1100px;
      }
    }
  }
}
</style>