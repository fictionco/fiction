<template>
  <div class="mobile-head">
    <div class="mobile-bar">
      <div class="mobile-toggle" @click.stop>
        <div class="bars" @click="toggleNav()">
          <div class="bar" />
          <div class="bar" />
        </div>
      </div>
      <site-brand class="mobile-brand" />
      <div class="aux">TBD</div>
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
  </div>
</template>
<script>
export default {
  components: {
    "page-sidebar": () => import("./sidebar"),

    "site-brand": () => import("./el/brand")
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
        this.$jquery("body").addClass("mobile-nav")
      } else {
        this.$jquery("body").removeClass("mobile-nav")
      }
    }
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

        document.removeEventListener("click", this.clickHandler)
      };

      if (this.toggle) {
        document.addEventListener("click", this.clickHandler)
      } else {
        document.removeEventListener("click", this.clickHandler)
      }
    }
  }
}
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
    position: fixed;
    z-index: 1000;
    justify-content: space-between;
    align-items: center;
    height: 45px;
    padding: 0 0.5em;
    width: 100%;
    background: #fff;
  }
  .mobile-sidebar {
    position: fixed;
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;

    display: block;
    z-index: 10;
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
    font-size: 2em;
    z-index: 10;
    position: relative;
    width: 1.2em;
    opacity: 0.3;
    padding: 5px;

    .bar {
      border-radius: 5px;
      width: 100%;
      margin: 6px 0;
      height: 3px;
      background-color: var(--color-text);
    }
  }
  .aux {
    opacity: 0;
  }
}
</style>