<template>
  <div class="site-head">
    <nav class="navbar container" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <factor-link path="/" class="navbar-item">
          <theme-logo />
        </factor-link>
        <factor-link
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
        </factor-link>
      </div>

      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <factor-link path="/" class="navbar-item">Home</factor-link>
          <factor-link path="/elements" class="navbar-item">Elements</factor-link>
          <app-link path="/documentation" class="navbar-item">Documentation</app-link>

          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">More</a>

            <div class="navbar-dropdown">
              <a class="navbar-item">About</a>
              <a class="navbar-item">Jobs</a>
              <a class="navbar-item">Contact</a>
              <hr class="navbar-divider">
              <a class="navbar-item">Report an issue</a>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <plugin-signin-profile-menu v-if="$uid" />
            <!-- <div class="buttons">
              <a class="button is-primary">
                <strong>Sign up</strong>
              </a>
              <a class="button is-light">Log in</a>
            </div>-->
          </div>
        </div>
      </div>
    </nav>
    <!-- <div class="brand">
        <factor-link path="/">
          <img :src="require(`./img/factor.svg`)" alt="Factor Framework">
        </factor-link>
      </div>
      <div class="nav">
        <slot />
        <plugin-signin-profile-menu v-if="$uid" />
    </div>-->
  </div>
</template>
<style src="#/css/mystyles.scss" lang="sass"></style>
<script>
export default {
  components: {
    "theme-logo": () => import("./logo")
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss">
.site-head {
  padding: 0 1.5em;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.25), 0 1px 15px rgba(0, 0, 0, 0.03);
  background: #fff;
  position: relative;
  z-index: 10;

  .navbar {
    .navbar-item {
      font-family: var(--family-secondary);
      font-weight: var(--weight-bold);
    }
  }
}
</style>