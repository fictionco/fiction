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
        <div class="navbar-start">
          <app-link path="/" class="navbar-item">Home</app-link>
          <app-link path="/elements" class="navbar-item">Elements</app-link>
          <app-link path="/documentation" class="navbar-item">Documentation</app-link>

          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">More</a>

            <div class="navbar-dropdown">
              <app-link path="/" class="navbar-item">About</app-link>
              <app-link path="/" class="navbar-item">Jobs</app-link>
              <app-link path="/" class="navbar-item">Contact</app-link>

              <hr class="navbar-divider">
              <app-link path="/" class="navbar-item">Report an issue</app-link>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <plugin-signin-profile-menu v-if="$uid" />
            <div class="buttons">
              <app-link path="/" class="button is-primary">Sign up</app-link>
              <!-- <a class="button is-primary">
                <strong>Sign up</strong>
              </a>
              <a class="button is-light">Log in</a>-->
            </div>
          </div>
        </div>
      </div>

      <!-- <app-link v-if="!$uid" event="signin-modal" data-test="login">
        Sign In
        <factor-icon icon="arrow-right" />
      </app-link>
      <app-link v-else path="/dashboard" class="dashboard-link">
        View Dashboard
        <factor-icon icon="arrow-right" />
      </app-link>-->
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