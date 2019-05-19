<template>
  <div class="site-head">
    <nav class="navbar" role="navigation" aria-label="main navigation">
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
          <a class="navbar-item">Home</a>

          <a class="navbar-item">Documentation</a>

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
<script>
export default {
  components: {
    "theme-logo": () => import("./logo-bulma")
  },
  data() {
    return {}
  }
}
</script>
<style lang="less">
.site-head {
  padding: 0 1.5em;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.25), 0 1px 15px rgba(0, 0, 0, 0.03);
  background: #fff;
  position: relative;
  z-index: 10;
}

.site-head-pad {
  height: 45px;
  align-items: center;
  display: flex;
  justify-content: space-between;

  // .brand {
  //   display: flex;
  //   flex-grow: 1;
  //   align-items: center;
  //   width: 100px;
  //   a img {
  //     width: 80px;
  //   }
  // }
  .nav {
    font-weight: 600;
    display: flex;
    align-items: center;
    @media (max-width: 767px) {
      flex-grow: 2;
      justify-content: flex-end;
    }
    > a {
      letter-spacing: -0.03em;
      font-size: 0.9em;
      color: #506677;
      margin: 0 1em;
      @media (max-width: 767px) {
        margin: 0 1em;
        .fa {
          display: none;
        }
      }
      &:hover,
      &.active-path {
        color: var(--color-primary);
      }
      &:active {
        color: var(--color-primary);
      }
    }
    .profile-menu {
      margin-left: 1em;
    }
    // > a,
    // .nav-dropdown {
    //   margin-left: 0.5em;
    // }
    .nav-dropdown-toggle {
      padding: 4px 6px;
      font-weight: 500;
      border-radius: 4px;
      &.active,
      &:hover {
        opacity: 0.6;
      }
    }
  }
}
</style>