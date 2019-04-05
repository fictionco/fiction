<template>
  <div class="app-layout-wrap">
    <div v-if="loading" class="user-loading">
      <factor-loading-ring width="4em" />
    </div>
    <div class="app-layout">
      <site-head />

      <div class="app-content">
        <div class="app-nav">
          <dashboard-nav />
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
    "site-head": () => import("./head")
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
      activeRoute: this.$route.path
    }
  },

  watch: {
    $route: function(v) {
      this.activeRoute = v.path
    }
  },
  mounted() {
    this.$user.init(() => {
      this.loading = false
    })
  }
}
</script>
<style src="./css/dashboard.less" lang="less"></style>
<style lang="less">
.user-loading {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.app-layout {
  background-color: #f3f5fa;
  min-height: 100vh;
  // background: #fafbff;
  // display: flex;
  // flex-direction: column;

  .app-content {
    display: grid;
    grid-template-columns: [nav] 2fr [content] 12fr;
    // display: flex;
    // flex-grow: 1;
    // justify-content: center;

    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }

    .app-nav,
    .app-main {
      overflow-y: scroll;
    }
    .app-nav {
      .app-nav-pad {
        padding: 2em 0 2em 1.5em;
      }

      @media (max-width: 767px) {
        position: fixed;
        width: 75%;
        top: 0;
        bottom: 0;
        min-height: 100vh;
        z-index: 100;
        overflow-x: hidden;
        overflow-y: scroll;
        background: #fff;
        box-shadow: 0 0 1px rgba(58, 55, 148, 0.25),
          0 6px 14px 0 rgba(24, 32, 41, 0.06),
          0 12px 34px 0 rgba(24, 32, 41, 0.04);
        transform: translate3d(-100%, 0, 0);
        transition: transform 0.4s ease-out;

        .app-nav-pad {
          padding: 1.5em;
        }
      }

      // flex: 1 1 15%;
      // display: flex;
      // justify-content: flex-end;
      // min-width: 160px;
    }
    .app-main {
      //flex: 1 1 1200px;
      @media (max-width: 767px) {
        grid-column-start: nav;
        grid-column-end: content;
      }

      .app-main-content {
        max-width: 1100px;
      }

      .pane {
        background: #fafbff;
        border-radius: 4px;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04),
          0 6px 14px 0 rgba(24, 32, 41, 0.06),
          0 12px 34px 0 rgba(24, 32, 41, 0.04);
      }
    }
  }
}
</style>