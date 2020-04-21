<template>
  <div class="mobile-head" :class="toggle ? 'active' : 'inactive'">
    <div class="mobile-bar" @click.stop>
      <factor-link path="/" class="site-title mobile-title">{{ siteTitle }}</factor-link>

      <div class="mobile-toggle" @click="toggleNav()">
        <div class="bars">
          <div class="bar" />
          <div class="bar" />
        </div>
      </div>
    </div>
    <transition name="fade">
      Mobile Menu
      <!-- <mobile-menu v-if="toggle" /> -->
    </transition>
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { toLabel, onEvent, setting } from "@factor/api"
import { Route } from "vue-router"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    //mobileMenu: () => import("./mobile-menu.vue"),
  },
  data() {
    return {
      siteTitle: setting("site.title"),
      toggle: false,
    }
  },
  watch: {
    $route: function (this: any, to: Route, from: Route) {
      if (to.path != from.path) {
        this.toggleNav(false)
      }
    },
  },
  mounted() {
    onEvent("reset-ui", () => this.toggleNav(false))
  },
  methods: {
    toLabel,
    toggleNav(this: any, v?: boolean): void {
      if (typeof v == "undefined") {
        this.toggle = !this.toggle
      } else {
        this.toggle = v
      }

      this.clickHandler = () => {
        this.toggle = false

        document.removeEventListener("click", this.clickHandler)
      }

      if (this.toggle) {
        document.addEventListener("click", this.clickHandler)
      } else {
        document.removeEventListener("click", this.clickHandler)
      }
    },
  },
})
</script>

<style lang="less">
.mobile-head {
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease;
  }
  .fade-enter-to,
  .fade-leave {
    .mobile-sidebar-canvas {
      transform: translateX(0);
    }
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    .mobile-sidebar-canvas {
      transform: translateX(-20px);
    }
  }
  .mobile-bar {
    display: flex;
    z-index: 100;
    justify-content: center;
    align-items: center;
    height: 45px;
    padding: 0 0.5em;
    width: 100%;
    background: #fff;
    .mobile-toggle {
      position: absolute;
      right: 0;
    }
  }
  .mobile-sidebar {
    position: fixed;
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;

    display: block;
    z-index: 120;
    top: 0;
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
    .mobile-sidebar-canvas {
      transition: all 0.3s ease;
      position: relative;
      width: 70%;
      height: 100vh;
      background-color: #fff;
      box-shadow: 2px 0 15px rgba(0, 0, 0, 0.2);
    }

    // transition: all 0.2s cubic-bezier(0.4, 0, 0, 1);
    transform: translate(0, 0);
    .docs-sidebar {
      position: static;
      padding: 0;
    }
    .closer {
      font-size: 1.8em;
      padding: 10px;
      display: inline-block;
      line-height: 1;
      position: absolute;
      right: 0;
      opacity: 0.3;
      cursor: pointer;
      z-index: 50;
    }
  }
  .mobile-toggle {
    z-index: 2000;
    font-size: 2em;

    position: relative;
    width: 2em;
    height: 2em;
    opacity: 0.3;
    padding: 0 0.5em;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .bar {
      border-radius: 6px;
      width: 100%;
      height: 4px;
      background-color: var(--color-text);
      transform: translateY(0);
      margin: 0;
      position: absolute;
      width: 1.75rem;
      transition: all 0.2s;
      &:first-child {
        transform: translateY(-6px);
      }
      &:last-child {
        transform: translateY(6px);
      }
    }
  }
  &.active {
    .mobile-toggle {
      .bar {
        &:first-child {
          transform: rotate(45deg);
        }
        &:nth-child(2) {
          transform: rotate(-45deg);
        }
      }
    }
  }
  .aux {
    opacity: 0;
  }
}
</style>
