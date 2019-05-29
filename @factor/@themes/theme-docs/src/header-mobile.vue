<template>
  <div class="mobile-head">
    <div class="mobile-bar">
      <div class="mobile-toggle" @click.stop>
        <div class="bars" @click="toggleNav()">
          <div class="bar" />
          <div class="bar" />
          <div class="bar" />
        </div>
      </div>
      <site-brand class="mobile-brand" />
      <div class="aux">TBD</div>
    </div>

    <div v-if="toggle" class="mobile-sidebar">
      <page-sidebar mode="mobile" />
    </div>
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


<style lang="less">
.mobile-head {
  .mobile-bar {
    display: flex;
    position: relative;
    z-index: 10;
    justify-content: space-between;
    align-items: center;
    height: 45px;
    padding: 0 0.5em;
  }
  .mobile-sidebar {
    position: fixed;
    left: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    height: 100vh;
    display: block;
    z-index: 10;
    top: 0;
    background-color: #fff;
    box-shadow: var(--panel-shadow);
    // transition: all 0.2s cubic-bezier(0.4, 0, 0, 1);
    transform: translate(0, 0);
    .docs-sidebar {
      position: static;
    }
  }
  .mobile-toggle {
    font-size: 2em;
    z-index: 10;
    position: relative;
    width: 1.3em;
    opacity: 0.3;
    padding: 5px;

    .bar {
      border-radius: 5px;
      width: 100%;
      margin: 5px 0;
      height: 4px;
      background-color: var(--color-text);
    }
  }
  .aux {
    opacity: 0;
  }
}
</style>