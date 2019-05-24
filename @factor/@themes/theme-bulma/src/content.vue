<template>
  <div class="content-layout">
    <site-head>
      <div class="navbar-brand">
        <app-link path="/" class="navbar-item">
          <theme-logo />
        </app-link>
        <app-link
          path="/"
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </app-link>
      </div>

      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-end">
          <app-link path="/" class="navbar-item">Home</app-link>
          <app-link path="/elements" class="navbar-item">Elements</app-link>

          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">Page Templates</a>

            <div class="navbar-dropdown">
              <app-link path="/" class="navbar-item">About</app-link>
              <app-link path="/" class="navbar-item">Jobs</app-link>
              <app-link path="/" class="navbar-item">Contact</app-link>

              <hr class="navbar-divider">
              <app-link path="/" class="navbar-item">Report an issue</app-link>
            </div>
          </div>
          <div class="navbar-item">
            <div class="buttons">
              <app-link
                path="https://www.fiction.com/"
                class="button is-outlined is-rounded"
                target="_blank"
              >
                Get Started
                <factor-icon icon="arrow-right" class="ml-2" />
              </app-link>
            </div>
          </div>
        </div>
      </div>
    </site-head>
    <div class="content-main" :style="bg">
      <div class="content-main-content">
        <slot v-if="$slots.default" />
        <router-view v-else />
      </div>

      <site-footer v-if="$route.meta.footer !== false" />
    </div>
  </div>
</template>
<style src="#/css/mystyles.scss" lang="sass"></style>
<script>
export default {
  components: {
    "theme-logo": () => import("./logo"),
    "site-head": () => import("#/site-head"),
    "site-footer": () => import("#/site-footer")
  },
  computed: {
    nav() {
      console.log("this.$route.meta", this.$route.meta)
      return typeof this.$route.meta.nav != "undefined"
        ? this.$route.meta.nav
        : true
    },
    bg() {
      const background = this.$route.meta.background || false

      if (!background) {
        return ""
      } else {
        return {
          background
        }
      }
    }
  }
}
</script>

<style lang="less">
.content-layout {
  display: flex;
  flex-direction: column;

  .navbar-brand {
    .navbar-item {
      padding-left: 0;
    }
  }

  .content-content {
    display: flex;
    flex-grow: 1;
    .content-nav,
    .content-main {
      overflow-y: scroll;
    }
    .content-nav {
      flex: 0 0 250px;
      padding: 1em 1.5em;
      background: rgba(38, 67, 89, 0.08);
    }
    .content-main {
      flex: 1 1 100%;
      display: flex;
      flex-direction: column;
      .content-main-content {
        padding: 1.5em;
        flex-grow: 1;
      }
      .content-footer {
        padding: 1em 1.5em;
        font-size: 0.85em;
        color: rgba(38, 67, 89, 0.2);
        text-align: center;
      }
    }
  }
}
</style>