<template>
  <div class="site-head">
    <nav class="navbar container" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <site-brand />

        <div class="navbar-burger burger" @click.stop>
          <div class="mobile-toggle" @click="toggleNav()">
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </div>
        </div>
      </div>

      <div class="navbar-menu">
        <div class="navbar-end">
          <template v-for="(item, index) in setting('site.nav')">
            <div v-if="item.subnav" :key="index" class="navbar-item has-dropdown is-hoverable">
              <factor-link :path="item.path" class="navbar-link">
                <span>{{ item.name }}</span>
              </factor-link>
              <div class="navbar-dropdown">
                <template v-for="(sub, subindex) in item.subnav">
                  <factor-link :key="subindex" :path="sub.path" class="navbar-item">
                    <factor-icon v-if="sub.icon" :icon="sub.icon" />
                    <span>{{ sub.name }}</span>
                  </factor-link>
                </template>
              </div>
            </div>
            <factor-link v-else :key="index" :path="item.path" class="navbar-item">
              <factor-icon v-if="item.icon" :icon="item.icon" />
              <span>{{ item.name }}</span>
            </factor-link>
          </template>
          <div class="navbar-item">
            <div class="buttons">
              <factor-link
                :path="setting('site.nav_cta.path')"
                class="button is-outlined is-rounded"
                target="_blank"
              >
                {{ setting('site.nav_cta.name') }}
                <factor-icon icon="arrow-right" class="ml-2" />
              </factor-link>
            </div>
          </div>
        </div>
      </div>

      <transition name="fade">
        <div v-if="toggle" class="mobile-sidebar">
          <div class="mobile-sidebar-canvas">
            <div class="closer" @click="toggleNav(false)">
              <factor-icon icon="remove" />
            </div>
            <page-sidebar mode="mobile" />
          </div>
        </div>
      </transition>
    </nav>
  </div>
</template>
<style src="#/css/style-vars.scss" lang="sass"></style>
<script>
import { DOM, setting } from "@factor/tools"
export default {
  components: {
    "site-brand": () => import("./el/logo-bulma"),
    "page-sidebar": () => import("./sidebar")
  },
  data() {
    return {
      toggle: false
    }
  },
  watch: {
    $route: function(to, from) {
      if (to.path != from.path) {
        this.toggleNav(false)
      }
    },
    toggle: function(v) {
      if (v) {
        DOM("body").addClass("mobile-nav")
      } else {
        DOM("body").removeClass("mobile-nav")
      }
    }
  },
  methods: {
    setting,
    toggleNav(v) {
      if (typeof v == "undefined") {
        this.toggle = !this.toggle
      } else {
        this.toggle = v
      }

      this.clickHandler = e => {
        this.toggle = false

        document.removeEventListener("click", this.clickHandler)
        // eslint-disable-next-line semi
      }
      if (this.toggle) {
        document.addEventListener("click", this.clickHandler)
      } else {
        document.removeEventListener("click", this.clickHandler)
      }
    }
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

  //Mobile Nav
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    transition: all 0.3s;
  }
  .mobile-sidebar {
    position: fixed;
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;

    display: block;
    z-index: 10;
    top: 0;
    left: 0;
    background-color: rgba(41, 51, 71, 0.7);
    cursor: pointer;
    .mobile-sidebar-canvas {
      position: relative;
      float: right;
      width: 70%;
      height: 100vh;
      background-color: #fff;
      box-shadow: 2px 0 15px rgba(0, 0, 0, 0.2);
    }

    // transition: all 0.2s cubic-bezier(0.4, 0, 0, 1);
    transform: translate(0, 0);
    .nav-sidebar {
      position: static;
      padding: 0;
    }
    .closer {
      font-size: 1.6em;
      padding: 10px;
      display: inline-block;
      line-height: 1;
      position: absolute;
      left: 5px;
      opacity: 0.3;
    }
  }
  .mobile-toggle {
    height: 100%;
  }
}
</style>