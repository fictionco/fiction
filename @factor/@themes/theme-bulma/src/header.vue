<template>
  <div class="site-head">
    <nav class="navbar container" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <site-brand />
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
          <template v-for="(item, index) in $setting.get('site.nav')">
            <component :is="item.component" v-if="item.component" :key="index" />
            <factor-link v-else :key="index" :path="item.path" class="navbar-item">
              <factor-icon v-if="item.icon" :icon="item.icon" />
              <span>{{ item.name }}</span>
            </factor-link>
          </template>

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
                :path="$setting.get('site.nav_cta.path')"
                class="button is-outlined is-rounded"
                target="_blank"
              >
                {{ $setting.get('site.nav_cta.text') }}
                <factor-icon icon="arrow-right" class="ml-2" />
              </app-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
<style src="#/css/mystyles.scss" lang="sass"></style>
<script>
export default {
  components: {
    "site-brand": () => import("./el/logo-bulma")
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
    .navbar-brand {
      .navbar-item {
        padding-left: 0;
      }
    }
    .navbar-item {
      font-family: var(--family-secondary);
      font-weight: var(--weight-bold);
    }
  }
}
</style>